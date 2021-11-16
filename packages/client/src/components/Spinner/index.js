import React from 'react';
import './spinner.css';

export function Spinner({ className }) {
  return (
    <div className={`dhi-ellipsis ${className}`}>
      <div />
      <div />
      <div />
      <div />
    </div>
  );
}
