import React from 'react';
import ErrorMsg from '../ErrorMsg';
import { Button } from '../Button';

export const DrawerFooter = ({
  isAutoFocusOnSave, isSaveNext, isNextSubmitting, handleNextSubmit, // manage differnt props for save&next
  submitTitle, handleSubmit, isSubmitting, handleCancel, cancelTitle, error, canSubmit = true, saveNext,
}) => (
  <div className="px-5 py-3 border-t border-gray-100 flex justify-end sidebarFooter">
    {
      error && <ErrorMsg error={error} className="mr-auto" />
    }

    <Button
      variant="outline"
      shape="rounded"
      onClick={handleCancel}
       // eslint-disable-next-line react/jsx-props-no-spreading
      {...(isAutoFocusOnSave && { tabindex: -1 })}
    >
      {cancelTitle}
    </Button>
    {!!saveNext && (
    <Button
      variant="primary"
      disabled={!canSubmit}
      shape="rounded"
      className="ml-2"
      onClick={handleSubmit}
      loading={isSubmitting}
    >
      {saveNext}
    </Button>
    )}
    <Button
      variant="primary"
      disabled={!canSubmit}
      shape="rounded"
      className="ml-2"
      onClick={isSaveNext ? handleNextSubmit : handleSubmit}
      loading={isSaveNext ? isNextSubmitting : isSubmitting}
    >
      {submitTitle}
    </Button>
  </div>
);
