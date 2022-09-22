/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import ReactTooltip from 'react-tooltip';
import { Icons } from '@dhiwise/icons';
import {
  Button,
  Checkbox,
  Description,
  Heading,
  Input, Select,
  // Radio, RadioGroup,
} from '../../../components';
import { FILE_TYPE_EXTENSIONS } from '../../../constant/fileTypeConstant';
import { UPLOAD_ATTACHMENT_OPTIONS } from '../../../constant/applicationConfigConstant';

export const UploadAttachmentSetting = (props) => {
  const methods = useFormContext();

  const { control, watch, handleSubmit } = methods;

  return (
    <>
      <div className="px-5 py-3 flex justify-between headerTop items-center">
        <div className="w-8/12 xxl:w-6/12">
          <Heading variant="h4">Upload attachment setting</Heading>
          <Description className="mt-1">
            Configure type of upload, type of file, and maximum size of the file you want to allow in your system.
          </Description>
        </div>
        <div className="flex justify-end w-4/12 xxl:w-6/12">
          <Button size="medium" variant="primary" shape="rounded" onClick={handleSubmit(props?.onSubmit)} loading={props?.loading}>Update</Button>
        </div>
      </div>
      <div className="overflow-auto p-5 pt-0 border-t border-gray-100 flex-grow">
        <div className="grid grid-cols-2 xxl:grid-cols-3 gap-5 py-4">
          <Controller
            control={control}
            name="uploadPlatform"
            render={(controlProps) => (
              <Select
                {...controlProps}
                placeholder="Select platforms"
                label="Platforms"
                options={props?.platforms}
                isMulti
              />
            )}
          />
          <Controller
            control={control}
            name="uploadFileType"
            render={(controlProps) => (
              <Select
                {...controlProps}
                placeholder="Select allow file type to upload"
                label="Allow file type to upload"
                options={FILE_TYPE_EXTENSIONS}
                isMulti
                valueKey="name"
              />
            )}
          />
          <Controller
            control={control}
            name="uploadMaxSize"
            render={(controlProps) => (
              <Input.Number
                {...controlProps}
                placeholder="Enter max. upload size limit"
                label="Max. upload size limit (in MB)"
                extension="MB"
              />
            )}
          />
          <Controller
            control={control}
            name="uploadStorageType"
            render={(controlProps) => (
              <Select
                {...controlProps}
                placeholder="Select type of upload"
                label="Type of upload"
                options={UPLOAD_ATTACHMENT_OPTIONS}
                isClearable={false}
              />
            )}
          />
        </div>
        {/* <div className="mt-4 mb-8">
          <Controller
            control={control}
            name="isSingleFileUpload"
            render={(controlProps) => (
              <RadioGroup
                {...controlProps}
                selectedValue={controlProps.value}
                className="flex"
              >
                <Radio value>
                  Single file upload
                </Radio>
                <Radio value={false}>
                  Multi file upload
                </Radio>
              </RadioGroup>
            )}
          />
        </div> */}
        <div className="mt-4 mb-8">
          <Controller
            control={control}
            name="uploadTimeAuth"
            defaultValue={watch('uploadTimeAuth')}
            render={(controlProps) => (
              <Checkbox
                {...controlProps}
                checked={controlProps.value}
                WrapclassName="inline-flex items-center"
                labelClass="flex items-center"
              >
                Auth?
                <div className="w-4 h-4 ml-2" data-tip data-for="tooltip1">
                  <Icons.Info />
                  <ReactTooltip id="tooltip1" type="dark">
                    Auth middleware apply on method or not!
                  </ReactTooltip>
                </div>
              </Checkbox>
            )}
          />
        </div>
      </div>
    </>
  );
};
