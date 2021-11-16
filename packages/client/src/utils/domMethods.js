export const onSingleKeyDown = (e, focusField, FiledPosition, idPrefix, opt) => {
  // manage keyboard shortcuts for less inputs (event, field, object of fields)
  const focusIndex = FiledPosition[focusField];
  switch (e.keyCode) {
    case 38:
    { // up
      let field;
      if (opt?.inputWithId) {
        field = document.querySelector(`#${idPrefix}${focusIndex - 1}  [tabindex="0"]`);
      } else { field = document.querySelector(`#${idPrefix}${focusIndex - 1}`); }
      if (field && !field?.hasAttribute?.('disabled')) {
        field?.focus();
      }
      break; }
    case 40:
    {
      // down
      let field;
      if (opt?.inputWithId) {
        field = document.querySelector(`#${idPrefix}${focusIndex + 1}  [tabindex="0"]`);
      } else { field = document.querySelector(`#${idPrefix}${focusIndex + 1}`); }
      if (field && !field?.hasAttribute?.('disabled')) {
        field?.focus();
      }
      break; }
    case 37:
    { // left
      if (e.ctrlKey) {
        let field;
        if (opt?.inputWithId) {
          field = document.querySelector(`#${idPrefix}${focusIndex - 1}  [tabindex="0"]`);
        } else { field = document.querySelector(`#${idPrefix}${focusIndex - 1}`); }
        if (field && !field?.hasAttribute?.('disabled')) {
          field?.focus();
        }
      }
      break; }
    case 39:
    {
      // right
      if (e.ctrlKey) {
        let field;
        if (opt?.inputWithId) {
          field = document.querySelector(`#${idPrefix}${focusIndex + 1}  [tabindex="0"]`);
        } else { field = document.querySelector(`#${idPrefix}${focusIndex + 1}`); }
        if (field && !field?.hasAttribute?.('disabled')) {
          field.tabindex = 0;
          field?.focus();
        }
      }
      break; }
    case 13:
    {
      // enter
      let field;
      if (opt?.inputWithId) {
        field = document.querySelector(`#${idPrefix}${focusIndex + 1}  [tabindex="0"]`);
      } else { field = document.querySelector(`#${idPrefix}${focusIndex + 1}`); }
      if (field && !field?.hasAttribute?.('disabled')) {
        field?.focus();
      }
      break; }
    default:
      break;
  }
};

/**
 * handle view table format keyboard shortcut handel
 * @param  {e} keyEvent keyboard event
 * @param  {} focusIndex current focusIndex
 * @param  {} totalColumns totalColumn in Table
 * @param  {} totalRows totalRow in Table
 * @param  {} id='r' if you want set custom id
 *
 */
export const keyBoardShortcut = ({
  keyEvent: e, focusIndex, totalColumns, totalRows, id = 'r',
}) => {
  switch (e.keyCode) {
    case 38:
    { // up
      for (let nextIndex = totalColumns; nextIndex < totalRows * totalColumns; nextIndex += totalColumns) {
        const field = document.querySelector(`#${id}${focusIndex - nextIndex}`);
        if (field && !field?.hasAttribute?.('disabled')) {
          field?.focus();
          break;
        }
      }
      break; }
    case 40:
    { // down
      for (let nextIndex = totalColumns; nextIndex < totalRows * totalColumns; nextIndex += totalColumns) {
        const field = document.querySelector(`#${id}${focusIndex + nextIndex}`);
        if (field && !field?.hasAttribute?.('disabled')) {
          field?.focus();
          break;
        }
      }
      break; }
    case 37:
    { // left
      if (e.ctrlKey) {
        for (let nextIndex = 1; nextIndex !== totalRows * totalColumns; nextIndex += 1) {
          const field = document.querySelector(`#${id}${focusIndex - nextIndex}`);
          if (field && !field?.hasAttribute?.('disabled')) {
            field?.focus();
            break;
          }
        }
      }
      break; }
    case 39:
    {
      // right
      if (e.ctrlKey) {
        for (let nextIndex = 1; nextIndex !== totalRows * totalColumns; nextIndex += 1) {
          const field = document.querySelector(`#${id}${focusIndex + nextIndex}`);
          if (field && !field?.hasAttribute?.('disabled')) {
            field?.focus();
            break;
          }
        }
      }
      break; }
    case 13:
    {
      // enter
      for (let nextIndex = 1; nextIndex !== totalRows * totalColumns; nextIndex += 1) {
        const field = document.querySelector(`#${id}${focusIndex + nextIndex}`);
        if (field && !field?.hasAttribute?.('disabled')) {
          field?.focus();
          break;
        }
      }
      break; }

    default:
      break;
  }
};
