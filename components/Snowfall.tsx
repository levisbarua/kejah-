import React from 'react';

export const Snowfall: React.FC = () => {
  // Generate random snowflakes
  const snowflakes = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 10 + 10}s`, // 10-20s fall time
    animationDelay: `${Math.random() * 5}s`,
    opacity: Math.random() * 0.5 + 0.3,
    size: Math.random() * 4 + 2 + 'px'
  }));

  return (
    <>
      <style>
        {`
          @keyframes snowfall {
            0% { transform: translateY(-10vh) translateX(0); }
            100% { transform: translateY(110vh) translateX(20px); }
          }
        `}
      </style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10" aria-hidden="true">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="absolute bg-white rounded-full shadow-sm"
            style={{
              left: flake.left,
              top: '-10px',
              width: flake.size,
              height: flake.size,
              opacity: flake.opacity,
              animation: `snowfall ${flake.animationDuration} linear infinite`,
              animationDelay: flake.animationDelay,
            }}
          />
        ))}
      </div>
    </>
  );
};