import React from 'react';
import { Description, Heading, Button } from '../../../../../components';

export const Head = ({ handleShow }) => (
  <div className="flex justify-between p-3 w-full items-center">
    <div className="w-8/12">
      <Heading variant="h5">Data format</Heading>
      <Description className="mt-1 xl:text-xs">
        Configure a global data format for your model attributes.
      </Description>
    </div>
    <div className="w-4/12 flex justify-end">
      <Button variant="primary" size="medium" shape="rounded" onClick={handleShow}>Add format</Button>
    </div>
  </div>
);
