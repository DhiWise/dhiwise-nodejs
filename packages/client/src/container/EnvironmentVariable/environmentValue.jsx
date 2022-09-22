import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import last from 'lodash/last';
import {
  toLower, omit, cloneDeep, isNaN, compact,
} from 'lodash';
import { KeyValue } from './KeyValue';
import {
  Checkbox,
} from '../../components';
import { enviromentVaribleCss } from './enviromentVaribleCss';
import { ENV } from '../../constant/envVariable';
import { EnvironmentHead } from './EnvironmentHead';
import { useToastNotifications, useBoolean } from '../hooks';
import Spinner from './Permission.loader';
import { RESERVED_VARIABLES } from '../../constant/reservedVariable';
import { capitalizeStr } from '../../utils';

const EnvironmentValue = React.forwardRef(({
  envList, loader, upsertLoader, onSave, HeadTitle, Headdesc, headTooltip, EnvDeleteMessage,
}, ref) => {
  const applicationCode = useSelector((state) => state.projects.currentApplicationCode);
  const initObj = {
    value: {
      DEVELOPMENT: '',
      QA: '',
      PRODUCTION: '',
    },
    key: '',
    dataType: '',
    indexKey: '',
  };
  const [isAll, setIsAll] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [envData, setEnvData] = useState([]);
  const envRef = React.useRef(null);
  const [environments, setEnvironments] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [errors, setErrors] = useState({});
  const [deleteLoader, setDelete, hideDelete] = useBoolean(false);
  const { addErrorToast, addSuccessToast } = useToastNotifications();

  const handleSave = (isDelete) => {
    let isError = false;
    const curEnv = compact(cloneDeep(envRef.current));
    if (!isDelete && curEnv.length === 1 && !curEnv[0].key) {
      addErrorToast('Please enter environment variable key');
      return;
    }
    const newEnvironments = Object.keys(environments).filter((e) => environments[e]);
    if (!isDelete && (!newEnvironments || newEnvironments?.length === 0)) {
      addErrorToast('Please select environment value');
      return;
    }
    const customJson = [];
    const allKeys = curEnv.map((x) => toLower(x.key)) || [];
    if (allKeys.some((x) => (x && allKeys.indexOf(x) !== allKeys.lastIndexOf(x)))) {
      addErrorToast('Duplicate key found. Please enter unique key.');
      return;
    }
    curEnv?.map((x, index) => {
      if (isDelete && !x.key) return x;
      let obj = {
        ...x,
        index,
        indexKey: `e${index}`,
      };

      if ((newEnvironments.some((env) => obj?.value[env])) && !obj?.key) isError = true;
      if (RESERVED_VARIABLES[applicationCode]?.NODE_EXPRESS?.includes(obj.key.toLowerCase())) isError = true;
      if (RESERVED_VARIABLES.COMMON?.includes(obj.key.toLowerCase())) isError = true;

      if (!isDelete && (!obj.key && !newEnvironments.every((env) => obj?.value[env]))) return x;

      if (x.value) {
        Object.keys(x.value).map((e) => {
          if (!newEnvironments.includes(e)) delete obj.value[e];
          if (e === 'DEVELOPMENT') {
            if (!newEnvironments.includes(e)) delete obj.value[e];
            else if (!isDelete && obj.key && (obj.value[e] === undefined || obj.value[e] === null || obj.value[e] === '' || isNaN(obj.value[e]))) isError = true;
          }
          return e;
        });
      } else isError = true;
      obj = omit(obj, ['indexKey', 'index', 'isSelected', 'isExist']);
      customJson.push(obj);
      return x;
    });

    if (!isDelete) {
      setErrors(isError);
      if (isError) {
        return;
      }
    }
    const request = {
      environments: newEnvironments,
      customJson,
    };

    isDelete && setDelete();
    onSave(request, isDelete);
  };

  React.useImperativeHandle(ref, () => ({
    envData, environments, selectedRows, setEnvData, setSelectedRows,
  }));

  const handleCurEleFocus = (key) => {
    // handle new row focus
    if (!key) return;
    requestAnimationFrame(() => {
      const nextfield = document.querySelector(`#${key} input[name="key"]`);
      nextfield?.focus();
    });
  };

  const addNewData = (lists) => {
    if (errors) setErrors(false);
    // add blank new row
    const tempData = cloneDeep(lists);
    const obj = {
      ...initObj,
      indexKey: `e${isSearch ? envRef.current.length : tempData.length}`,
      index: isSearch ? envRef.current.length : tempData.length,
    };
    tempData.push(obj);
    if (isSearch) {
      envRef.current[envRef.current.length] = obj;
    }
    return tempData;
  };

  const setEnvRefData = (lists, indexes, callback) => {
    const tempData = lists.length === 0 ? addNewData(lists) : cloneDeep(lists);
    setEnvData(() => tempData);
    if (lists.length === 0) {
      requestAnimationFrame(() => {
        handleCurEleFocus(tempData[tempData.length - 1]?.indexKey);
      });
    }
    if (isSearch) {
      indexes?.map((i) => {
        const obj = tempData.find((x) => x.indexKey === envRef.current[i]?.indexKey);
        envRef.current[i] = obj;
        return i;
      });
    } else envRef.current = tempData;

    if (callback) callback();
  };

  const prepareData = () => {
    // Prepare data for env key-value
    hideDelete();
    setErrors(false);
    setIsSearch();
    if (!envList) return;
    let tempData = []; const tempEnv = {};
    Object.keys(ENV).map((e) => {
      tempEnv[e] = !!envList.environments?.includes(e);
      return e;
    });
    if (envList.customJson?.length > 0) {
      envList.customJson.map((x, index) => {
        const tempObj = {
          ...x,
          indexKey: `e${index}`,
          index,
          isSelected: false,
        };
        let tempValue = {};
        Object.keys(ENV).map((e) => {
          // prepare env var (qa,production) data
          if (x.value) {
            tempValue[e] = x.value[e];
          } else tempValue = {};
          return e;
        });

        tempObj.value = tempValue;
        tempObj.isExist = true;
        tempData.push(tempObj);
        return x;
      });
    }
    if (Object.values(tempEnv)?.every((e) => !e)) {
      tempEnv[ENV.DEVELOPMENT] = true;
    }
    setEnvironments(tempEnv);
    tempData = [...tempData, { ...initObj, index: tempData.length, indexKey: `e${tempData.length}` }];
    // tempData = addNewData(tempData);
    setEnvRefData(tempData);
    setIsAll(false);
    requestAnimationFrame(() => {
      handleCurEleFocus(tempData[tempData.length - 1]?.indexKey);
    });
  };

  React.useEffect(() => {
    prepareData();
  }, [envList]);

  const handleAutoFocus = (focusIndex) => {
    // eslint-disable-next-line radix
    const field = document.querySelector(focusIndex);
    field?.focus();
  };
  const handleRowCheckBoxFocus = (focusIndex) => {
    const field = document.getElementById(focusIndex);
    field?.focus();
  };

  const handleEnvChange = (key, value, focusField) => {
    // on change environments
    const tempObj = { ...environments };
    tempObj[key] = value;
    setEnvironments(tempObj);
    requestAnimationFrame(() => {
      if (focusField) {
        handleAutoFocus(focusField);
      }
    });
  };

  const handleAll = (key, val, focusField) => {
    setIsAll(val);
    const tempData = cloneDeep(envData);
    tempData.map((x) => {
      // eslint-disable-next-line no-param-reassign
      x.isSelected = val;
      return x;
    });
    setEnvRefData(tempData);
    requestAnimationFrame(() => {
      if (focusField) {
        handleAutoFocus(focusField);
      }
    });
  };

  const handleChangeInputs = (obj, updateKey) => {
    if (errors) setErrors(false);
    let tempData = cloneDeep(envData); const indexes = [obj.index];
    const index = tempData.findIndex((x) => x.indexKey === obj.indexKey);
    if (index > -1) {
      tempData[index] = obj;
    }
    if (updateKey === 'key' && last(tempData)?.key?.length > 0) {
      // add blank new row
      tempData = addNewData(tempData);
      setEnvRefData(tempData, indexes);
    } else setEnvRefData(tempData, indexes);
  };

  const handleSelect = React.useCallback((obj, value, focusField) => {
    const tempData = cloneDeep(envData);
    const i = tempData.findIndex((x) => x.indexKey === obj.indexKey);
    tempData[i].isSelected = value;
    const tempAll = tempData?.every((p) => p.isSelected);
    setIsAll(tempAll);
    setEnvData(tempData);
    requestAnimationFrame(() => {
      if (focusField) handleRowCheckBoxFocus(focusField); // manage auto focus
    });
  }, [envData]);

  const handleDelete = (obj) => {
    let tempData = cloneDeep(envData);
    tempData = tempData.filter((x) => x.indexKey !== obj.indexKey);

    setEnvRefData(tempData, [obj.index], () => {
      if (obj.isExist) {
        setDelete();
        handleSave(true);
      } else {
        setIsSearch(false);
        setIsAll(false);
        // re-arrange indexKey, index, isSelected
        const updatedEnvData = compact(envRef.current)?.map((env, index) => ({
          ...env,
          indexKey: `e${index}`,
          index,
          isSelected: false,
        }));
        envRef.current = updatedEnvData;
        setEnvData(updatedEnvData);
        addSuccessToast(EnvDeleteMessage);
      }
    });
  };

  const handleDeleteAll = () => {
    let tempData = cloneDeep(envData);
    const isExist = tempData?.some((x) => x.isExist);
    tempData = tempData.filter((x) => !x.isSelected);
    const selectedIndexes = cloneDeep(envData)?.filter((env) => env?.isSelected)?.map((selectedEnv) => selectedEnv?.index);

    setEnvRefData(tempData, selectedIndexes, () => {
      if (isExist) {
        setDelete();
        handleSave(true);
      } else {
        setIsSearch(false);
        setIsAll(false);
        // re-arrange indexKey, index, isSelected
        const updatedEnvData = compact(envRef.current)?.map((env, index) => ({
          ...env,
          indexKey: `e${index}`,
          index,
          isSelected: false,
        }));
        envRef.current = updatedEnvData;
        setEnvData(updatedEnvData);
        addSuccessToast(EnvDeleteMessage);
      }
    });
  };

  const handleSearch = (searchVal) => {
    setIsSearch(searchVal);
    // when search selected reset
    if (isAll) handleAll('', false);
    const val = toLower(searchVal);
    let tempData = cloneDeep(envRef.current);
    if (val) {
      tempData = tempData.filter((x) => toLower(x.key).includes(val.trim()));
      tempData.push(envRef.current[envRef.current?.length - 1]);
    }
    setEnvData(tempData);
  };

  const EnvCheckbox = React.useCallback((options) => {
    const { children, value, id } = options;
    return (
      <Checkbox
        id={id}
        className="text-center"
        checked={!!environments[value]}
        onChange={(val) => handleEnvChange(value, val, value)}
        onKeyDown={(e) => {
          if (e.keyCode === 13 && e.target) {
            handleEnvChange(value, !e.target.checked, `#${id}`);
          }
        }}
      >
        {children}
      </Checkbox>
    );
  }, [environments]);

  const AllCheckbox = React.useCallback((options) => {
    const { children, value, id } = options;
    return (
      <Checkbox
        id={id}
        className="text-center"
        checked={!!isAll}
        onChange={(val) => {
          handleAll(value, val, value);
        }}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            handleAll(value, !e.target.checked, `#${id}`);
          }
        }}
      >
        {children}
      </Checkbox>
    );
  }, [isAll, envData]);

  const isSelected = React.useMemo(() => envData?.some((x) => x?.isSelected), [envData]);
  const totalColumns = 4;

  return (
    <>
      <EnvironmentHead
        title={HeadTitle}
        desc={Headdesc}
        headTooltip={headTooltip}
        onSave={() => handleSave()}
        upsertLoader={upsertLoader}
        deleteLoader={deleteLoader}
        onDelete={handleDeleteAll}
        onSearch={handleSearch}
        isSearch={isSearch}
        isSelected={isSelected}
        isLastObj={envData.length === 1}
      />
      <div className="overflow-auto envTable flex-grow">
        <div className="">
          {
            (loader || upsertLoader) ? <Spinner />
              : (
                <table>
                  <tr>
                    <td className={enviromentVaribleCss.enviroTableHeadFirst}>
                      <AllCheckbox value id="allCheckBox">Select all</AllCheckbox>
                    </td>
                    <td className="sticky -left-3 top-0 z-1 bg-gray-black">
                      <table>
                        <tr>
                          {
                            Object.keys(ENV).map((e) => (
                              <td className={enviromentVaribleCss.enviroTableHead} key={e}>
                                <div className="flex items-center">
                                  <EnvCheckbox value={ENV[e]} id={e} />
                                  {e === 'QA' ? e : capitalizeStr(e)}
                                </div>
                              </td>
                            ))
                          }
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <>
                    {/* //TO Render Key value rows  */}
                    { envData?.length > 0
                      && envData.map((e, i) => (
                        <tr key={e.indexKey} id={e.indexKey} className="align-top envTableHead">
                          <KeyValue
                            lengthOfData={envData.length}
                            envObj={e}
                            environments={environments}
                            onChange={handleChangeInputs}
                            onSelect={handleSelect}
                            isLastObj={i === envData.length - 1}
                            onDelete={() => handleDelete(e)}
                            selectedRows={selectedRows}
                            applicationCode={applicationCode}
                            errors={errors}
                            setErrors={setErrors}
                            rowIndex={i * totalColumns}
                          />
                        </tr>
                      ))}
                  </>
                </table>
              )
          }
        </div>
      </div>
    </>
  );
});
EnvironmentValue.displayName = 'EnvironmentValue';
export { EnvironmentValue };
