import { isEmpty } from 'lodash';
import React from 'react';
import {
  Button,
  Heading,
} from '../../../components';

const Header = (props) => {
  const { onCancel, permissions } = props;
  return (
    <div className="flex justify-between py-3 px-3 items-center  headTop pb-5">
      <div className="w-6/12">
        <Heading variant="h5">Model permission</Heading>
      </div>
      { !isEmpty(permissions) && (
      <div className="flex justify-end w-6/12">
        <Button
          size="medium"
          variant="secondary"
          shape="rounded"
          onClick={onCancel}
        >
          Reset
        </Button>

      </div>
      )}
    </div>
  );
};
export default React.memo(Header);
