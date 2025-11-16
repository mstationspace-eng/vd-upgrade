import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
// ## الخطوة 1: قم باستيراد صورة الغرفة الخاصة بك
import roomImg from "../assets/images/room.png"; 
import "../RoofDetails.css"; // استيراد ملف الـ CSS المشترك
import { getFrameUrl, shuffleArray } from "../utils/detailsUtils"; // استيراد الدوال المساعدة

// --- إعدادات يمكنك التحكم بها ---
const GRID_ROWS = 6;
const GRID_COLS = 10;
const REVEAL_SPEED_MS = 5;
// ---------------------------------

const RoomDetails = () => {
  const { frameId } = useParams<{ frameId: string }>();
  
  const [visibleTiles, setVisibleTiles] = useState<Set<number>>(new Set());
  const totalTiles = GRID_ROWS * GRID_COLS;

  useEffect(() => {
    const tileIndexes = Array.from({ length: totalTiles }, (_, i) => i);
    const shuffledIndexes = shuffleArray(tileIndexes);

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < shuffledIndexes.length) {
        const nextTileIndex = shuffledIndexes[currentIndex];
        setVisibleTiles(prevVisibleTiles => new Set(prevVisibleTiles).add(nextTileIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, REVEAL_SPEED_MS);

    return () => clearInterval(interval);
  }, [totalTiles]);
  
  const backgroundTowerImage = frameId ? getFrameUrl(frameId) : '';

  return (
    <div
      className="roof-container" // استخدام الكلاس المشترك
      style={{ backgroundImage: `url(${backgroundTowerImage})` }}
    >
      <div className="tile-grid">
        {Array.from({ length: totalTiles }, (_, index) => {
          const row = Math.floor(index / GRID_COLS);
          const col = index % GRID_COLS;
          
          return (
            <div
              key={index}
              className="tile"
              style={{
                // ## الخطوة 2: استخدام صورة الغرفة هنا
                backgroundImage: `url(${roomImg})`, // <<-- تم تغيير الصورة هنا
                backgroundSize: `${GRID_COLS * 100}% ${GRID_ROWS * 100}%`,
                backgroundPosition: `${(col / (GRID_COLS - 1)) * 100}% ${(row / (GRID_ROWS - 1)) * 100}%`,
                opacity: visibleTiles.has(index) ? 1 : 0,
              }}
            />
          );
        })}
      </div>

      <div data-nodrag="true" className="absolute top-4 left-4 z-50">
        <NavLink to="/tower">
          <button
            className="rounded-full bg-white/20 px-3 py-2 text-xl hover:bg-white/40"
            aria-label="Back"
          >
            ←
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default RoomDetails;