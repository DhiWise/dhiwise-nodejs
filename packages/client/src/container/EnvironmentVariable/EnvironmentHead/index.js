import React from 'react';
import Popover from 'react-popover';
import { Icons } from '@dhiwise/icons';
import {
  Button, ConfirmationAlert, Description, Heading, SearchBox, IconBox,
} from '../../../components';
import { useBoolean } from '../../hooks';

export const EnvironmentHead = React.memo(({
  onSave, upsertLoader, onDelete, onSearch, deleteLoader, isSearch, isSelected, isLastObj, title, desc, headTooltip,
}) => {
  const [isOtherProOpen, setisOtherProOpen] = React.useState(false);

  const [isDelete, setIsDelete, hideDelete] = useBoolean(false);
  const handleDelete = () => {
    setIsDelete();
  };
  const handleClose = () => {
    hideDelete();
  };
  const alertDescription = 'Environment variable will be deleted permanently and cannot be restored in the future.Are you sure do you want to delete this environment variable?';
  return (
    <>
      <div className="p-3 flex justify-between items-center enviromentTop w-full">
        <div className="w-6/12">
          <Heading variant="h4" className="flex items-center">
            {title || 'Environment variable'}
            {!!headTooltip
            && (
              <div
                onMouseOut={() => setisOtherProOpen(false)}
                onMouseOver={() => setisOtherProOpen(true)}
              >
                <Popover
                  place="below"
                  body={[
                    <Description key={title} className="w-96 text-left">{headTooltip}</Description>,
                  ]}
                  className="popupCustom"
                  isOpen={isOtherProOpen}
                >

                  <IconBox variant="ghost" size="small" className="" icon={<Icons.Info />} />
                </Popover>
              </div>
            )}
          </Heading>
          {!!desc && <Description className="">{desc}</Description>}
        </div>
        <div className="w-6/12 flex justify-end items-center">
          <div className="h-8 w-48">
            <SearchBox placeholder="Search" value={isSearch || undefined} onSearch={onSearch} />
          </div>
          <Button
            size="medium"
            variant="outline"
            shape="rounded"
            className="ml-2"
            loading={deleteLoader}
            onClick={handleDelete}
            disabled={!isSelected || isLastObj}
          >
            Delete
          </Button>
          <Button
            size="medium"
            variant="primary"
            shape="rounded"
            className="ml-2"
            disabled={deleteLoader}
            loading={!deleteLoader && upsertLoader}
            onClick={onSave}
          >
            Save
          </Button>
        </div>
      </div>
      <ConfirmationAlert
        isOpen={isDelete}
        description={alertDescription}
        handleClose={handleClose}
        handleSubmit={() => {
          onDelete();
          hideDelete();
        }}
      />
    </>
  );
});
EnvironmentHead.displayName = 'EnvironmentHead';
