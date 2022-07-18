import React from 'react';
import {
  cloneDeep, concat, isEmpty, uniq, uniqBy,
} from 'lodash';
import { Controller, useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { getPolicies } from '../../../../../api/policy';
import { APIKeyValue, LabelBox, Select } from '../../../../../components';
import { ROUTE_HEADERS } from '../../../../../constant/routes';
import { useRoute } from '../../RouteProvider';
import { useToastNotifications } from '../../../../hooks';

// const headerObject = {
//   key: '',
//   value: '',
// };

const HeaderComponent = (props) => {
  const methods = useFormContext();
  const { addErrorToast } = useToastNotifications();

  const { setValue } = methods;
  const [customHeaders, setCustomHeaders] = React.useState(
    concat(props?.value && cloneDeep(props?.value), { key: '', value: '' }),
  );

  const checkDuplicateKey = (headerList) => {
    const keys = headerList
      ?.map((header) => header?.key)
      ?.filter((el) => el && el);
    return keys?.length === uniq(keys)?.length;
  };

  const handleInputChange = (e, index, type) => {
    const headersList = [...customHeaders];
    headersList[index][type] = e;
    setCustomHeaders(headersList);

    // setValue('headers', headersList);
  };

  const handleInputBlur = (e, index, type) => {
    const headersList = [...customHeaders];
    if (
      type === 'key'
      && e.target.value.length
      && index === headersList?.length - 1
    ) {
      headersList[index + 1] = { key: '', value: '' };
    }
    setCustomHeaders(uniqBy(headersList, 'key'));
    !checkDuplicateKey(headersList) && addErrorToast('Key already exists.');
    setValue(
      'headers',
      uniqBy(headersList, 'key')?.filter((header) => header?.key),
    );
    // setOtherFormData({ headers: headersList.findIndex((header) => !isEmpty(header?.key)) >= 0 ? customHeaders?.filter((header) => header?.key) : headerObject });
  };

  const handleDeleteHeader = (index) => {
    const headersList = [...customHeaders];
    if (headersList?.length !== 1) {
      headersList.splice(index, 1);
    } else {
      headersList[index] = { key: '', value: '' };
    }
    setCustomHeaders(uniqBy(headersList, 'key'));
    setValue(
      'headers',
      uniqBy(headersList, 'key')?.filter((header) => header?.key),
    );
    // setOtherFormData({ headers: headersList.findIndex((header) => !isEmpty(header?.key)) >= 0 ? customHeaders?.filter((header) => header?.key) : headerObject });
  };
  return (
    <>
      {customHeaders?.map((header, index) => {
        if (header) {
          return (
            <tr className="align-top">
              <APIKeyValue
                APIValue
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...props}
                isValue
                isAutoSuggest
                // isDelete={(customHeaders?.length > 1)}
                isDelete
                inputProps={{
                  value: header?.key,
                  placeholder: 'Enter new key',
                  onChange: (e) => handleInputChange(e, index, 'key'),
                  onBlur: (e) => handleInputBlur(e, index, 'key'),
                  list: `headers${index}`,
                  autoComplete: 'off',
                  error:
                    !isEmpty(header?.value)
                    && isEmpty(header?.key)
                    && 'key is required',
                  customRegex: false,
                }}
                valueProps={{
                  value: header?.value,
                  placeholder: 'Enter new value',
                  onChange: (e) => handleInputChange(e, index, 'value'),
                  error:
                    !isEmpty(header?.key)
                    && isEmpty(header?.value)
                    && 'value is required',
                }}
                autoSuggestProps={{
                  list: ROUTE_HEADERS,
                  id: `headers${index}`,
                }}
                deleteProps={{
                  onDelete: () => handleDeleteHeader(index),
                  disabled:
                    index === customHeaders?.length - 1 && isEmpty(header?.key),
                }}
              />
            </tr>
          );
        }
        return null;
      })}
    </>
  );
};
function Advance() {
  const [policyLists, setPolicyLists] = React.useState([]);
  const currentApplicationId = useSelector(
    (state) => state.projects.currentApplicationId,
  );
  const { editRouteData } = useRoute();

  // React.useEffect(() => {
  //   () => {

  //   };
  // }, []);
  const methods = useFormContext();

  const { control, setValue, getValues } = methods;
  function fetchAllPolicies() {
    getPolicies({
      applicationId: currentApplicationId,
    }).then((policyRes) => {
      // TODO:Fixed one api call
      const policyList = policyRes?.data?.list;
      setPolicyLists(policyList);
      const editData = editRouteData?.policies || getValues('policies');
      const editDataFilter = editData?.filter((policy) => policyList?.find((policyData) => policyData?.fileName === policy));
      setValue(
        'policies',
        isEmpty(editDataFilter) ? undefined : editDataFilter,
      );
    });
  }

  React.useEffect(() => {
    fetchAllPolicies();
  }, []);

  return (
    <div className="py-3">
      <Controller
        control={control}
        name="policies"
        render={(controlProps) => (
          <Select
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...controlProps}
            isMulti
            className="w-6/12"
            placeholder="Select middleware"
            options={policyLists}
            onChange={(data) => {
              setValue('policies', data);
              // setOtherFormData({ policies: data?.policies?.filter((policy) => policyLists?.find((policyData) => policyData?.fileName === policy)) });
            }}
            label="Middleware"
            valueKey="fileName"
            labelKey="fileName"
          />
        )}
      />
      <div className="mt-5">
        <LabelBox>Custom header</LabelBox>
        <table className="w-6/12 mt-5">
          <Controller
            control={control}
            name="headers"
            defaultValue={editRouteData.headers}
            render={(controlProps) => (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <HeaderComponent {...controlProps} />
            )}
          />
        </table>
      </div>
    </div>
  );
}

export default Advance;
