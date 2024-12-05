import React from 'react';

const Loader = (props) => {
  return (
    <>
      {props.screen !== undefined && props.screen === 'full' ? (
        <div
          className={`fixed inset-0 flex items-center justify-center z-[999] ${props.background === 'none' ? '' : ''
            }`}
        >
          <div className="flex items-center justify-center p-5 w-24 h-24 bg-gray-700/80 rounded-md">
            <div className="relative w-12 h-12">
              {/* Outer rotating ring */}
              <span className="absolute inset-0 w-full h-full border-t-4 border-r-4 border-white border-transparent rounded-full animate-rotation"></span>
              {/* Inner counter-rotating ring */}
              <span className="absolute inset-0 w-full h-full border-l-4 border-b-4 border-black  border-transparent rounded-full animate-reverseRotation"></span>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`flex items-center justify-center ${props.background ? '' : 'bg-gray-100'
            }`}
          style={{
            width: props.width,
            height: props.height,
            background: props.background || 'transparent',
          }}
        >
          <div className="flex items-center justify-center p-5 w-24 h-24 bg-gray-700/80 rounded-md">
            <div className="relative w-12 h-12">
              {/* Outer rotating ring */}
              <span className="absolute inset-0 w-full h-full border-t-4 border-r-4 border-white border-transparent rounded-full animate-rotation"></span>
              {/* Inner counter-rotating ring */}
              <span className="absolute inset-0 w-full h-full border-l-4 border-b-4  border-transparent rounded-full animate-reverseRotation border-black"></span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Loader;
