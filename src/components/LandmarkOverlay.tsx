import React, { useRef, useEffect } from 'react';
import { Overlay } from 'ol';
import { fromLonLat } from 'ol/proj';
import 'ol/ol.css'; 
import '../index.css'; 

const LandmarkOverlay = ({ map, landmark, language, onLandmarkClick }) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!map || !landmark) return;

    const container = document.createElement('div');
    container.className = 'overlay-container';
    
    const circle = document.createElement('div');
    circle.className = 'landmark-circle';
    container.appendChild(circle);

    const line = document.createElement('div');
    line.className = 'landmark-line new-marker-line'; 
    container.appendChild(line);

    const nameBox = document.createElement('div');
    nameBox.className = 'landmark-box city-name-box'; 

    nameBox.innerHTML = `
      <span class="city-name-content">
        ${landmark.name[language] || landmark.name.en}
      </span>
    `;
    container.appendChild(nameBox);

    const olOverlay = new Overlay({
      element: container,
      position: fromLonLat(landmark.coordinates),
      stopEvent: true,
    });

    // Add city-specific modifier classes for custom styling
    if (landmark?.id === 'taif') {
      container.classList.add('taif-overlay');
      circle.classList.add('taif-circle');
      line.classList.add('taif-line');
      nameBox.classList.add('taif-box');
    } else if (landmark?.id === 'jeddah') {
      container.classList.add('jeddah-overlay');
      circle.classList.add('jeddah-circle');
      line.classList.add('jeddah-line');
      nameBox.classList.add('jeddah-box');
    } else if (landmark?.id === 'makkah') {
      container.classList.add('makkah-overlay');
      circle.classList.add('makkah-circle');
      line.classList.add('makkah-line');
      nameBox.classList.add('makkah-box');
    }

    map.addOverlay(olOverlay);
    overlayRef.current = olOverlay;

    container.addEventListener('click', (e) => {
      e.stopPropagation();
      onLandmarkClick();
    });

    return () => {
      if (overlayRef.current) {
        map.removeOverlay(overlayRef.current);
      }
    };

  }, [map, landmark, language, onLandmarkClick]); 

  return null;
};

export default LandmarkOverlay;