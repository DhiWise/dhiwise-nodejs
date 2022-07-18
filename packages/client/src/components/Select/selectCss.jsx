/* eslint-disable no-nested-ternary */
export const SelectCss = {
  selectlabel: 'mb-1.5 text-primary-text text-sm block w-full leading-5 font-normal',
  desc: 'mt-1',
  erorrClass: 'text-error text-sm mt-1 block',
  selectWrap: 'bg-gray-90 border-1 border-gray-90 p-2 rounded-3 focus:outline-none focus:border-primary-dark',
  option: (provided, state) => ({
    ...provided,
    // eslint-disable-next-line no-nested-ternary
    backgroundColor: state.isSelected ? 'var(--color-bg-primary) !important' : state.isFocused ? 'var(--color-bg-primary) !important' : 'var(--color-bg-white) !important',
    borderBottom: '1px solid var(--color-gray-90)',
    padding: '5px 10px',
    fontSize: '14px',
    color: state.isSelected ? '#fff' : state.isFocused ? '#fff' : 'var(--color-text-primary)',
    cursor: state.isDisabled ? 'not-allowed' : 'pointer',
    opacity: state.isDisabled ? 0.5 : 1,
    wordBreak: 'break-word',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'transparent',
    margin: '0',
    border: '1px solid var(--color-gray-90)',
    boxShadow: 'var(--box-shadow)',
  }),
  input: (provided) => ({
    ...provided,
    color: 'text-primary-text',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'var(--color-placeholder-primary)',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    top: 'auto',
    transform: 'translate(0,0)',
    // position: 'relative',
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: 'var(--color-gray-200)',
    color: 'var(--color-text-primary)',
    flexWrap: 'no-wrap',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    // backgroundColor:"var(--color-bg-default-light)",
    color: 'var(--color-text-primary)',
    fontSize: '75%',
    padding: '1px',
    paddingLeft: '4px',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    backgroundColor: 'transparent !important',
    color: 'var(--color-text-primary) !important',
    cursor: 'pointer',
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';
    return {
      ...provided,
      color: 'var(--color-gray-white)',
      // marginTop:"4px",
      opacity,
      transition,
    };
  },
  dropdownIndicator: (provided) => ({
    ...provided,
    fill: 'var(--color-gray-white)',
  }),
  group: (provided) => ({
    ...provided,
    fontSize: '14px',
    padding: '0 10px',
  }),
};
export const DarkSelect = {
  menuList: (provided) => ({
    ...provided,
    padding: 0,
    maxHeight: '150px',
    borderRadius: '0 0 3px 3px',
    backgroundColor: 'var(--color-gray-inputSub)',
    border: 'none',
  }),
  control: (provided, state) => ({
    ...provided,
    background: 'var(--color-gray-inputSub)',
    opacity: state.isDisabled ? 0.5 : 1,
    cursor: state.isDisabled ? 'not-allowed' : 'pointer',
    padding: '1px 0',
    // none of react-select's styles are passed to <Control />
    width: '100%',
    display: 'flex',
    color: 'var(--color-gray-white)',
    // border:"none",
    border: state.isFocused ? '1px solid var(--color-bg-primary)' : '1px solid var(--color-gray-300) !important',
    borderRadius: '3px',
    boxShadow: 'none',
  }),
  valueContainer: (provided) => ({
    ...provided,
    flexWrap: 'nowrap',
  }),
};
export const LightSelect = {
  menuList: (provided) => ({
    ...provided,
    padding: 0,
    maxHeight: '150px',
    borderRadius: '0 0 3px 3px',
    backgroundColor: 'var(--color-gray-input)',
    border: 'none',
  }),
  control: (provided, state) => ({
    ...provided,
    background: 'var(--color-gray-input)',
    opacity: state.isDisabled ? 0.5 : 1,
    cursor: state.isDisabled ? 'not-allowed' : 'pointer',
    padding: '1px 0',
    // none of react-select's styles are passed to <Control />
    width: '100%',
    display: 'flex',
    color: 'var(--color-gray-white)',
    // border:"none",
    border: state.isFocused ? '1px solid var(--color-bg-primary)' : '1px solid var(--color-gray-70) !important',
    borderRadius: '3px',
    boxShadow: 'none',
  }),
  valueContainer: (provided) => ({
    ...provided,
    flexWrap: 'nowrap',
  }),
};

export const SmallSelectCss = {
  menuList: (provided) => ({
    ...provided,
    padding: 0,
    maxHeight: '150px',
    borderRadius: '0 0 3px 3px',
    backgroundColor: 'var(--color-gray-input)',
    border: 'none',
  }),
  control: (provided, state) => ({
    ...provided,
    background: 'var(--color-gray-input)',
    opacity: state.isDisabled ? 0.5 : 1,
    cursor: state.isDisabled ? 'not-allowed' : 'pointer',
    padding: '0 0',
    // none of react-select's styles are passed to <Control />
    width: '100%',
    display: 'flex',
    minHeight: '26px',
    color: 'var(--color-gray-white)',
    // border:"none",
    border: state.isFocused ? '1px solid var(--color-bg-primary)' : '1px solid var(--color-gray-70) !important',
    borderRadius: '3px',
    boxShadow: 'none',
  }),
  input: (provided) => ({
    ...provided,
    padding: '0 0px',
    margin: '1px',
    color: 'text-primary-text',
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: '26px',
  }),
  valueContainer: (provided) => ({
    ...provided,
    flexWrap: 'nowrap',
    padding: '0px 8px',
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';
    return {
      ...provided,
      color: 'var(--color-gray-white)',
      fontSize: '12px',
      // marginTop:"4px",
      opacity,
      transition,
    };
  },
};
export const SmallDarkSelectCss = {
  menuList: (provided) => ({
    ...provided,
    padding: 0,
    maxHeight: '150px',
    borderRadius: '0 0 3px 3px',
    backgroundColor: 'var(--color-gray-inputSub)',
    border: 'none',
  }),
  control: (provided, state) => ({
    ...provided,
    background: 'var(--color-gray-inputSub)',
    opacity: state.isDisabled ? 0.5 : 1,
    cursor: state.isDisabled ? 'not-allowed' : 'pointer',
    padding: '0 0',
    // none of react-select's styles are passed to <Control />
    width: '100%',
    display: 'flex',
    minHeight: '30px',
    color: 'var(--color-gray-white)',
    // border:"none",
    border: state.isFocused ? '1px solid var(--color-bg-primary)' : '1px solid var(--color-gray-300) !important',
    borderRadius: '3px',
    boxShadow: 'none',
  }),
  input: (provided) => ({
    ...provided,
    padding: '1px 0px',
    color: 'text-primary-text',
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: '30px',
  }),
  valueContainer: (provided) => ({
    ...provided,
    flexWrap: 'nowrap',
    padding: '0px 8px',
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';
    return {
      ...provided,
      color: 'var(--color-gray-white)',
      fontSize: '12px',
      // marginTop:"4px",
      opacity,
      transition,
    };
  },
};

export const MediumSelectCss = {
  menuList: (provided) => ({
    ...provided,
    padding: 0,
    maxHeight: '150px',
    borderRadius: '0 0 3px 3px',
    backgroundColor: 'var(--color-gray-input)',
    border: 'none',
  }),
  control: (provided, state) => ({
    ...provided,
    background: 'var(--color-gray-input)',
    opacity: state.isDisabled ? 0.5 : 1,
    cursor: state.isDisabled ? 'not-allowed' : 'pointer',
    padding: '0 0',
    // none of react-select's styles are passed to <Control />
    width: '100%',
    display: 'flex',
    minHeight: '30px',
    color: 'var(--color-gray-white)',
    // border:"none",
    border: state.isFocused ? '1px solid var(--color-bg-primary)' : '1px solid var(--color-gray-70) !important',
    borderRadius: '3px',
    boxShadow: 'none',
  }),
  input: (provided) => ({
    ...provided,
    padding: '0 0px',
    margin: '1px',
    color: 'text-primary-text',
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: '30px',
  }),
  valueContainer: (provided) => ({
    ...provided,
    flexWrap: 'nowrap',
    padding: '0px 8px',
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';
    return {
      ...provided,
      color: 'var(--color-gray-white)',
      fontSize: '12px',
      // marginTop:"4px",
      opacity,
      transition,
    };
  },
};

export const simlpeSelectCss = {
  menuList: (provided) => ({
    ...provided,
    padding: 0,
    maxHeight: '150px',
    borderRadius: '0 0 3px 3px',
    backgroundColor: 'var(--color-gray-input)',
    border: 'none',
  }),
  control: (provided, state) => ({
    ...provided,
    background: 'transparent',
    opacity: state.isDisabled ? 0.5 : 1,
    cursor: state.isDisabled ? 'not-allowed' : 'pointer',
    padding: ' 0',
    // none of react-select's styles are passed to <Control />
    width: '100%',
    display: 'flex',
    color: 'var(--color-gray-white)',
    border: 'none',
    // borderBottom: state.isFocused ? '1px solid var(--color-bg-primary)' : '1px solid var(--color-gray-70) !important',
    borderRadius: '3px',
    boxShadow: 'none',
  }),
  valueContainer: (provided) => ({
    ...provided,
    flexWrap: 'nowrap',
  }),
};
