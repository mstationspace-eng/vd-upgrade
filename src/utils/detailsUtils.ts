// دالة مساعدة لجلب مسار صورة البرج
const PNG_FRAMES: Set<number> = new Set([1, 90, 181, 270, 362]);
const pad4 = (num: number) => num.toString().padStart(4, "0");

export const getFrameUrl = (frame: number | string): string => {
    const frameNum = typeof frame === 'string' ? parseInt(frame, 10) : frame;
    const ext = PNG_FRAMES.has(frameNum) ? "png" : "jpg";
    return `/tower-2/${pad4(frameNum)}.${ext}`;
};

// دالة لخلط ترتيب ظهور المربعات بشكل عشوائي
export const shuffleArray = (array: number[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};