import React from 'react';

const AbstractShape = () => {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className="w-48 h-48 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#4F46E5', stopOpacity: 0.3 }}>
            <animate
              attributeName="stop-color"
              values="#4F46E5; #9333EA; #EC4899; #4F46E5"
              dur="8s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" style={{ stopColor: '#9333EA', stopOpacity: 0.3 }}>
            <animate
              attributeName="stop-color"
              values="#9333EA; #EC4899; #4F46E5; #9333EA"
              dur="8s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
      </defs>
      <path
        fill="url(#gradient)"
        d="M38.5,-64.3C51.5,-56.7,64.8,-48.8,73.5,-37.1C82.2,-25.4,86.3,-9.8,84.7,5.1C83.1,20,75.8,34.2,66.1,46.2C56.4,58.2,44.3,68,30.5,73.7C16.7,79.4,1.2,81,-13.6,77.9C-28.4,74.8,-42.5,67,-54.8,56.3C-67.1,45.6,-77.6,32,-81.8,16.3C-86,-0.4,-83.9,-19.2,-76.6,-35.1C-69.3,-51,-56.8,-64,-42.6,-71.8C-28.4,-79.6,-12.5,-82.2,0.8,-83.5C14.1,-84.8,25.5,-71.9,38.5,-64.3Z"
        transform="translate(100 100)"
        className="animate-morph"
      />
    </svg>
  );
};

export default AbstractShape;