import React from 'react';
import ReactTooltip from 'react-tooltip';
import { Icons } from '@dhiwise/icons';
import { TableViewCss } from '../../../../../assets/css/tableViewCss';
import { IconBox } from '../../../../../components';
import { DB_TYPE } from '../../../../../constant/model';

export const TableHead = ({
  onAddRow, dbType,
  // onUpdateJson, tableJson
}) => (
  <div className={`${TableViewCss.tableHead} tableHead`}>
    <tr>
      <td className="pl-10">
        <div data-tip data-for="React-tooltip" className="left-3 top-1.5 absolute">
          <IconBox icon={<Icons.Plus color="#fff" />} tooltip="Add row" variant="primary" shape="rounded" size="small" onClick={() => onAddRow(undefined, true)} />
        </div>
        <div className="tableInputSelect">Attributes</div>
      </td>
      <td className="">
        <div className="tableInputSelect">Data type</div>
      </td>
      <td className="">
        <div className="tableInputSelect">Value</div>
      </td>
      <td className="">
        <div className="tableInputSelect">Default</div>
      </td>
      {dbType !== DB_TYPE.MONGODB
        && (
        <td className="">
          <div className="tableInputSelect">Relation</div>
        </td>
        )}
      <td className="check flex">
        <span data-tip data-for="Private" className="text-center tableCheck">
          Private
          <ReactTooltip id="Private" place="bottom" type="dark">Private marked attribute will not be included in default API response</ReactTooltip>
        </span>
        {dbType !== DB_TYPE.MONGODB && (
        <span data-tip data-for="primary" className="text-center tableCheck">
          P
          <ReactTooltip id="primary" place="bottom" type="dark">Primary</ReactTooltip>
        </span>
        )}

        <span data-tip data-for="require" className="text-center tableCheck">
          R
          <ReactTooltip id="require" place="bottom" type="dark">Require</ReactTooltip>
        </span>
        <span data-tip data-for="unique" className="text-center tableCheck">
          U
          <ReactTooltip id="unique" place="bottom" type="dark">Unique</ReactTooltip>
        </span>

        <span data-tip data-for="auto-increment" className="text-center tableCheck">
          AI
          <ReactTooltip id="auto-increment" place="bottom" type="dark">Auto increment</ReactTooltip>
        </span>
      </td>
      <td className="">
        <div className="smallInput">Minimum</div>
      </td>
      <td className="">
        <div className="smallInput">Maximum</div>
      </td>
      <td className="check flex">
        <span data-tip data-for="Lowercase" className="text-center tableCheck">
          Low.
          <ReactTooltip id="Lowercase" place="bottom" type="dark">Lowercase</ReactTooltip>
        </span>
        {dbType === DB_TYPE.MONGODB
        && (
        <span data-tip data-for="Trim" className="text-center tableCheck">
          Trim
          <ReactTooltip id="Trim" place="bottom" type="dark">Trim</ReactTooltip>
        </span>
        )}

      </td>
      <td className="">
        <div className="smallInput">
          Pattern
        </div>
      </td>

    </tr>
  </div>
);
