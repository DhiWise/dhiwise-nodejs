import React from 'react';
import ErrorMsg from '../ErrorMsg';
import { Button } from '../Button';

export const StepFooter = ({
  Back,
  Next,
  isNextDisable,
  isSaveDisable,
  nextLoading,
  saveText,
  saveLoading,
  backLoading,
  errorMessage,
  children,
  className,
  saveClick,
  backClick,
  nextClick,
}) => (
  <div
    className={`flex items-center justify-end stepFooter bg-gray-black py-2 px-5 border-t border-gray-100 ${className}`}
  >
    {errorMessage && (
      <div className="flex-grow">
        <ErrorMsg error={errorMessage} />
      </div>
    )}
    {children}
    {Back && (
      <Button
        loading={backLoading}
        variant="outline"
        onClick={backClick}
        className="min-w-32"
        shape="rounded"
        size="medium"
      >
        {Back}
      </Button>
    )}
    {saveText && (
      <Button
        loading={saveLoading}
        disabled={isSaveDisable}
        variant="primary"
        onClick={saveClick}
        className="ml-2 min-w-32"
        shape="rounded"
        size="medium"
      >
        {saveText}
      </Button>
    )}
    {Next && (
      <Button
        loading={nextLoading}
        disabled={isNextDisable}
        variant="primary"
        onClick={nextClick}
        className="ml-2 min-w-32"
        shape="rounded"
        size="medium"
      >
        {Next}
      </Button>
    )}
  </div>
);

StepFooter.defaultProps = {
  isNextDisable: false,
  isSaveDisable: false,
  nextLoading: false,
  saveLoading: false,
  backLoading: false,
  saveClick: () => {},
  backClick: () => {},
  nextClick: () => {},
};
