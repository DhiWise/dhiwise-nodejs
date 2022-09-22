/* eslint-disable camelcase */
/*!
 * ReactDrawer
 * Licensed under the MIT license
 *
 * Copyright (c) 2016 Tony Li
 */

// import animate from 'animate.css';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icons } from '@dhiwise/icons';
import { ReactDrawerCss } from './reactDrawerCss';

class ReactDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.onAnimationEnded = this.onAnimationEnded.bind(this);
  }

  UNSAFE_componentWillMount() {
    this.setState({
      open: this.props.open,
      hiddenOverlay: true,
      hiddenDrawer: true,
    });
  }

  componentDidMount() {
    this.drawer.addEventListener('webkitAnimationEnd', this.onAnimationEnded);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.open !== this.state.open) {
      nextProps.open ? this.openDrawer() : this.closeDrawer();
    }
  }

  componentWillUnmount() {
    this.drawer.removeEventListener('webkitAnimationEnd', this.onAnimationEnded);
  }

  onAnimationEnded() {
    if (!this.state.open) {
      this.setState({
        hiddenOverlay: true,
        hiddenDrawer: true,
      });
    }
  }

  getOverlayClassName(drawerCss) {
    return classNames(
      'react-drawer-overlay',
      drawerCss.overlay,
      //   animate.animated,
      {
        // [`${animate.fadeIn}`]: this.state.open,
        // [`${animate.fadeOut}`]: !this.state.open,
        [`${drawerCss.hidden}`]: this.state.hiddenOverlay,
      },
    );
  }

  getDrawerClassName(drawerCss) {
    const position = this.props.position || 'right';
    const themeAttr = `drawer${position}`;
    const drawerTheme = drawerCss[themeAttr];
    // const fade = animate[`fade${direction}${start}`];
    return classNames(
      'react-drawer-drawer',
      drawerCss.drawer,
      drawerTheme,
      //   animate.animated,
      //   fade,
      {
        [`${drawerCss.hidden}`]: this.state.hiddenDrawer,
      },
    );
  }

  openDrawer() {
    this.setState({
      hiddenOverlay: false,
      hiddenDrawer: false,
      open: true,
    });
  }

  closeDrawer() {
    this.setState({
      open: false,
    });
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  render() {
    const overlayClass = this.getOverlayClassName(ReactDrawerCss);
    const drawerClass = this.getDrawerClassName(ReactDrawerCss);
    const typeClass = `${ReactDrawerCss[[`drawer${this.props.type}`]]}`;
    return (
      <div className="">
        {!this.props.noOverlay ? (
          <div
            ref={(c) => { this.overlay = c; }}
            className={`${overlayClass}`}
            onClick={this.closeDrawer}
          />
        ) : null}
        <div
          className={`${drawerClass} ${this.props.size} ${typeClass}`}
          ref={(c) => { this.drawer = c; }}
        >
          {this.props.CloseFalse ? null
            : (
              <div onClick={this.closeDrawer} className="w-5 h-5 absolute right-5 top-6 cursor-pointer">
                <Icons.Close />
              </div>
            )}
          {this.props.children}
        </div>
      </div>
    );
  }
}

ReactDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  position: PropTypes.oneOf(['top', 'bottom', 'right', 'left']),
  type: PropTypes.oneOf(['horizontal', 'vertical']),
  noOverlay: PropTypes.bool,
};

export default ReactDrawer;
