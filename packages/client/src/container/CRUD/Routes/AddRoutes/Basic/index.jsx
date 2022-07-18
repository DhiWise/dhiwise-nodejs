/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useHistory } from 'react-router';
import { Icons } from '@dhiwise/icons';
import { Controller, useFormContext } from 'react-hook-form';
import { shallowEqual, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import {
  Input, Select, TagGroup, IconBox,
} from '../../../../../components';
import { RedirectUrl } from '../../../../../constant/Nodecrud';
import { ROUTE_TYPES } from '../../../../../constant/routes';
import { getError } from '../../../../../utils/validationMsgs';
import { useRoute } from '../../RouteProvider';
import { getApplicationPlatforms } from '../../../../../utils/applicationPlatform';
import { nodeKeyRegex } from '../../../../../utils/regex';
import { MAX_INPUT_FIELD_LIMIT } from '../../../../../constant/common';

function Basic() {
  const {
    control, setValue, errors, watch, getValues,
  } = useFormContext();

  const { selectedModelId, editRouteData, generalizedModel } = useRoute();

  const history = useHistory();

  const {
    modelList, currentApplicationId, projectDetail, currentApplicationCode,
  } = useSelector(({ models, projects }) => ({
    modelList: models.modelList,
    currentApplicationId: projects.currentApplicationId,
    projectDetail: projects.currentProjectDetail,
    ormType: projects.applicationDatabase.ormType,
    currentApplicationCode: projects.currentApplicationCode,
  }), shallowEqual);
  const applicationLoginAccess = projectDetail?.applicationList?.find((d) => d._id === currentApplicationId)?.configInput?.platform;

  return (

    <div className="grid grid-cols-3 gap-5 py-3">
      <div className="grid col-span-3 xxl:col-span-1 grid-cols-2 gap-5">
        <div className="flex">
          <Controller
            control={control}
            name="modelId"
            defaultValue={(selectedModelId === generalizedModel?._id) ? null : selectedModelId}
            // rules={{ required: true }}
            render={(controlProps) => (
              <>
                <Select
                  WrapClassName="flex-grow"
                  {...controlProps}
                  onChange={(modelId) => {
                    setValue('modelId', modelId);
                    setValue('attributes', []); // to reset selected attributes
                    setValue('platform', ''); // to reset the platform if user change model
                    setValue('controller', modelId ? (modelList?.find((model) => model?._id === modelId)?.name) : ''); // predict the name of controller based on selected model
                  }}
                  placeholder="Select model"
                  options={modelList}
                  label="Model"
                  error={!controlProps.modelId && getError(errors, 'modelId', 'Model')}
                  valueKey="_id"
                />
                {isEmpty(modelList) && <IconBox icon={<Icons.Plus />} className="ml-1 flex-shrink-0 mt-9" variant="secondary" shape="rounded" size="normal" tooltip="Add model" onClick={() => history.push(RedirectUrl[currentApplicationCode].model.pageUrl)} />}
              </>
            )}
          />
        </div>
        <Controller
          control={control}
          name="platform"
          defaultValue={editRouteData?.platform}
          rules={{ required: true }}
          render={(controlProps) => (
            <Select
              {...controlProps}
              placeholder="Select platform"
              options={getApplicationPlatforms(applicationLoginAccess)}
              label="Platform*"
              error={!controlProps.value && getError(errors, 'platform', 'Platform')}
            />
          )}
        />
      </div>
      <div className="flex items-start col-span-3 xxl:col-span-2">
        <Controller
          control={control}
          RadiusType
          name="method"
          rules={{ required: true }}
          defaultValue={editRouteData.method}
          render={(controlProps) => (
            <Select
              WrapClassName="flex flex-wrap content-end w-40"
              className="w-full"
              {...controlProps}
              placeholder="Method"
              options={ROUTE_TYPES}
              label="Method*"
              error={!controlProps.value && getError(errors, 'method', 'Method')}
            />
          )}
        />
        <div style={{ width: 'calc(100% - 10rem)', marginLeft: '2px' }}>
          <Controller
            control={control}
            name="route"
            defaultValue={editRouteData.route ? editRouteData.route : '/'}
            rules={{ required: true, pattern: /^\/[a-zA-Z0-9]+/ }}
            render={(controlProps) => (
              <Input
                {...controlProps}
                placeholder="Enter route"
                label="Route*"
                onChange={(val) => {
                  if (val?.indexOf('/') !== 0 || isEmpty(val)) {
                    controlProps.onChange('/');
                  } else {
                    controlProps.onChange(val);
                  }
                }}
                onBlur={(e) => {
                  isEmpty(e.target.value) && setValue('route', '/');
                }}
                desc="Enter API route (path) used to call appropriate API."
                error={getError(errors, 'route', (errors?.route?.type === 'pattern') ? "Route field cannot be left blank. It should have valid API's path." : 'Route')}
              />
            )}
          />
        </div>
      </div>
      <Controller
        control={control}
        name="controller"
        defaultValue={editRouteData.controller || (modelList?.find((model) => model?._id === selectedModelId)?.name)}
        rules={{ required: true }}
        render={(controlProps) => (
          <Input
            {...controlProps}
            placeholder="Enter controller"
            label="Controller*"
            customRegex={nodeKeyRegex}
            maxLength={MAX_INPUT_FIELD_LIMIT.title}
            desc="Enter name of the controller from where function is called."
            error={!controlProps.value && getError(errors, 'controller', 'Controller')}
          />
        )}
      />
      <Input
        placeholder="controller file name"
        disabled
        label="Controller file name"
        value={watch('controller') && `${watch('controller')}Controller`}
        desc="In the code, you can find the Controller file same as the above name."
      />
      <Controller
        control={control}
        name="action"
        rules={{ required: true }}
        defaultValue={editRouteData.action}
        render={(controlProps) => (
          <Input
            {...controlProps}
            placeholder="Enter action"
            label="Action*"
            customRegex={nodeKeyRegex}
            maxLength={MAX_INPUT_FIELD_LIMIT.title}
            desc="Enter function name you would like to create in the controller."
            error={!controlProps.value && getError(errors, 'action', 'Action')}
          />
        )}
      />
      <div>
        <TagGroup
          titleKey="title"
          TagList={
            watch('attributes')?.map?.((tag) => ({
              title: tag,
              tagVariant: 'secondary',
              close: true,
            }))
          }
          onClick={(index) => {
            const attributes = getValues('attributes');
            attributes.splice(index, 1);
            setValue('attributes', attributes);
          }}
        />
      </div>
    </div>
  );
}

export default Basic;
