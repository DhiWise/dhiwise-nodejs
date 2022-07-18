const Css = {
  pointer: {
    cursor: 'pointer',
  },
  menuList: {
    margin: '2px',
  },
  disabledItem: {
    pointerEvents: 'none',
    cursor: 'default',
    color: 'grey',
  },
  gear: {
    fontSize: '1.7em',
    cursor: 'pointer',
    color: 'black',
    padding: '14px',
    border: 'none',
  },
  triangle: {
    fontSize: '0.9em',
    cursor: 'pointer',
    color: '#000000',
    padding: '14px',
    border: 'none',
  },
  imageTrigger: {
    height: '50px',
    width: '50px',
    cursor: 'pointer',
    padding: '3px',
    border: 'none',
  },
  textTrigger: {
    cursor: 'pointer',
    padding: '14px',
    border: 'none',
    fontWeight: 'bold',
  },
  menu: {
    position: 'relative',
    // display: 'inline-block',
  },
  menuItem: {
    float: 'left',
  },
  menuContent: {
    display: 'none',
    position: 'absolute',
    left: '0px',
    zIndex: '9999',
    backgroundColor: '#f9f9f9',
    minWidth: '300px',
    // minwidth: '300px',
    padding: '12px',
    overflow: 'auto',
    boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
  },
  show: {
    display: 'block',
  },
};

export default Css;
