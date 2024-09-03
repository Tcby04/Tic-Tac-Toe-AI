import React, { useState } from 'react';
import '../styles/InfoTooltip.css';

const InfoTooltip: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="info-tooltip-container">
      <div 
        className="info-icon" 
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        i
      </div>
      {isVisible && (
        <div className="tooltip-text">
          You Will Not Win
          You Can Only Draw
          Good Luck!
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;
