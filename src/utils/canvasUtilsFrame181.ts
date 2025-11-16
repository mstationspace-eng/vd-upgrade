export interface Point {
  x: number;
  y: number;
}

export interface PolygonFloorData {
  p1: Point;
  p2: Point;
  p3: Point;
  p4: Point;
}

const floorsData: PolygonFloorData[] = [
  {
    p1: { x: 1672, y: 402 },
    p2: { x: 2316, y: 401 },
    p3: { x: 2312, y: 516 },
    p4: { x: 1678, y: 512 },
  },

  // Floor 1 
  {
    p1: { x: 1349, y: 510 },
    p2: { x: 2662, y: 518 },
    p3: { x: 2639, y: 652 },
    p4: { x: 1363, y: 632 },
  },
  // Floor 2
  {
    p1: { x: 1367, y: 656 },
    p2: { x: 2636, y: 672 },
    p3: { x: 2623, y: 768 },
    p4: { x: 1374, y: 745 },
  },
  // Floor 3
  {
    p1: { x: 1379, y: 769 },
    p2: { x: 2620, y: 789 },
    p3: { x: 2607, y: 875 },
    p4: { x: 1390, y: 852 },
  },
  // Floor 4
  {
    p1: { x: 1393, y: 871 },
    p2: { x: 2600, y: 899 },
    p3: { x: 2590, y: 984 },
    p4: { x: 1401, y: 951 },
  },
  {
    p1: { x: 1404, y: 976 },
    p2: { x: 2585, y: 1006 },
    p3: { x: 2576, y: 1083 },
    p4: { x: 1412, y: 1050 },
  },
  {
    p1: { x: 1411, y: 1073 },
    p2: { x: 2570, y: 1106 },
    p3: { x: 2564, y: 1181 },
    p4: { x: 1420, y: 1145 },
  },
  {
    p1: { x: 1425, y: 1161 },
    p2: { x: 2555, y: 1200 },
    p3: { x: 2544, y: 1275 },
    p4: { x: 1437, y: 1240 },
  },
  {
    p1: { x: 1433, y: 1251 },
    p2: { x: 2542, y: 1292 },
    p3: { x: 2533, y: 1364 },
    p4: { x: 1441, y: 1319 },
  },
  {
    p1: { x: 1445, y: 1337 },
    p2: { x: 2531, y: 1382 },
    p3: { x: 2520, y: 1448 },
    p4: { x: 1451, y: 1402 },
  },
  {
    p1: { x: 1455, y: 1422 },
    p2: { x: 2520, y: 1467 },
    p3: { x: 2507, y: 1530 },
    p4: { x: 1461, y: 1482 },
  },
  {
    p1: { x: 1460, y: 1498 },
    p2: { x: 2506, y: 1545 },
    p3: { x: 2497, y: 1611 },
    p4: { x: 1468, y: 1556 },
  },
  {
    p1: { x: 1471, y: 1576 },
    p2: { x: 2495, y: 1626 },
    p3: { x: 2487, y: 1686 },
    p4: { x: 1475, y: 1634 },
  },
  {
    p1: { x: 1480, y: 1648 },
    p2: { x: 2487, y: 1701 },
    p3: { x: 2477, y: 1757 },
    p4: { x: 1487, y: 1707 },
  },
  {
    p1: { x: 1488, y: 1719 },
    p2: { x: 2475, y: 1772 },
    p3: { x: 2468, y: 1831 },
    p4: { x: 1491, y: 1776 },
  },
  {
    p1: { x: 1495, y: 1789 },
    p2: { x: 2463, y: 1844 },
    p3: { x: 2458, y: 1896 },
    p4: { x: 1500, y: 1839 },
  },
  {
    p1: { x: 1502, y: 1856 },
    p2: { x: 2455, y: 1910 },
    p3: { x: 2448, y: 1961 },
    p4: { x: 1507, y: 1895 },
  },
];

export function getFloorsData(): PolygonFloorData[] {
  return floorsData;
}

export function updatePoints(originalPoint: Point, newMaxPoint: Point): Point {
  const originalMaxPoint = { x: 3840, y: 2733 };
  const xRatio = originalMaxPoint.x / newMaxPoint.x;
  const yRatio = originalMaxPoint.y / newMaxPoint.y;
  return {
    x: originalPoint.x / xRatio,
    y: originalPoint.y / yRatio,
  };
}

export function drawHoveredPolygon(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  color: string
) {
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.25;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.fill();

  ctx.globalAlpha = 1.0;
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.stroke();
}

export function isPointInPolygon(point: Point, polygon: Point[]): boolean {
  let isInside = false;
  const x = point.x,
    y = point.y;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x,
      yi = polygon[i].y;
    const xj = polygon[j].x,
      yj = polygon[j].y;
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) isInside = !isInside;
  }
  return isInside;
}
