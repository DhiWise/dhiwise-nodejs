import React from 'react';
import { isArray, isEmpty, uniq } from 'lodash';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Icons } from '@dhiwise/icons';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import { TabCSs } from '../../../../assets/css/tab';
import {
  Description, Heading, StepFooter,
} from '../../../../components';
import { PreviewTable } from './PreviewTable';
import { useLibrary } from './LibraryProvider';
import { useEditor } from '../Editor/EditorProvider';
import { createModel } from '../../../../api/models';
import { useBoolean } from '../../../../components/hooks';
import { addModel } from '../../../../redux/reducers/models';
import { useToastNotifications } from '../../../hooks';
import { Attention } from './Attention';
import { HOOK_TAB_TITLE, ModelPanel } from '../../../../constant/model';
import { HookSetup } from './HookSetup';
import { Indexing } from './Indexing';

export const LibraryPreview = ({ setPanel }) => {
  const attentionRef = React.useRef(); // Attention Model open
  const checkedRefData = React.useRef({}); // To Take Library checked data
  const checkedRefIndexes = React.useRef(); // To Take Library checked data
  const relationTableData = React.useRef([]); // To Take Relation Table Data
  const dispatch = useDispatch();
  const [isSubmit, setSubmit, hideSubmit] = useBoolean(false);
  const { applicationId, currentApplicationCode, modelList } = useSelector(({ projects, models }) => ({
    applicationId: projects.currentApplicationId,
    currentApplicationCode: projects.currentApplicationCode,
    modelList: models.modelList,
  }), shallowEqual);
  const { addErrorToast, addSuccessToast } = useToastNotifications();

  const { selectedModel, dispatch: libraryDispatch, libraryModelList } = useLibrary();
  const { tableToCodeViewParser } = useEditor();

  const checkedDataJson = (isRelationTable = false) => checkedRefData.current.map((checked) => {
    if (checked.original.ref && isRelationTable && checked.isSelected && libraryModelList.find((model) => model._id === checked.original.ref)?.name !== selectedModel.name
      && modelList.findIndex((model) => model.name?.toLowerCase() === libraryModelList.find((library) => library._id === checked.original.ref)?.name?.toLowerCase()) < 0) {
      relationTableData.current.push(checked.original.ref);
    }
    if (checked.isSelected && !checked.original.rowKey) {
      return {
        ...checked.original,
        description: undefined,
        // sub is undefined when subattribute is  not open
        subRows: checked?.subRows?.filter((sub) => sub.isSelected || sub.isSelected === undefined).map((sub) => ({ ...sub.original, description: undefined })),
      };
    }
    return false;
  }).filter((el) => el && el);

  const checkedIndexData = () => {
    const selected = [];
    checkedRefIndexes?.current?.forEach((checked) => {
      if (checked.isSelected && !checked.original.rowKey) {
        const isExist = selectedModel?.modelIndexes?.find((x) => x.name === checked?.original?.name);
        if (isExist) { selected.push(isExist); }
      }
    });
    return selected;
  };

  const handelSubmit = () => {
    // attentionRef.current.handelOpen();
    relationTableData.current = [];
    const mapTemplate = checkedDataJson(true);
    const mapIndexes = isArray(checkedRefIndexes?.current) ? checkedIndexData() : selectedModel.modelIndexes;
    if (!isEmpty(relationTableData.current)) { attentionRef.current.handelOpen(); return; }
    if (isEmpty(mapTemplate)) {
      addErrorToast('You cannot create template without selecting any attributes. Kindly select the attributes and then proceed further.');
      return;
    }
    setSubmit();
    createModel({
      modelIndexes: mapIndexes ?? [],
      hooks: selectedModel.hooks ?? [],
      schemaJson: tableToCodeViewParser({
        tableArr: mapTemplate, isReturnJson: true, customModelList: libraryModelList, isExcludeArrayId: true,
      }) ?? {},
      applicationId,
      definitionType: currentApplicationCode,
      description: selectedModel.description,
      name: selectedModel.name,
    }).then((createRes) => {
      dispatch(addModel(createRes?.data));
      addSuccessToast(createRes?.message);
      hideSubmit();
      setPanel(ModelPanel.CUSTOM.name);
    }).catch((error) => { addErrorToast(error); hideSubmit(); });
  };
  React.useEffect(() => {
    relationTableData.current = [];
  }, [selectedModel]);
  return (
    <>
      {isEmpty(selectedModel)
        && (
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <div className="w-24 h-24 m-auto mb-6">
                <Icons.Preview />
              </div>
              <Description variant="subTitle">DhiWise offers a number of pre-defined schemas. Explore it, customize it and use it.</Description>
            </div>
          </div>
        )}
      {!isEmpty(selectedModel) && (
      <>
        <div className="px-3 py-2 previewTop">
          <Heading variant="h4">{selectedModel?.name}</Heading>
          <Description className="mt-1 xxl:w-9/12">{selectedModel?.description}</Description>
        </div>
        <Tabs
          selectedTabClassName={TabCSs.selectTab}
          selectedTabPanelClassName="flex-grow h-0"
          className="relative flex-grow flex flex-col h-full"
        >
          <TabList
            className={`${TabCSs.tabHead}`}
          >
            <Tab className={TabCSs.tabTitle}>
              Schema
              {Object.keys(selectedModel.schemaJson || {}).length > 0 ? `(${Object.keys(selectedModel.schemaJson).length})` : ''}
            </Tab>
            <Tab className={TabCSs.tabTitle}>
              {HOOK_TAB_TITLE[currentApplicationCode]}
              {selectedModel?.hooks?.length > 0 ? `(${selectedModel.hooks.length})` : ''}
            </Tab>
            <Tab className={TabCSs.tabTitle}>
              Indexing
              {selectedModel?.modelIndexes?.length > 0 ? `(${selectedModel.modelIndexes.length})` : ''}
            </Tab>
          </TabList>
          <TabPanel>
            <PreviewTable
              key={selectedModel._id}
              setCheckedRefData={(checked) => { checkedRefData.current = checked; }}
            />
          </TabPanel>
          <TabPanel>
            <HookSetup key={`hook-${selectedModel._id}`} />
          </TabPanel>
          <TabPanel>
            <Indexing
              key={`indexing-${selectedModel._id}`}
              checkedRefIndexes={checkedRefIndexes?.current}
              setCheckedRefData={(checked) => { checkedRefIndexes.current = checked; }}
            />
          </TabPanel>
        </Tabs>
        <div>
          <StepFooter
            className="modelFooter"
            backClick={() => { libraryDispatch({ type: 'SetSelectionModel', payload: {} }); }}
            Back="Cancel"
            Next="Use template"
            nextClick={handelSubmit}
            nextLoading={isSubmit}
          />
        </div>
        <Attention
          attentionRef={attentionRef}
          checkedDataJson={() => tableToCodeViewParser({
            tableArr: checkedDataJson(false), isReturnJson: true, customModelList: libraryModelList, isExcludeArrayId: true,
          })}
          getRelationTableData={() => (uniq(relationTableData.current))}
          setPanel={() => { setPanel(ModelPanel.CUSTOM.name); }}
          checkedRefIndexes={checkedRefIndexes}
          checkedIndexData={checkedIndexData}
        />
      </>
      )}
    </>
  );
};
