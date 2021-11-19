import React from 'react';
import Modal from 'react-modal';
import { Icons } from '@dhiwise/icons';
import { Button } from '../Button';
import { Description } from '../Description';
import { Heading } from '../Heading';

const PopupCss = {
  closebutton: 'absolute right-6 top-6 focus:outline-none',
  closebuttonimg: 'w-5',
  popupwrap: 'w-full bg-gray-black border-1 border-gray-100 rounded-lg',
  overlay: 'fixed top-0 bottom-0 w-full h-full z-10',
  popupbody: 'py-10 px-5 text-center',
};
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marign: 'auto',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    background: 'transparent',
    overflow: 'visible',
  },
};
export const ConfirmationAlert = ({
  handleSubmit,
  children,
  shortDesc,
  closeModal,
  isOpen,
  title = 'Are you sure?',
  description = '',
  okText = 'Delete',
  variant = 'danger',
  handleClose,
  descVarint,
  isLoading = false,
  overlayClass,
  size,
  titleVariant,
}) => (
  <Modal
    isOpen={isOpen}
    // onAfterOpen={handleSubmit}
    onRequestClose={handleClose}
    style={customStyles}
    contentLabel="Example Modal"
    className={`w-11/12 md:w-100 absolute m-auto bg-white focus:outline-none ${size}`}
    overlayClassName={`${PopupCss.overlay} ${overlayClass}`}
    appElement={document.getElementById('root')}
  >
    <div className={PopupCss.popupwrap}>
      {closeModal && (
        <button onClick={closeModal} className={PopupCss.closebutton}>
          <div className={PopupCss.closebuttonimg}>
            <Icons.Close />
          </div>
        </button>
      )}
      <div className={PopupCss.popupbody}>
        <Heading variant={titleVariant || 'h3'}>{title}</Heading>
        {!!description && <Description variant={descVarint} className="mt-3 w-10/12 m-auto">{description}</Description>}
        {children}
        {!!(okText || handleClose || handleSubmit)
          && (
          <div className="mt-8">
            {!!handleClose && <Button onClick={handleClose} variant="outline" shape="rounded">Cancel</Button>}
            {!!handleSubmit && <Button autoFocus onClick={handleSubmit} variant={variant} shape="rounded" className="ml-2" style={{ minWidth: '5rem' }} loading={isLoading}>{okText}</Button>}
          </div>
          )}
        {shortDesc && <Description className="mt-3 w-10/12 m-auto">{shortDesc}</Description>}
      </div>
    </div>
  </Modal>
);
