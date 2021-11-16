import React from 'react';
import { Icons } from '@dhiwise/icons';
import { BackButton, Heading } from '../../../../components';

export const StepHeader = ({
  backTitle, headTitle, link, onClick, nameEditable, updateScreenName, setScreenName, editTitle, // editTitle,
  setNameEditable, screenName,
}) => {
  const screenNameRef = React.useRef(null);

  return (
    <div className="flex px-3 py-2 bg-gray-200 justify-center relative header flex-shrink-0">
      <div className="absolute left-4 top-2.5 z-1">
        <BackButton onClick={onClick} link={link} title={backTitle} />
      </div>
      <div className="ml-10 text-center">
        <Heading variant="h5" className="flex items-center">
          {!nameEditable && headTitle }
          {editTitle
          && (
          <>
            {
          nameEditable ? (
            <input
              ref={screenNameRef}
              placeholder="Screen Name"
              className="focus:outline-none text-xl text-primary-text bg-transparent font-semibold font-title w-full"
              value={screenName}
              defaultValue={screenName}
              onChange={(e) => {
                if (e.target.value?.length <= 250) {
                  setScreenName(e.target.value);
                }
              }}
              onBlur={updateScreenName}
              onKeyDown={(e) => { if (e.key === 'Enter') updateScreenName(); }}
            />
          ) : (
            <div
              onClick={() => {
                setTimeout(() => {
                  screenNameRef.current?.focus();
                }, 100);
                setNameEditable(true);
              }}
              className="w-4 h-4 ml-2 cursor-pointer"
            >

              <Icons.Edit />
            </div>
          )
        }
          </>
          )}
          {/* {editTitle
          && (
          <div className="w-4 h-4 ml-2">
            <Icons.Edit/>
          </div>
          )} */}
        </Heading>
      </div>
    </div>

  );
};
