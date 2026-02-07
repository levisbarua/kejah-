import React from 'react';

export const ChristmasLights: React.FC = () => {
  return (
    <>
      <style>
        {`
          @keyframes flash-1 { 
            0%, 100% { opacity: 1; box-shadow: 0 2px 14px 4px currentColor; transform: scale(1.1); } 
            50% { opacity: 0.5; box-shadow: 0 0 0 0 currentColor; transform: scale(1); } 
          }
          @keyframes flash-2 { 
            0%, 100% { opacity: 0.5; box-shadow: 0 0 0 0 currentColor; transform: scale(1); } 
            50% { opacity: 1; box-shadow: 0 2px 14px 4px currentColor; transform: scale(1.1); } 
          }
          .bulb-holder {
            position: relative;
            z-index: 60;
          }
          .wire {
            position: absolute;
            top: -15px;
            left: -20px;
            right: -20px;
            height: 40px;
            border-bottom: 2px solid #2d3748;
            border-radius: 50%;
            z-index: 50;
            pointer-events: none;
          }
        `}
      </style>
      <div className="fixed top-0 left-0 w-full h-12 overflow-hidden pointer-events-none z-[100]" aria-hidden="true">
        <div className="flex justify-between items-start px-4 sm:px-12 w-full max-w-7xl mx-auto relative h-full">
          {/* Wire Arc */}
          <div className="wire"></div>
          
          {/* Bulbs */}
          {Array.from({ length: 12 }).map((_, i) => {
            const colors = ['text-red-500', 'text-green-500', 'text-yellow-400', 'text-blue-500'];
            const colorClass = colors[i % colors.length];
            // Alternate animation patterns
            const animationClass = i % 2 === 0 ? 'flash-1' : 'flash-2';
            const duration = 2 + Math.random() * 1; 

            return (
              <div key={i} className="bulb-holder flex flex-col items-center">
                {/* Socket */}
                <div className="w-2 h-2 bg-gray-700 rounded-sm mb-[1px]"></div>
                {/* Bulb */}
                <div 
                  className={`w-3 h-4 rounded-full ${colorClass} bg-current`}
                  style={{
                    animation: `${animationClass} ${duration}s infinite ease-in-out`
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};