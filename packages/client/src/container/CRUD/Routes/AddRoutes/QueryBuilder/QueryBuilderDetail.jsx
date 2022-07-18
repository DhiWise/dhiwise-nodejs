/* eslint-disable no-nested-ternary */
import React from 'react';
import { useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import { isEmpty } from 'lodash';
import { LabelBox, Select } from '../../../../../components';
import QueryBuilderLogic from './QueryBuilder';
import { useQueryResponse } from './ResponseProvider';
import { ORM_TYPE } from '../../../../../constant/Project/applicationStep';
import { defaultAttributes } from '../../../../../components/SelectTree';

const TABLE_TYPES = {
  [ORM_TYPE.MONGOOSE]: {
    Email: 'text',
    String: 'text',
    Number: 'number',
    Boolean: 'boolean',
    Array: 'text', // If blank array than text other select bix
    JSON: 'text',
    Mixed: 'text',
    Date: 'date',
    Buffer: 'text',
    Map: 'text',
    ObjectId: 'text',
    SingleLine: 'text',
    MultiLine: 'text',
    URL: 'text',
    Decimal: 'number',
    Percentage: 'number', // slider config add
  },
  [ORM_TYPE.SEQUELIZE]: {
    EMAIL: 'text',
    STRING: 'text',
    NUMBER: 'number',
    BOOLEAN: 'boolean',
    ARRAY: 'text', // If blank array than text other select bix
    JSON: 'text',
    MIXED: 'text',
    DATE: 'date',
    BUFFER: 'text',
    MAP: 'text',
    OBJECTID: 'text',
    SINGLELINE: 'text',
    MULTILINE: 'text',
    URL: 'text',
    DECIMAL: 'number',
    PERCENTAGE: 'number', // slider config add
    INTEGER: 'number',
  },
};

const validateObject = (data) => {
  if (!data) return false;
  return (Object.values(data)?.findIndex((value) => typeof (value) === 'object') > -1);
};
const validateArray = (data) => Array.isArray(data);

export const recursiveTree = (JsonData) => {
  const ormType = useSelector((state) => state.projects.applicationDatabase.ormType);
  const object = {};
  if (!isEmpty(JsonData)) {
    Object.keys(JsonData).forEach((jsonKey) => {
      if (jsonKey !== 'type') {
        object[jsonKey] = {
          label: jsonKey,
          // ...(TABLE_TYPES[json[jsonKey]?.type] === 'text' && { excludeOperators: ['proximity'] }),
          valueSources: ['value'],
          excludeOperators: ['proximity'],
          ...(JsonData[jsonKey]?.type === ((ormType === ORM_TYPE.MONGOOSE) ? 'Percentage' : 'PERCENTAGE') && { preferWidgets: ['slider'] }),
          type: validateArray(JsonData[jsonKey]) ? '!group' : validateObject(JsonData[jsonKey]) ? '!struct' : JsonData[jsonKey]?.type ? TABLE_TYPES[ormType][JsonData[jsonKey]?.type] : 'text',
          ...(validateObject(JsonData[jsonKey]) && { subfields: recursiveTree(JsonData[jsonKey]) }),
          ...(validateArray(JsonData[jsonKey]) && { subfields: recursiveTree({ ...JsonData[jsonKey]?.[0] }) }),
        };
      }
    });
  }
  return { ...object };
};

export const QueryBuilderDetail = () => {
  const ormType = useSelector((state) => state.projects.applicationDatabase.ormType);
  const modelList = useSelector(({ models }) => (models.modelList.map((d) => ({ ...d, queryJson: recursiveTree({ ...defaultAttributes[ormType], ...d.schemaJson }) }))));
  const { currentResponseId } = useQueryResponse();

  const methods = useFormContext();

  const {
    getValues, setValue,
  } = methods;
  const defaultQueryBuilder = getValues('queryBuilder');
  const currentQueryData = defaultQueryBuilder?.[currentResponseId] ?? {};
  const handleModalChange = (modelId) => {
    currentQueryData.modelId = modelId || undefined;
    currentQueryData.model = modelList.find((md) => md._id === modelId)?.name || undefined;
    currentQueryData.queryMode = 'find';
    if (!modelId) {
      currentQueryData.filter = undefined;
      currentQueryData.filterJson = { id: Math.random(), type: 'group' };
    }
    setValue('queryBuilder', defaultQueryBuilder?.map((query) => (query._id === currentResponseId ? currentQueryData : query)));
  };
  return (
    <div className="overflow-auto p-5 w-full">
      <Select
        WrapClassName="w-6/12"
        options={modelList}
        value={currentQueryData?.modelId}
        placeholder="Select model"
        onChange={handleModalChange}
        label="Model"
        valueKey="_id"
        labelKey="name"
      />
      <div className="mt-10">
        <LabelBox>Query</LabelBox>
        {!isEmpty(modelList.find((md) => md._id === currentQueryData?.modelId)?.schemaJson) ? (
          <QueryBuilderLogic
            queryJson={modelList.find((md) => md._id === currentQueryData?.modelId)?.queryJson}
          />
        ) : 'No collection available in model.'}
      </div>
      {/* <div className="mt-10">
        <div className="flex items-center">
          <div className="w-4/12">
            <LabelBox>Populate</LabelBox>
          </div>
          <div className="w-8/12 items-center grid grid-cols-2 gap-5">
            <Select options={[]} placeholder="Select attr" />
            <Select options={[]} placeholder="Select attr in response" isMulti />
          </div>
        </div>
        <QueryBuilderLogic />
      </div> */}
    </div>
  );
};
