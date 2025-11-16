import React, { useRef, useEffect, useState } from "react";
import {
  generateFloorsPointFrame90,
  updatePoints,
  drawHoveredRectangle,
  Rectangle,
} from "../utils/canvasUtilsFrame90"; 

interface CanvasOverlayProps {
  imageRef: React.RefObject<HTMLImageElement>;
}

const CanvasOverlayFrame90: React.FC<CanvasOverlayProps> = ({ imageRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rectanglesRef = useRef<Rectangle[]>([]);
  const floorDataRef = useRef<any[]>([]); 

  const [hoveredFloor, setHoveredFloor] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const colors = useRef([
    "red", "green", "blue", "orange", "purple", "cyan", "magenta",
    "yellow", "brown", "pink", "lime", "teal", "navy", "olive", "maroon",
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const computeRectangles = () => {
      const floors = generateFloorsPointFrame90(); 
      const newRectangles: Rectangle[] = [];

      const originalMaxPoint = { x: 3840, y: 2733 };
      const newMaxPoint = { x: image.clientWidth, y: image.clientHeight };

      const scaleX = newMaxPoint.x / originalMaxPoint.x;
      const scaleY = newMaxPoint.y / originalMaxPoint.y;

      floors.forEach((floor) => {
        const topLeft = updatePoints(
          { x: floor.x1, y: floor.y1 },
          newMaxPoint
        );
        newRectangles.push({
          minX: topLeft.x,
          minY: topLeft.y,
          width: floor.width * scaleX,
          height: floor.height * scaleY,
        });
      });

      rectanglesRef.current = newRectangles;
      floorDataRef.current = floors; 
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let floorFound = false;

      rectanglesRef.current.forEach((r, i) => {
        if (
          mouseX >= r.minX &&
          mouseX <= r.minX + r.width &&
          mouseY >= r.minY &&
          mouseY <= r.minY + r.height
        ) {
          const floorData = floorDataRef.current[i];
          const rotation = floorData?.rotation;
          drawHoveredRectangle(
            ctx,
            r,
            colors.current[i % colors.current.length],
            rotation
          );
          if (!floorFound) {
            setHoveredFloor(rectanglesRef.current.length - i);
            setTooltipPosition({ x: e.clientX, y: e.clientY });
            floorFound = true;
          }
        }
      });

      if (!floorFound) {
        setHoveredFloor(null);
      }
    };

    const handleMouseLeave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHoveredFloor(null);
    };

    const handleResize = () => {
      canvas.width = image.clientWidth;
      canvas.height = image.clientHeight;
      computeRectangles();
    };

    handleResize();

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, [imageRef]);

  return (
    <>
      <canvas ref={canvasRef} className="absolute top-0 left-0 z-0" />
      {hoveredFloor && (
        <div
          className="fixed z-50 pointer-events-none bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-sm border border-white/20"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 40,
          }}
        >
          Floor {hoveredFloor}
        </div>
      )}
    </>
  );
};

export default CanvasOverlayFrame90;