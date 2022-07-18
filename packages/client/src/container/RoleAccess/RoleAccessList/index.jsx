import React from 'react';
import { useSelector } from 'react-redux';
import { cloneDeep, find, isEmpty } from 'lodash';
import {
  Checkbox, ListTitle, NoData, Button,
} from '../../../components';
import { RoleAccessHead } from '../RoleAccessHead';
import DeleteRole from './DeleteRole';
import { roleAccessListCss } from './roleAccessListCss';
import { useBoolean } from '../../../components/hooks';
import { CRUD } from '../../../constant/permission';
import { useRoleAccess } from '../RoleAccessProvider';

export const RoleListItem = ({ modelName, customJson, handleChange }) => {
  const ActionCheckBox = (propsVal) => {
    const { children, operationType, modelId } = propsVal;
    return (
      <Checkbox
        checked={(operationType !== CRUD.ALL_MODEL) ? !!customJson?.actions?.[operationType] : !!Object.keys(customJson?.actions)?.every((val) => customJson?.actions?.[val])}
        onChange={(val) => {
          handleChange(val, operationType, modelId);
        }}
      >
        {children}
      </Checkbox>
    );
  };

  return (
    <div className={roleAccessListCss.roleListWrap}>
      <div className="">
        <ListTitle title={modelName} />
      </div>
      <div className="flex justify-between w-96">
        <div className="mr-2">
          <ActionCheckBox operationType={CRUD.ALL_MODEL} modelId={customJson?.modelId}>
            All
          </ActionCheckBox>
        </div>
        <div className="mr-2">
          <ActionCheckBox operationType={CRUD.C} modelId={customJson?.modelId}>
            Create
          </ActionCheckBox>
        </div>
        <div className="mr-2 text-center">
          <ActionCheckBox operationType={CRUD.R} modelId={customJson?.modelId}>
            View
          </ActionCheckBox>
        </div>
        <div className="mr-2">
          <ActionCheckBox operationType={CRUD.U} modelId={customJson?.modelId}>
            Update
          </ActionCheckBox>
        </div>
        <div className="mr-2">
          <ActionCheckBox operationType={CRUD.D} modelId={customJson?.modelId}>
            Delete
          </ActionCheckBox>
        </div>
      </div>
    </div>
  );
};

export const RoleAccessList = React.memo(() => {
  const updateRef = React.useRef();
  const [customJson, setCustomJson] = React.useState([]);
  const [loading, setLoading, hideLoading] = useBoolean(false);

  const modelList = useSelector((state) => state.models.modelList);

  const { selectedRole, selectedRoleData } = useRoleAccess();

  const prepareRoleAccessData = () => {
    const roleAccessCustomJson = [];
    modelList?.forEach((model) => {
      if (find(selectedRoleData?.customJson, ['modelId', model?._id])) {
        roleAccessCustomJson.push(find(selectedRoleData?.customJson, ['modelId', model?._id]));
      } else {
        const customJsonObject = {};
        customJsonObject.modelId = model?._id;
        customJsonObject.actions = {
          C: false,
          R: false,
          U: false,
          D: false,
        };
        roleAccessCustomJson.push(customJsonObject);
      }
    });
    setCustomJson(roleAccessCustomJson);
  };

  React.useEffect(() => {
    prepareRoleAccessData();
  }, [selectedRole]);

  const handleChange = (val, operationType, modelId) => {
    const newCustomJson = cloneDeep(customJson);
    const index = customJson?.findIndex((model) => model?.modelId === modelId);

    if (operationType === CRUD.ALL_MODEL) {
      Object.keys(newCustomJson[index].actions)?.forEach((operation) => {
        newCustomJson[index].actions[operation] = val;
      });
    }
    if (operationType === CRUD.ALL) {
      newCustomJson?.forEach((modelJson) => {
        const modelIndex = customJson?.findIndex((model) => model?.modelId === modelJson?.modelId);
        Object.keys(modelJson?.actions)?.forEach((operation) => {
          newCustomJson[modelIndex].actions[operation] = val;
        });
      });
    }
    if (operationType !== CRUD.ALL_MODEL && operationType !== CRUD.ALL) {
      newCustomJson[index].actions[operationType] = val;
    }
    setCustomJson(newCustomJson);
  };

  const AllModelCheckBox = (propsVal) => {
    const { children } = propsVal;
    return (
      <Checkbox
        checked={!!customJson?.every((modelJson) => Object.keys(modelJson?.actions)?.every((val) => modelJson?.actions[val]))}
        onChange={(val) => handleChange(val, CRUD.ALL)}
      >
        {children}
      </Checkbox>
    );
  };

  const onSubmit = () => {
    updateRef.current?.handelRoleAccess('customJson', customJson);
    updateRef.current?.setHideEdit();
  };

  return (
    <>
      <div className="px-5 py-3 flex justify-between items-center headTop">
        <RoleAccessHead updateRef={updateRef} setLoading={setLoading} hideLoading={hideLoading} />
        <div className="w-4/12 xxl:w-6/12 flex justify-end">
          {/* <Button
            variant="outline"
            shape="rounded"
            size="medium"
            className="ml-2"
            onClick={() => {
              prepareRoleAccessData();
            }}
          >
            Cancel
          </Button> */}
          <DeleteRole />
          <Button
            variant="primary"
            shape="rounded"
            size="medium"
            onClick={onSubmit}
            className="ml-2"
            loading={loading}
          >
            Update
          </Button>
        </div>
      </div>
      {(!isEmpty(modelList) && !isEmpty(customJson))
        ? (
          <div
            className="overflow-auto flex-grow"
          >
            <div className={roleAccessListCss.roleListHead}>
              <div className={roleAccessListCss.roleListHeadTitle}>Model list</div>
              <div className={roleAccessListCss.roleListHeadBox}>
                <span>Action</span>
                <span>
                  <AllModelCheckBox>
                    All
                  </AllModelCheckBox>
                </span>
              </div>
            </div>
            {
              modelList.map((model) => (
                <RoleListItem
                  key={model?._id}
                  modelName={model?.name}
                  customJson={find(customJson, ['modelId', model?._id])}
                  handleChange={handleChange}
                />
              ))
            }
          </div>
        )
        : (
          <NoData
            title="No model found"
          />
        )}
    </>
  );
});
RoleAccessList.displayName = 'RoleAccessList';
