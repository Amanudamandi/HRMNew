import React from 'react';

const CircleLoader = () => {
  return (
    <>
      <style>{`
        .circle-loader {
          --d: 22px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          color: #25b09b;
          box-shadow: 
            calc(1 * var(--d)) calc(0 * var(--d)) 0 0,
            calc(0.707 * var(--d)) calc(0.707 * var(--d)) 0 1px,
            calc(0 * var(--d)) calc(1 * var(--d)) 0 2px,
            calc(-0.707 * var(--d)) calc(0.707 * var(--d)) 0 3px,
            calc(-1 * var(--d)) calc(0 * var(--d)) 0 4px,
            calc(-0.707 * var(--d)) calc(-0.707 * var(--d)) 0 5px,
            calc(0 * var(--d)) calc(-1 * var(--d)) 0 6px;
          animation: rotate-dots 1s infinite steps(8);
          margin: auto;
        }

        @keyframes rotate-dots {
          100% {
            transform: rotate(1turn);
          }
        }
      `}</style>
      <div className="circle-loader"></div>
    </>
  );
};

export default CircleLoader;
