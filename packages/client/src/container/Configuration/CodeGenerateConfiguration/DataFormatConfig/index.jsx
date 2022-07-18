/* eslint-disable no-nested-ternary */
import React from 'react';
import { isEmpty, omit } from 'lodash';
import { useFormContext } from 'react-hook-form';
import Spinner from './DataFormat.loader';
import {
  ListBoxWrap, ListTitle, Button, NoData, ConfirmationAlert,
} from '../../../../components';
import { AddDataFormat } from './AddDataFormat';
import { Head } from './Head';
import { ATTRIBUTE_FORMAT_DATA_TYPE } from '../../../../constant/applicationConfigConstant';
import { useBoolean } from '../../../hooks';

const DataFormatItem = ({
  handleShow, handleDelete, itemFormat,
}) => (
  <ListBoxWrap className="flex justify-between items-center">
    <div className="mr-5">
      <ListTitle smallTitle={`${itemFormat?.title} - ${itemFormat?.isAllModels ? 'All model' : itemFormat?.model?.name}`} />
      <div className="flex flex-wrap items-center">
        {itemFormat?.dataType === ATTRIBUTE_FORMAT_DATA_TYPE.STRING
          && (
          <>
            <div className="flex mt-1 items-center">
              <span className="text-body-text text-sm mr-2">Target:</span>
              <span className="text-xs">{itemFormat?.targetAttr}</span>
            </div>
            <hr className="mx-4 w-px h-4 my-1 bg-gray-80 block" />
            <div className="flex mt-1 items-center">
              <span className="text-body-text text-sm mr-2">Concat operator:</span>
              <span className="text-xs">{itemFormat?.attribute?.join(` ${itemFormat?.operator === 'space' ? '' : itemFormat?.operator} `)}</span>
            </div>
          </>
          )}
        {itemFormat?.dataType === ATTRIBUTE_FORMAT_DATA_TYPE.BOOLEAN
        && (
        <div className="flex mt-1 items-center">
          <span className="text-body-text text-sm mr-2">Boolean true:</span>
          <span className="text-xs">
            {itemFormat?.attribute?.true}
          </span>
          <hr className="mx-4 w-px h-4 my-1 bg-gray-80 block" />
          <span className="text-body-text text-sm mr-2">Boolean false:</span>
          <span className="text-xs">
            {itemFormat?.attribute?.false}
          </span>
        </div>
        )}
        {itemFormat?.dataType === ATTRIBUTE_FORMAT_DATA_TYPE.DATE
        && (
        <div className="flex mt-1 items-center">
          <span className="text-body-text text-sm mr-2">Date:</span>
          <span className="text-xs">{itemFormat?.attribute}</span>
        </div>
        )}
      </div>
    </div>
    <div className="flex justify-end">
      <Button variant="outline" className="mr-2" shape="rounded" size="small" onClick={handleDelete}>Delete</Button>
      <Button variant="primary" shape="rounded" size="small" onClick={handleShow}>Edit</Button>
    </div>
  </ListBoxWrap>
);

export const DataFormatConfig = ({
  loading, onSubmit,
}) => {
  const [isOpen, openPopUp, closePopUp] = useBoolean();
  const [isDeletePopupOpen, openDeletePopUp, closeDeletePopUp] = useBoolean(false);

  const methods = useFormContext();

  const { watch } = methods;

  const detailRef = React.useRef();

  return (
    <>
      <div className="flex flex-col h-full">
        <Head handleShow={() => {
          openPopUp();
        }}
        />
        {loading ? <Spinner />
          : (
            !isEmpty(watch('responseFormatter')) ? (
              <div className="px-3 overflow-auto flex-grow">
                {
              watch('responseFormatter')?.map((itemFormat) => (
                <DataFormatItem
                  key={itemFormat.title}
                  handleShow={() => {
                    detailRef.current = itemFormat;
                    openPopUp();
                  }}
                  handleDelete={() => {
                    detailRef.current = itemFormat;
                    openDeletePopUp();
                  }}
                  itemFormat={itemFormat}
                />
              ))
            }
              </div>
            ) : (
              <NoData
                title="No data found"
                description="Create a global data format with our many customization options."
              />
            )
          )}
      </div>

      <ConfirmationAlert
        isOpen={isDeletePopupOpen}
        description="Do you want to delete the selected data format of your model attribute?"
        handleSubmit={() => {
          const updatedData = watch();
          const updatedResponseFormatter = updatedData?.responseFormatter?.filter((itemFormat) => itemFormat?.title !== detailRef.current?.title);
          updatedData.responseFormatter = updatedResponseFormatter?.map((itemFormat) => omit(itemFormat, 'model'));
          onSubmit(updatedData, () => {}, false, false, true); // pass value to callback, isCreate isUpdate and isDelete flags
          detailRef.current = null;
          closeDeletePopUp();
        }}
        handleClose={closeDeletePopUp}
        isLoading={loading}
      />

      {isOpen && (
      <AddDataFormat
        isOpen={isOpen}
        loading={loading}
        onClose={() => {
          detailRef.current = null;
          closePopUp();
        }}
        onSubmit={onSubmit}
        editData={detailRef?.current}
      />
      )}
    </>
  );
};
