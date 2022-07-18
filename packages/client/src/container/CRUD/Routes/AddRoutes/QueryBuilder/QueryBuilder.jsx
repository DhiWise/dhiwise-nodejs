/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  Query, Builder, BasicConfig, Utils as QbUtils,
} from 'react-awesome-query-builder';
import 'react-awesome-query-builder/lib/css/styles.css';
import 'react-awesome-query-builder/lib/css/compact_styles.css';
// import { useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import { useQueryResponse } from './ResponseProvider';
// import { InputCss } from '../../../../../components/Input/inputCss';
// Choose your skin (ant/material/vanilla):
const InitialConfig = BasicConfig; // optional, for more compact styles

// You need to provide your own config. See below 'Config format'

const RenderBuilder = (props) => (
  <div className="query-builder-container w-full mt-5">
    <div className="query-builder qb-lite customThemeQueryBuilder">
      <Builder {...props} />
    </div>
  </div>
);
function QueryBuilderLogic({ queryJson }) {
  const { currentResponseId } = useQueryResponse();
  const { setValue, watch } = useFormContext();
  const defaultQueryBuilder = watch('queryBuilder');
  const currentQueryData = defaultQueryBuilder?.[currentResponseId];

  const onChange = (immutableTree, configData) => {
    // Tip: for better performance you can apply `throttle` - see `examples/demo`
    currentQueryData.filterJson = QbUtils.getTree(immutableTree, false); // For Retrieve when update
    currentQueryData.filter = QbUtils.mongodbFormat(immutableTree, configData);
    setValue('queryBuilder', defaultQueryBuilder?.map((qb) => (qb._id === currentResponseId ? currentQueryData : qb)));
    // setQuery(immutableTree);
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
}

export default React.memo(QueryBuilderLogic);
