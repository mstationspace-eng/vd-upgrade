// src/utils/canvasUtilsFrame90.ts

export interface Point {
    x: number;
    y: number;
  }
  
  export interface Rectangle {
    minX: number;
    minY: number;
    width: number;
    height: number;
  }
  
  interface FloorData {
    x1: number;
    y1: number;
    width: number;
    height: number;
    rotation?: number; // إضافة خاصية الدوران
  }
  
  // === تم تحديث القيم هنا ===
  // هذه هي البيانات الدقيقة الخاصة بالصورة رقم 90
  export function generateFloorsPointFrame90(): FloorData[] {
    // القيم الجديدة التي تم إدخالها
    const startX = 1178;
    const startY = 551;
    const floorWidth = 1014;
    const floorHeight = 98;
  
    // سيتم إنشاء 16 مستطيلًا بناءً على هذه القيم
    return Array.from({ length: 16 }, (_, index) => ({
      x1: startX,
      y1: startY + floorHeight * index,
      width: floorWidth,
      height: floorHeight,
      rotation: -4 * Math.PI / 180,
    }));
  }
  
  // لا حاجة لتعديل هذه الدوال
  export function updatePoints(originalPoint: Point, newMaxPoint: Point): Point {
    const originalMaxPoint = { x: 3840, y: 2733 }; 
  
    const xRatio = originalMaxPoint.x / newMaxPoint.x;
    const yRatio = originalMaxPoint.y / newMaxPoint.y;
  
    const x = originalPoint.x / xRatio;
    const y = originalPoint.y / yRatio;
  
    return { x, y };
  }
  
  export function drawHoveredRectangle(
    ctx: CanvasRenderingContext2D,
    rect: Rectangle,
    color: string,
    rotation?: number
  ) {
    ctx.save(); // حفظ حالة الكانفاس الحالية
    
    // إذا كان هناك دوران، قم بتطبيقه
    if (rotation) {
      const centerX = rect.minX + rect.width / 2;
      const centerY = rect.minY + rect.height / 2;
      
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation); // استخدام قيمة الدوران مباشرة (بالراديان)
      ctx.translate(-centerX, -centerY);
    }
    
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.25;
    ctx.fillRect(rect.minX, rect.minY, rect.width, rect.height);
  
    ctx.globalAlpha = 1.0;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(rect.minX, rect.minY, rect.width, rect.height);
    
    ctx.restore(); // استعادة حالة الكانفاس
  }