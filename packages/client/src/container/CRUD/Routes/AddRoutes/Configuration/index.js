import { parseInt } from 'lodash';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Select, Input, Description, Heading,
  // RadioGroup, Radio,
} from '../../../../../components';
import { FILE_TYPE_EXTENSIONS } from '../../../../../constant/fileTypeConstant';
import { UPLOAD_ATTACHMENT_OPTIONS } from '../../../../../constant/applicationConfigConstant';

export const Configuration = ({ value: uploadData = {} }) => {
  const { setValue, watch } = useFormContext();

  const onChangeUpload = (data = {}) => {
    setValue('uploads', { ...watch('uploads'), ...data });
  };

  React.useEffect(() => {
    setValue('uploads', { ...uploadData, isSingle: uploadData?.isSingle ?? true, storage: uploadData?.storage ?? 'local' });
    // For set initial singlefile selection
  }, []);

  return (
    <div className="py-3">
      <Heading variant="h5">Upload configuration</Heading>
      <Description className="w-10/12 xxl:w-8/12 mt-1">
        Configure type of upload, type of file, and maximum size of the file you want to set for your route.
        {/* Configure type of uploads(single upload/multi file upload), type of file, and maximum size of the file you want to set for your route.
        Content before single upload/multi file upload option got removed
        */}
      </Description>
      <div className="grid grid-cols-2 gap-5 mt-8">
        <Select
          placeholder="Select allow file type to upload"
          label="Allow file type to upload"
          isMulti
          value={uploadData?.validationType}
          options={FILE_TYPE_EXTENSIONS}
          onChange={(validationType) => {
            onChangeUpload({ validationType });
          }}
        />
        <Input.Number
          placeholder="Enter max. upload size limit"
          label="Max. upload size limit (in MB)"
          extension="MB"
          value={uploadData?.maxSize}
          onChange={(maxSize) => {
            onChangeUpload({ maxSize: maxSize ? parseInt(maxSize) : undefined });
          }}
        />
        <Select
          placeholder="Select type of upload"
          label="Type of upload"
          value={uploadData?.storage}
          options={UPLOAD_ATTACHMENT_OPTIONS}
          isClearable={false}
          onChange={(storage) => {
            onChangeUpload({ storage });
          }}
        />
      </div>
      {/* <div className="mt-6">
        <RadioGroup
          selectedValue={uploadData?.isSingle}
          onChange={(val) => {
            onChangeUpload({ isSingle: val });
          }}
          className="flex"
          name="changedType"
        >
          <Radio value name="changedType">
            Single file upload
          </Radio>
          <Radio value={false} name="changedType">
            Multi file upload
          </Radio>
        </RadioGroup>
      </div> */}
    </div>
  );
};
