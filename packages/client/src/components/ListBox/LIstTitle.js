import React from 'react';

import { ListBoxCss } from './listboxCss';

export const ListTitle = ({
  title, smallTitle, titleClass, onClick,
}) => (
  <>
    {!!title
    && (
    <h4
      onClick={onClick}
      className={`${ListBoxCss.listTitle} ${titleClass}`}
    >
      {title}
    </h4>
    )}
    {!!smallTitle
    && (
    <h5 className={`${ListBoxCss.listsmallTitle} ${titleClass}`} onClick={onClick}>
      {smallTitle}
    </h5>
    )}
  </>
);
