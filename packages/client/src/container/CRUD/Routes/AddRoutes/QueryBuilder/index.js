import React from 'react';
import { isEmpty } from 'lodash';
import { QueryBuilderList } from './QueryBuilderList';
import { QueryBuilderDetail } from './QueryBuilderDetail';
import './queryBuilder.css';
import { BoxLayout, NoData } from '../../../../../components';
import { ResponseProvider, useQueryResponse } from './ResponseProvider';
import { AddResponse } from './AddResponse';

const QueryBuilderTab = () => {
  const { currentResponseId } = useQueryResponse();
  return <QueryBuilderDetail key={currentResponseId} />;
};

export const QueryBuilder = ({ value }) => {
  const addModalRef = React.useRef();

  return (
    <div className="flex h-full">
      <ResponseProvider>
        {!isEmpty(value) ? (
          <>
            <QueryBuilderList addModalRef={addModalRef} />
            <BoxLayout variant="subRight">
              <QueryBuilderTab />
            </BoxLayout>
          </>
        )
          : (
            <NoData
              onClick={() => { addModalRef.current?.showResponseModal(); }}
              btnText="Add response"
              title="No response found"
            />
          )}
        <AddResponse addModalRef={addModalRef} />

      </ResponseProvider>
    </div>
  );
};
