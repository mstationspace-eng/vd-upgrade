// src/utils/canvasUtils.ts

export interface Point {
  x: number;
  y: number;
}

// Interface for rectangular shapes
export interface Rectangle {
  type: 'rect'; // Type discriminator
  minX: number;
  minY: number;
  width: number;
  height: number;
}

// Interface for polygon shapes
export interface Polygon {
  type: 'poly'; // Type discriminator
  points: Point[];
}

// A shape can be either a Rectangle or a Polygon
export type Shape = Rectangle | Polygon;

export function generateShapes(): Shape[] {
  // Define the roof as a polygon
  const roof: Polygon = {
    type: 'poly',
    points: [
      { x: 597, y: 103 },
      { x: 993, y: 103 },
      { x: 993, y: 143 },
      { x: 888, y: 143 },
      { x: 888, y: 172 },
      { x: 707, y: 172 },
      { x: 707, y: 146 },
      { x: 597, y: 146 },
    ],
  };

  // Define the first floor as a custom polygon
  const firstFloor: Polygon = {
    type: 'poly',
    points: [
        { x: 518, y: 186 },
        { x: 608, y: 186 },
        { x: 608, y: 163 },
        { x: 698, y: 163 },
        { x: 698, y: 175 },
        { x: 897, y: 175 },
        { x: 897, y: 163 },
        { x: 987, y: 163 },
        { x: 987, y: 186 },
        { x: 1081, y: 186 },
        { x: 1081, y: 230 },
        { x: 990, y: 230 },
        { x: 990, y: 210 },
        { x: 608, y: 210 },
        { x: 608, y: 230 },
        { x: 518, y: 230 },
    ],
  };

  // Generate data for the remaining 15 rectangular floors
  const remainingFloors: Rectangle[] = Array.from({ length: 15 }, (_, index) => ({
    type: 'rect',
    minX: 515,
    // Start from the position of the *second* original floor
    minY: 192 + 47 * (index + 1), 
    width: 565,
    height: 47,
  }));

  // Return the roof, the new first floor, and the rest of the floors
  return [roof, firstFloor, ...remainingFloors];
}


// Scales a single point based on new dimensions
export function scalePoint(originalPoint: Point, scaleX: number, scaleY: number): Point {
  return {
    x: originalPoint.x * scaleX,
    y: originalPoint.y * scaleY,
  };
}

// Draws a highlighted rectangle on the canvas
export function drawHoveredRectangle(ctx: CanvasRenderingContext2D, rect: Rectangle, color: string) {
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.25;
  ctx.fillRect(rect.minX, rect.minY, rect.width, rect.height);
  ctx.globalAlpha = 1.0;
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.strokeRect(rect.minX, rect.minY, rect.width, rect.height);
}

// Draws a highlighted polygon on the canvas
export function drawHoveredPolygon(ctx: CanvasRenderingContext2D, polygon: Polygon, color: string) {
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.25;
  ctx.beginPath();
  ctx.moveTo(polygon.points[0].x, polygon.points[0].y);
  for (let i = 1; i < polygon.points.length; i++) {
    ctx.lineTo(polygon.points[i].x, polygon.points[i].y);
  }
  ctx.closePath();
  ctx.fill();
  
  ctx.globalAlpha = 1.0;
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.stroke();
}

// Checks if a point is inside a polygon (for hover and click detection)
export function isPointInPolygon(point: Point, polygon: Point[]): boolean {
  let isInside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;

    const intersect = ((yi > point.y) !== (yj > point.y))
        && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    if (intersect) isInside = !isInside;
  }
  return isInside;
}