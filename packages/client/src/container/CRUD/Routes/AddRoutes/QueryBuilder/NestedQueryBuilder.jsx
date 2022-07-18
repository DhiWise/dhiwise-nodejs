/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { isEmpty, last } from 'lodash';
import {
  Query, Builder, BasicConfig, Utils as QbUtils,
} from 'react-awesome-query-builder';
import 'react-awesome-query-builder/lib/css/styles.css';
import 'react-awesome-query-builder/lib/css/compact_styles.css';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { OPERATION_TYPE } from '../../../../../constant/routes';
import { useRoute } from '../../RouteProvider';
import { recursiveTree } from './QueryBuilderDetail';
import { useQueryResponse } from './ResponseProvider';
import { LabelBox, NoData } from '../../../../../components';
import { defaultAttributes } from '../../../../../components/SelectTree';

const InitialConfig = BasicConfig; // optional, for more compact styles

const RenderBuilder = (props) => (
  <div className="query-builder-container w-full mt-5">
    <div className="query-builder qb-lite customThemeQueryBuilder">
      <Builder {...props} />
    </div>
  </div>
);

const NestedQueryBuilderLogic = React.memo(({ queryJson }) => {
  const { currentResponseId } = useQueryResponse();
  const { setValue, watch } = useFormContext();
  const { editRouteData } = useRoute();
  const defaultQueryBuilder = watch('nestedQueryBuilder') ? watch('nestedQueryBuilder') : editRouteData?.nestedQueryBuilder?.map((query, index) => ({ filterJson: { id: Math.random(), type: 'group' }, ...query, _id: index }));
  const currentQueryData = defaultQueryBuilder?.[currentResponseId];

  const onChange = (immutableTree, configData) => {
    // Tip: for better performance you can apply `throttle` - see `examples/demo`
    currentQueryData.filterJson = QbUtils.getTree(immutableTree, false); // For Retrieve when update
    currentQueryData.filter = QbUtils.mongodbFormat(immutableTree, configData);
    setValue('nestedQueryBuilder', defaultQueryBuilder?.map((qb) => (qb._id === currentResponseId ? currentQueryData : qb)));
  };

  return (
    <Query
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...InitialConfig}
      fields={queryJson}
      value={QbUtils.loadTree(currentQueryData.filterJson)}
      onChange={onChange}
      renderBuilder={RenderBuilder}
    />

  );
});

export const NestedQueryBuilder = () => {
  const ormType = useSelector((state) => state.projects.applicationDatabase.ormType);
  const { setResponseId } = useQueryResponse();
  const { selectedModelId, editRouteData } = useRoute();
  const methods = useFormContext();
  const {
    watch, setValue,
  } = methods;

  const modelList = useSelector(({ models }) => (models.modelList.map((d) => ({ ...d, queryJson: recursiveTree({ ...defaultAttributes[ormType], ...d.schemaJson }) }))));

  // eslint-disable-next-line no-nested-ternary
  const defaultQueryBuilder = watch('nestedQueryBuilder') ? watch('nestedQueryBuilder') : editRouteData?.nestedQueryBuilder?.map((query, index) => ({
    // eslint-disable-next-line no-nested-ternary
    filterJson: { id: Math.random(), type: 'group' }, ...query, _id: index, filter: query?.filter ? (typeof query?.filter === typeof 'string' ? JSON.parse(query?.filter) : query?.filter) : undefined,
  }));
  const currentQueryData = defaultQueryBuilder?.[0] ?? {};

  React.useEffect(() => {
    const queryBuilderData = defaultQueryBuilder;
    const newQueryBuilderData = queryBuilderData ? [...queryBuilderData]
      : [{
        existingVariable: 'query',
        _id: 0,
        filterJson: { id: Math.random(), type: 'group' },
        modelId: selectedModelId || undefined,
        model: modelList.find((md) => md._id === selectedModelId)?.name || undefined,
        platform: editRouteData?.platform,
        operation: (editRouteData?.method === 'get' && last(editRouteData?.route?.split('/')) === '{{id}}') ? 'SR' : OPERATION_TYPE[editRouteData?.method][last(editRouteData?.route?.split('/'))],
        operationMode: 'pre',
        queryMode: 'find',
      }];

    setValue('nestedQueryBuilder', newQueryBuilderData);
    setResponseId(newQueryBuilderData.length - 1);
  }, []);

  return (
    <>
      {
        (!isEmpty(currentQueryData) && !isEmpty(modelList.find((md) => md._id === currentQueryData?.modelId)?.schemaJson)) ? (
          <>
            <LabelBox>Query</LabelBox>
            <NestedQueryBuilderLogic
              queryJson={modelList.find((md) => md._id === currentQueryData?.modelId)?.queryJson}
            />
          </>
        ) : (
          <NoData
            title="No attributes available in model."
          />
        )
      }
    </>
  );
};
NestedQueryBuilderLogic.displayName = 'NestedQueryBuilderLogic';
