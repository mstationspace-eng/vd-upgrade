// src/components/CanvasOverlayFrame181.tsx

import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFloorsData,
  updatePoints,
  drawHoveredPolygon,
  isPointInPolygon,
  Point,
} from "../utils/canvasUtilsFrame181";

interface CanvasOverlayProps {
  imageRef: React.RefObject<HTMLImageElement>;
  currentFrame: number;
}

const CanvasOverlayFrame181: React.FC<CanvasOverlayProps> = ({
  imageRef,
  currentFrame,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const polygonsRef = useRef<Point[][]>([]);
  const navigate = useNavigate();

  const [hoveredFloor, setHoveredFloor] = useState<string | number | null>(
    null
  );
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const colors = useRef([
    "red",
    "green",
    "blue",
    "orange",
    "purple",
    "cyan",
    "magenta",
    "yellow",
    "brown",
    "pink",
    "lime",
    "teal",
    "navy",
    "olive",
    "maroon",
    "gold",
    "silver",
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const computePolygons = () => {
      const floors = getFloorsData();
      const newPolygons: Point[][] = [];
      const newMaxPoint = { x: image.clientWidth, y: image.clientHeight };

      floors.forEach((floor) => {
        const scaledP1 = updatePoints(floor.p1, newMaxPoint);
        const scaledP2 = updatePoints(floor.p2, newMaxPoint);
        const scaledP3 = updatePoints(floor.p3, newMaxPoint);
        const scaledP4 = updatePoints(floor.p4, newMaxPoint);
        newPolygons.push([scaledP1, scaledP2, scaledP3, scaledP4]);
      });
      polygonsRef.current = newPolygons;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mousePoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let floorFound = false;

      polygonsRef.current.forEach((p, i) => {
        if (isPointInPolygon(mousePoint, p)) {
          drawHoveredPolygon(ctx, p, colors.current[i % colors.current.length]);
          if (!floorFound) {
            if (i === 0) {
              setHoveredFloor("Roof");
            } else {
              setHoveredFloor(polygonsRef.current.length - i);
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

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mousePoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };

      for (let i = 0; i < polygonsRef.current.length; i++) {
        const p = polygonsRef.current[i];
        if (isPointInPolygon(mousePoint, p)) {
          if (i === 0) {
            navigate(`/roof/${currentFrame}`);
          } else {
            const floorNumber = polygonsRef.current.length - i;

            if (floorNumber === 1) {
              navigate(`/ground/${currentFrame}`);
            } else {
              navigate(`/room/${currentFrame}`);
            }
          }
          break;
        }
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mousePoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };

      const isOverShape = polygonsRef.current.some((p) =>
        isPointInPolygon(mousePoint, p)
      );

      if (isOverShape) {
        e.stopPropagation();
      }
    };

    const handleMouseLeave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHoveredFloor(null);
    };

    const handleResize = () => {
      if (!image || !canvas) return;
      canvas.width = image.clientWidth;
      canvas.height = image.clientHeight;
      computePolygons();
    };

    if (image.complete) {
      handleResize();
    } else {
      image.onload = handleResize;
    }

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      image.onload = null;
    };
  }, [imageRef, navigate, currentFrame]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0"
        style={{ zIndex: 1, pointerEvents: "auto" }}
      />
      {hoveredFloor && (
        <div
          className="fixed z-50 pointer-events-none bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-sm border border-white/20"
          style={{
            left: tooltipPosition.x + 15,
            top: tooltipPosition.y - 30,
          }}
        >
          {typeof hoveredFloor === "string"
            ? hoveredFloor
            : `Floor ${hoveredFloor}`}
        </div>
      )}
    </>
  );
};

export default CanvasOverlayFrame181;
