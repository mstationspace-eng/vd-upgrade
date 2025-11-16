import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import roofImg from "../assets/images/roof.png"; 
import "../RoofDetails.css";

const GRID_ROWS = 6;
const GRID_COLS = 10;
const REVEAL_SPEED_MS = 5;
// ---------------------------------

const PNG_FRAMES: Set<number> = new Set([1, 90, 181, 270, 362]);
const pad4 = (num: number) => num.toString().padStart(4, "0");
const getFrameUrl = (frame: number | string): string => {
    const frameNum = typeof frame === 'string' ? parseInt(frame, 10) : frame;
    const ext = PNG_FRAMES.has(frameNum) ? "png" : "jpg";
    return `/tower-2/${pad4(frameNum)}.${ext}`;
};

const shuffleArray = (array: number[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const RoofDetails = () => {
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
      className="roof-container"
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
                backgroundImage: `url(${roofImg})`,
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

export default RoofDetails;