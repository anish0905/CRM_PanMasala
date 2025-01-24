import React from "react";

const RangeSlider = ({ label, value, onChange, min = 1, max = 10 }) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-6">
      <label
        htmlFor={label}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <input
          type="range"
          id={label}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          min={min}
          max={max}
          className="w-full appearance-none h-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out mt-3 cursor-pointer"
          style={{
            background: `linear-gradient(to right, #16a34a 0%, #16a34a ${percentage}%, #d1d5db ${percentage}%, #d1d5db 100%)`,
          }}
        />
        {/* <div
          className="absolute top-[-25px] bg-indigo-500 text-white text-sm font-medium py-1 px-2 rounded-lg shadow-lg"
          style={{
            left: `calc(${percentage}% - 15px)`, // Keep tooltip within bounds
          }}
        >
          {value}
        </div> */}
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2 sm:justify-around">
        {Array.from({ length: max - min + 1 }, (_, i) => min + i).map(
          (mark) => (
            <span key={mark}>{mark}</span>
          )
        )}
      </div>
    </div>
  );
};
// ijiji

export default RangeSlider;
