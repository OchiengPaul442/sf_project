import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-black text-white">
      {/* Pulsing Text */}
      <h1 className="text-3xl md:text-5xl font-bold animate-pulse mb-6">
        Saving Food
      </h1>

      {/* Pulsing Dots */}
      <div className="flex space-x-2">
        <span className="w-4 h-4 bg-white rounded-full animate-bounce delay-100"></span>
        <span className="w-4 h-4 bg-white rounded-full animate-bounce delay-200"></span>
        <span className="w-4 h-4 bg-white rounded-full animate-bounce delay-300"></span>
      </div>
    </div>
  );
};

export default Loading;
