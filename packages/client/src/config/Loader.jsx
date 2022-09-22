import React from 'react';

export default function Loader() {
  return (
    <div className="w-full h-full fixed block top-0 left-0 bg-white opacity-75 z-50">
      <span className="text-green-500 opacity-75 top-1/2 my-0 mx-auto block relative w-0 h-0">
        <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24" />
      </span>
    </div>
  );
}
