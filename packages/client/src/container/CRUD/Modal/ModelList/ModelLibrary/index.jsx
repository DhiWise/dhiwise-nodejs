import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import {
  Button,
  Description,
  ListBoxWrap, ListTitle, NoData, SearchBox, Tag,
} from '../../../../../components';
import { useComponentWillUnmount } from '../../../../hooks';

import { useLibrary } from '../../LibraryPreview/LibraryProvider';
import { DATABASE_TYPE } from '../../../../../constant/Project/applicationStep';
import { LibraryModelData } from './LibraryModelData';

const ModelLibraryList = ({ modelData }) => {
  const { selectedModel, dispatch } = useLibrary();

  return (
    <ListBoxWrap
      variant="small"
      className="flex px-3 items-center relative groupBox"
      onClick={() => { dispatch({ type: 'SetSelectionModel', payload: modelData }); }}
    >
      <div className={`absolute w-full h-full left-0 pr-3 groupItem ${selectedModel._id === modelData._id ? 'block' : 'hidden'}`}>
        <div className="bg-gray-100 opacity-80 absolute left-0 w-full h-full" />
        <div className="flex justify-end items-center h-full">
          <Button variant="outline" className="bg-gray-200" shape="rounded" size="small">Preview model</Button>
        </div>
      </div>
      <div className="flex-grow mr-4 overflow-hidden">
        <ListTitle title={modelData.name} />
        <Description className="truncate sm:text-xs">{modelData.description}</Description>
      </div>
      <div className="flex-shrink-0 text-center">
        <Tag title={`${modelData.schemaJson ? Object.keys(modelData.schemaJson).length : 0} attribute`} size="small" />
      </div>
    </ListBoxWrap>
  );
};

export const ModelLibrary = () => {
  const { dispatch, libraryModelList } = useLibrary();
  const [modelList, setModelList] = React.useState([]);
  const { ormType } = useSelector(({ projects }) => ({
    ormType: projects.currentProjectDetail.applicationList.find((app) => app._id === projects.currentApplicationId)?.stepInput?.ormType ?? DATABASE_TYPE.MONGODB,
    applicationId: projects.currentApplicationId,
  }), shallowEqual);
  const searchRef = React.useRef('');
  React.useEffect(() => {
    const listData = [DATABASE_TYPE.SQL, DATABASE_TYPE.POSTGRE_SQL, DATABASE_TYPE.MYSQL].includes(ormType) ? LibraryModelData.SQL_TYPES : LibraryModelData[ormType];
    dispatch({ type: 'SetLibraryModelList', payload: listData });
    setModelList(listData);
  }, []);
  const onSearch = (search) => {
    const searchString = search.trim();
    if (searchRef.current !== searchString) {
      // to stop multiple api call
      if (isEmpty(searchString)) {
        setModelList(libraryModelList);
        return;
      }
      setModelList(libraryModelList.filter(((model) => model.name.toLowerCase().includes(searchString.toLowerCase()))));
    }
    searchRef.current = searchString;
    dispatch({ type: 'ResetSelectionModel' });
  };
  useComponentWillUnmount(() => {
    dispatch({ type: 'ResetSelectionModel' });
  });
  return (
    <>

      <div className="flex flex-col h-full">
        <div className="p-3 flex headTop flex-shrink-0">
          <div className="flex-grow h-9">
            <SearchBox onSearch={onSearch} placeholder="Search model" />
          </div>
        </div>

        <div className="overflow-auto flex-grow">

          {!isEmpty(modelList) ? (
            <>
              {modelList.map((m) => (<ModelLibraryList key={m.id} modelData={m} />))}
            </>
          ) : <NoData imageHeight={150} imgSize={150} className="w-full" smallBox title="No model found" />}
        </div>
      </div>

    </>
  );
};
