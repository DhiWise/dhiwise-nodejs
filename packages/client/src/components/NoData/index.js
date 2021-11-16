import React from 'react';
import Lottie from 'react-lottie';
import PropTypes from 'prop-types';
import animationData from './notfoundproject.json';
import { Button } from '../Button';
import { Description } from '../Description';
import { Heading } from '../Heading';

const NoData = (props) => {
  const {
    title, description, onClick, btnText, className, imageHeight, imgSize, smallBox, isLoading = false,
  } = props;
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <div className="flex justify-center items-center py-5 w-full h-full">
      <div className={`text-center w-6/12 ${className}`}>
        <div className="nodDataFound">
          <Lottie
            options={defaultOptions}
            height={imageHeight || 250}
            width={imgSize || 250}
          />
        </div>
        {!!title && <Heading className={` ${smallBox ? '-mt-4' : '-mt-12'}`} variant={smallBox ? 'h5' : 'h4'}>{title}</Heading>}
        {description
          ? (
            <Description className="mt-2">
              {description}
              {' '}
            </Description>
          )
          : null}
        {onClick && btnText
          ? <Button onClick={onClick} className="mt-4" shape="rounded" variant="primary" loading={isLoading}>{btnText}</Button>
          : null}
      </div>
    </div>
  );
};
export default NoData;
NoData.propTypes = {
  /**
   * display no data title
   */
  title: PropTypes.string,
  /**
   * display no data description
   */
  description: PropTypes.string,
  /**
   * onclick btn text
   */
  btnText: PropTypes.string,
  /**
   * function onclick
   */
  onClick: PropTypes.func,

};

NoData.defaultProps = {
  // title: 'No Data Found',
  // description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has  and typesetting industry. Lorem Ipsum has.',
};
