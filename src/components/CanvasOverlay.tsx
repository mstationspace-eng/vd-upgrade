// src/components/CanvasOverlay.tsx

import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  generateShapes,
  scalePoint,
  drawHoveredRectangle,
  drawHoveredPolygon,
  isPointInPolygon,
  Shape,
} from "../utils/canvasUtils";

interface CanvasOverlayProps {
  imageRef: React.RefObject<HTMLImageElement>;
  currentFrame: number;
}

const CanvasOverlay: React.FC<CanvasOverlayProps> = ({ imageRef, currentFrame }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapesRef = useRef<Shape[]>([]);
  const navigate = useNavigate();

  const [hoveredFloor, setHoveredFloor] = useState<string | number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const colors = useRef([
    "red", "green", "blue", "orange", "purple", "cyan", "magenta",
    "yellow", "brown", "pink", "lime", "teal", "navy", "olive", "maroon", "gold"
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const computeShapes = () => {
        const shapesData = generateShapes();
        const newShapes: Shape[] = [];
        const originalMaxPoint = { x: 1600, y: 1139 };
        const newMaxPoint = { x: image.clientWidth, y: image.clientHeight };
        const scaleX = newMaxPoint.x / originalMaxPoint.x;
        const scaleY = newMaxPoint.y / originalMaxPoint.y;
  
        shapesData.forEach((shape) => {
          if (shape.type === 'poly') {
            newShapes.push({
              type: 'poly',
              points: shape.points.map(p => scalePoint(p, scaleX, scaleY))
            });
          } else if (shape.type === 'rect') {
            const topLeft = scalePoint({ x: shape.minX, y: shape.minY }, scaleX, scaleY);
            newShapes.push({
              type: 'rect',
              minX: topLeft.x,
              minY: topLeft.y,
              width: shape.width * scaleX,
              height: shape.height * scaleY,
            });
          }
        });
        shapesRef.current = newShapes;
    };

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const mousePoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let floorFound = false;
  
        shapesRef.current.forEach((shape, i) => {
          let isHovered = false;
          if (shape.type === 'rect') {
            isHovered = mousePoint.x >= shape.minX && mousePoint.x <= shape.minX + shape.width &&
                        mousePoint.y >= shape.minY && mousePoint.y <= shape.minY + shape.height;
          } else {
            isHovered = isPointInPolygon(mousePoint, shape.points);
          }

          if (isHovered) {
            const color = colors.current[i % colors.current.length];
            if (shape.type === 'rect') {
                drawHoveredRectangle(ctx, shape, color);
            } else {
                drawHoveredPolygon(ctx, shape, color);
            }

            if (!floorFound) {
              if (i === 0) {
                setHoveredFloor("Roof");
              } else {
                const floorNumber = shapesRef.current.length - i;
                setHoveredFloor(floorNumber);
              }
              setTooltipPosition({ x: e.clientX, y: e.clientY });
              floorFound = true;
            }
          }
        });
  
        if (!floorFound) {
          setHoveredFloor(null);
        }
    };

    // ## تم تعديل هذه الدالة بالكامل ##
    const handleClick = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const mousePoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  
        // ابحث عن أول شكل تم النقر عليه وتوقف
        for (let i = 0; i < shapesRef.current.length; i++) {
            const shape = shapesRef.current[i];
            let isClicked = false;

            if (shape.type === 'rect') {
                isClicked = mousePoint.x >= shape.minX && mousePoint.x <= shape.minX + shape.width &&
                            mousePoint.y >= shape.minY && mousePoint.y <= shape.minY + shape.height;
            } else {
                isClicked = isPointInPolygon(mousePoint, shape.points);
            }

            if (isClicked) {
                if (i === 0) { // الحالة الأولى: النقر على السقف
                    navigate(`/roof/${currentFrame}`);
                } else { // الحالة الثانية: النقر على أي طابق آخر
                    const floorNumber = shapesRef.current.length - i;
                    
                    if (floorNumber === 1) { // إذا كان الطابق هو الأول (الأرضي)
                        navigate(`/ground/${currentFrame}`);
                    } else { // إذا كان أي طابق آخر (غرفة)
                        navigate(`/room/${currentFrame}`);
                    }
                }
                return; // توقف عن البحث بعد العثور على أول نقرة
            }
        }
    };

    const handlePointerDown = (e: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        const mousePoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };

        const isOverShape = shapesRef.current.some(shape => {
            if (shape.type === 'rect') {
                return mousePoint.x >= shape.minX && mousePoint.x <= shape.minX + shape.width &&
                       mousePoint.y >= shape.minY && mousePoint.y <= shape.minY + shape.height;
            } else {
                return isPointInPolygon(mousePoint, shape.points);
            }
        });

        if (isOverShape) {
            e.stopPropagation();
        }
    };

    const handleMouseLeave = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHoveredFloor(null);
    };

    const handleResize = () => {
        canvas.width = image.clientWidth;
        canvas.height = image.clientHeight;
        computeShapes();
    };

    if (image.complete) {
        handleResize();
    } else {
        image.onload = handleResize;
    }

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("click", handleClick);
    window.addEventListener("resize", handleResize);

    return () => {
        canvas.removeEventListener("pointerdown", handlePointerDown);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
        canvas.removeEventListener("click", handleClick);
        window.removeEventListener("resize", handleResize);
        image.onload = null;
    };
}, [imageRef, navigate, currentFrame]);

  return (
    <>
      <canvas ref={canvasRef} className="absolute top-0 left-0 z-10 pointer-events-auto" />
      {hoveredFloor && (
        <div
          className="fixed z-50 pointer-events-none bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-sm border border-white/20"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 40,
          }}
        >
          {typeof hoveredFloor === 'string' ? hoveredFloor : `Floor ${hoveredFloor}`}
        </div>
      )}
    </>
  );
};

export default CanvasOverlay;