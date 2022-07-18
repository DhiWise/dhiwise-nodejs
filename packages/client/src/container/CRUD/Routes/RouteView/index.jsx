import React from 'react';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { Icons } from '@dhiwise/icons';
import { deleteModelRoute, getModelRoutes } from '../../../../api/routes';
import {
  Description,
  Heading,
  Button,
  ListBoxWrap,
  SearchBox,
  IconBox,
  DropdownMenu,
  Checkbox,
  LinkTag,
  NoData,
  ConfirmationAlert,
  Select,
  BoxLayout,
} from '../../../../components';
import Spinner from './Route.loader';
import { useBoolean } from '../../../../components/hooks';
import { ROUTE_TYPES, ROUTE_GENERATE_TYPE } from '../../../../constant/routes';
import { useAddToggle } from '../AddToggleProvider';
import { useRoute } from '../RouteProvider';
import { useToastNotifications } from '../../../hooks';
import { getApplicationPlatforms } from '../../../../utils/applicationPlatform';

export const RoutesView = React.forwardRef(({
  applicationId,
}, ref) => {
  const projectDetail = useSelector((state) => state.projects.currentProjectDetail);
  const applicationLoginAccess = projectDetail?.applicationList?.find((d) => d._id === applicationId)?.configInput?.platform;
  const searchKeywords = React.useRef('');
  const [routeFilters, setRouteFilters] = React.useState([]);
  const [platformFilters, setPlatformFilters] = React.useState([]);
  const [loader, setLoader, hideLoader] = useBoolean(false);
  const { showAddModal, addModal } = useAddToggle();
  const {
    dispatch, selectedModelId, routeList, generalizedModel,
  } = useRoute();
  const isResetFilterFlag = React.useRef(null);
  const { addErrorToast } = useToastNotifications();

  function fetchAllModelRoutes(data = {}) {
    const {
      search = searchKeywords.current,
      platformsFilterData = platformFilters,
      routeFilterData = routeFilters,
    } = data;
    setLoader();
    getModelRoutes({
      applicationId,
      ...(!isEmpty(search) && { search: { keyword: search.trim(), keys: ['route'] } }),
      find: { modelId: (selectedModelId === generalizedModel?._id) ? null : selectedModelId, ...(!isEmpty(routeFilterData) && { method: routeFilterData }) },
      ...(!isEmpty(platformsFilterData) && { in: [{ platform: platformsFilterData }] }),
    }).then(
      (routeRes) => {
        dispatch({ type: 'SetRouteList', payload: routeRes?.data?.list });
        // setAppRoutes(routeRes?.data?.list || []);
        hideLoader();
      },
    )
      .catch(addErrorToast).finally(hideLoader);
  }

  function handleRouteFilters(value) {
    let newRouteFilter = routeFilters;
    if (value && isResetFilterFlag.current === null) {
      if (!routeFilters.includes(value)) {
        newRouteFilter = [...newRouteFilter, value];
      } else {
        newRouteFilter = newRouteFilter.filter((oldRouteFilter) => oldRouteFilter !== value);
      }
      fetchAllModelRoutes({ routeFilterData: newRouteFilter });
      setRouteFilters(newRouteFilter);
    }
  }
  React.useEffect(() => {
    searchKeywords.current = '';
    setPlatformFilters([]);
    setRouteFilters([]);
    if (selectedModelId) fetchAllModelRoutes({ platformsFilterData: [], routeFilterData: [] });
    // setHeight();
  }, [selectedModelId]);
  const setEditData = (route) => {
    dispatch({ type: 'SetEditRouteData', payload: route });
    showAddModal();
  };
  React.useEffect(() => {
    isResetFilterFlag.current = null;
  }, [routeFilters]);
  React.useImperativeHandle(ref, () => ({ fetchAllModelRoutes }));
  return (

    !addModal && (
    <BoxLayout variant="subRight">
      <div className="w-full flex flex-col">
        <div className="px-5 py-3 pb-0 flex justify-between headTop flex-shrink-0">
          <div className="flex items-center">
            <Heading variant="h4" className="mr-2">
              Routes
            </Heading>
            {/* <Tag variant="active" title="Active" /> */}
          </div>
          <div className="flex items-center">
            <SearchBox
              className="w-40"
              key={selectedModelId}
              placeholder="Search.."
              onSearch={(search) => {
                if (searchKeywords.current !== search.trim()) fetchAllModelRoutes({ search });
                searchKeywords.current = search.trim();
              }}
            />
            <div className="ml-2 w-56">
              <Select
                sizeMedium
                options={getApplicationPlatforms(applicationLoginAccess)} // to fetch all the platforms
                value={platformFilters}
                onChange={(platformsFilterData) => {
                  setPlatformFilters(platformsFilterData);
                  fetchAllModelRoutes({ platformsFilterData });
                }}
                placeholder="Select Platform"
                isMulti
              />
            </div>
            <DropdownMenu
            // wrapClass={memberCss.filterDropdown}
              position="right"
              placeholder={() => (
                <IconBox size="medium" variant="primary" shape="rounded" icon={<Icons.Filter color="#fff" />} className="ml-2" tooltip="Filter" />
              )}
              className="h-full flex items-center"
              dropdownMenu="h-auto smallCheckbox"
            >
              <div className="flex justify-between">
                <Heading variant="h6">Filter</Heading>
                <LinkTag
                  onClick={() => {
                    isResetFilterFlag.current = [];
                    // To set empty filter as well as stop multiple call
                    setRouteFilters([]);
                    if (!isEmpty(routeFilters))fetchAllModelRoutes({ routeFilterData: [] });
                  }}
                >
                  Reset filter
                </LinkTag>
              </div>
              <hr className="mt-2 mb-2" />
              <div className="gap-2 grid grid-cols-2">
                {
                ROUTE_TYPES.map((route) => (
                  <Checkbox
                    checked={routeFilters.includes(route.id)}
                    key={route.id}
                    onChange={() => { handleRouteFilters(route.id); }}
                  >
                    {route?.name}
                  </Checkbox>
                ))
              }
              </div>
            </DropdownMenu>
            <Button
              onClick={showAddModal}
              variant="primary"
              size="medium"
              className="ml-2"
              shape="rounded"
            >
              Add route
            </Button>
          </div>
        </div>
        <div className="p-5 pt-0 overflow-auto flex-grow">
          <div className="grid grid-cols-1 mt-5">
            {loader && <Spinner />}
            { !loader && (
              <>
                { !isEmpty(routeList)
                  ? routeList.map((route) => (
                    <SingleRoute
                      route={route}
                      editRoute={() => setEditData(route)}
                      onDelete={() => { dispatch({ type: 'DeleteRoute', payload: route }); }}
                      key={route?._id}
                    />
                  ))
                  : (
                    <div style={{ minHeight: 'calc(100vh - 215px)' }} className="flex items-center h-full">
                      <NoData title="No routes found" />
                    </div>
                  )}
              </>
            )}
          </div>
        </div>
      </div>
    </BoxLayout>
    )
  );
});
RoutesView.displayName = 'RoutesView';
const SingleRoute = React.memo(({ route, editRoute, onDelete }) => {
  const currentApplicationCode = useSelector((state) => state.projects.currentApplicationCode);
  const [isDelete, setIsDelete] = React.useState(false);

  const { addSuccessToast } = useToastNotifications();
  const [deleteLoader, setDeleteLoader, hideDeleteLoader] = useBoolean(false);

  const handleSubmit = React.useCallback(() => {
    setDeleteLoader();
    deleteModelRoute({
      id: route._id,
      isHardDelete: true,
      definitionType: currentApplicationCode,

    }).then((res) => {
      onDelete();
      addSuccessToast(res.message);
    }).catch(() => {
    }).finally(hideDeleteLoader);
  }, [route]);

  const handleDelete = () => {
    setIsDelete(true);
  };

  const handleClose = () => {
    setIsDelete(false);
  };

  return (
    <>
      <ConfirmationAlert isLoading={deleteLoader} isOpen={isDelete} handleSubmit={handleSubmit} handleClose={handleClose} description="Route will be deleted permanently and cannot be restored in the future. Are you sure do you want to delete this route?" />

      <ListBoxWrap variant="normal" className="flex justify-between items-center">
        <div className="w-8/12">
          <div className="flex items-center">
            <div className={`methodList mr-2 w-16 text-center flex-shrink-0 ${route.method}`}>{route.method?.toUpperCase()}</div>
            <LinkTag className="ml-1 text-base flex-grow-0 word-break" whiteText>{route.route}</LinkTag>
          </div>
          {route?.description && <Description className="mt-2">{route?.description}</Description>}
        </div>
        <div className="w-4/12 flex justify-end">
          {route?.type === ROUTE_GENERATE_TYPE.MANUAL && (
          <Button
            variant="outline"
            size="small"
            className="ml-2"
            shape="rounded"
            // loading={deleteLoader}
            onClick={handleDelete}
          >
            Delete
          </Button>
          )}
          { !(route?.type === ROUTE_GENERATE_TYPE.AUTO && route?.method === 'put' && route?.route?.endsWith('upsert')) && ( // don't provide edit option for auto generated route with "put" method that ends with "upsert"
            <Button
              onClick={editRoute}
              variant="primary"
              size="small"
              className="ml-2"
              shape="rounded"
            >
              Edit
            </Button>
          )}
        </div>
      </ListBoxWrap>
    </>
  );
});
SingleRoute.displayName = 'SingleRoute';
