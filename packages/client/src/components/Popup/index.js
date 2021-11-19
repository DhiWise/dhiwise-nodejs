import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { Icons } from '@dhiwise/icons';
import { Button } from '../Button';
import { Heading } from '../Heading';
import { Description } from '../Description';

const PopupCss = {
  closebutton: 'absolute right-6 top-6 focus:outline-none',
  closebuttonimg: 'w-5',
  popupwrap: 'w-full bg-gray-black border-1 border-gray-100 rounded-lg',
  overlay: 'fixed top-0 bottom-0 w-full h-full z-10',
  titleCss: 'text-primary-text font-bold py-4 px-6 border-b border-gray-100',
  popupbody: 'p-4 md:p-6',
  poupupfooter: 'flex flex-wrap items-center md:flex-nowrap justify-end py-3 px-2 md:px-8 border-t border-gray-100',
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

export const Popup = (props) => (
  <Modal
    isOpen={props.isOpen}
    onAfterOpen={props.afterOpenModal}
    onRequestClose={props.closeModal}
    style={customStyles}
    contentLabel="Example Modal"
    className={`${props.size ? props.size : 'xxl:w-6/12 xl:w-8/12 '} absolute m-auto bg-white focus:outline-none`}
    overlayClassName={`${PopupCss.overlay} ${props.backPopup && 'backPopup'}`}
    appElement={document.getElementById('root')}
  >
    <div className={`${PopupCss.popupwrap} ${props.popupWrap}`}>
      {!!props.title && (
        <>
          <div className={`${PopupCss.titleCss} popupHeader`}>
            <Heading variant="h4" className={props.titleClass}>{props.title}</Heading>
            {!!props.desc
          && (
          <Description className="mt-0.5">
            {props.desc}
          </Description>
          )}
          </div>
        </>
      )}
      {props.closeFalse ? null : (
        <button onClick={props.closeModal} className={`${PopupCss.closebutton} ${props.CloseClass}`}>
          <div className={PopupCss.closebuttonimg}><Icons.Close /></div>
        </button>
      )}
      <div className={`${PopupCss.popupbody} ${props.bodyClass}`} style={props.style}>{props.children}</div>
      {(props.submit || props.cancel) && (
      <div className={`${PopupCss.poupupfooter} popupFooter `}>
        {props.cancel && (
        <Button
          onClick={props.handleCancel}
          className="m-1 md:mr-2"
          type="cancel"
          variant="outline"
          shape="rounded"
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...(props.isAutoFocusOnSave && { tabindex: -1 })}
        >
          {props.cancel}
        </Button>
        )}
        {!!props.extraButton
        && (
        <Button className="m-1 md:mr-2" variant="secondary" shape="rounded" onClick={props.handleExtra}>
          {props.extraButton}
        </Button>
        )}
        {props.submit && (
        <Button
          onClick={props.handleSubmit}
          type="submit"
          shape="rounded"
          loading={props.submitLoading}
          disabled={props.disabledSubmit || false}
        >
          {props.submit}
        </Button>
        )}
      </div>
      ) }
    </div>
  </Modal>
);

Popup.propTypes = {
  size: PropTypes.oneOf(['xl', 'lg', 'md', 'sm', 'xs']),
};
