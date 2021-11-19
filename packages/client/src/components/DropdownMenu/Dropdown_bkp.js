import React from 'react';
import DefaultCss from './Css';
// import { MenuBox } from '../MenuList';

let instances = 0;

class DropdownMenu extends React.Component {
  constructor(props) {
    super(props);
    this.toggleMenu = this.toggleMenu.bind(this);
    instances += 1;

    this.MENUITEMS_DIV = `__react_bs_dd_menuItems_${instances}`;
    this.CARAT_CLASS = `__react_bs_dd_carat_${instances}`;
    this.TRIGGER_CLASS = `__react_bs_dd_trigger_${instances}`;
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount(nextProps) {
    const { TRIGGER_CLASS } = this;
    const { MENUITEMS_DIV } = this;
    const { CARAT_CLASS } = this;

    // eslint-disable-next-line func-names
    window.addEventListener('click', function (e) {
      if (nextProps !== this.props) {
        const klass = e.target.className;
        const carat = document.getElementById(CARAT_CLASS);
        const menuItemDiv = document.getElementById(MENUITEMS_DIV);
        if (menuItemDiv && menuItemDiv.dataset.reactbsdditems === MENUITEMS_DIV) {
          if (
            klass !== `${MENUITEMS_DIV} show`
            && klass !== TRIGGER_CLASS
            && !klass.lastIndexOf('glyphicon', 0) === 0
          ) {
            menuItemDiv.classList.remove('show');
            if (carat) {
              carat.className = 'glyphicon glyphicon-triangle-bottom';
            }
          }
        }
      }
    });
  }

  getTrigger() {
    const css = this.getCss();
    const iconCss = { ...DefaultCss.gear };

    if (this.props.iconColor) {
      iconCss.color = this.props.iconColor;
    }
    // Override iconColor if it is present in css prop
    if (this.props.css && this.props.css.gear && this.props.css.gear.color) {
      iconCss.color = this.props.css.gear.color;
    }

    if (this.props.triggerType && this.props.trigger) {
      const triggerStyle = css.imageTrigger;
      const caratStyle = css.triangle;
      switch (this.props.triggerType.toLowerCase()) {
        case 'image':

          if (this.props.triggerWidth) {
            triggerStyle.width = this.props.triggerWidth;
          }
          if (this.props.triggerHeight) {
            triggerStyle.height = this.props.triggerHeight;
          }
          if (this.props.caratColor) {
            caratStyle.color = this.props.caratColor;
          }

          return (
            <div onClick={this.toggleMenu}>
              <img
                src={this.props.trigger}
                style={triggerStyle}
                className={this.TRIGGER_CLASS}
                alt="trigger"
              />
              <span
                id={this.CARAT_CLASS}
                className="glyphicon glyphicon-triangle-bottom"
                style={caratStyle}
              />
            </div>
          );
        case 'text':
          return (
            <div
              className={this.TRIGGER_CLASS}
              onClick={this.toggleMenu}
              style={css.textTrigger}
            >
              {this.props.trigger}
&nbsp;&nbsp;
              <span
                id={this.CARAT_CLASS}
                className="glyphicon glyphicon-triangle-bottom"
                style={caratStyle}
              />
            </div>
          );
        case 'icon':
          return (
            <span
              className={this.props.trigger}
              style={iconCss}
              onClick={this.toggleMenu}
            />
          );
        case 'component':
          return (
            <div
              className={this.props.className}
              onClick={this.toggleMenu}
            >
              <this.props.displayComponent />
            </div>
          );
        default:
          throw new Error("The value for DropdownMenu 'triggerType' is not supported for DropdownMenu. Try 'image', 'text' or 'icon'.");
      }
    } else {
      return (
        <span className="glyphicon glyphicon-cog" onClick={this.toggleMenu}>
          {this.props.Name}
        </span>
      );
    }
  }

  getMenuStyle() {
    const css = this.getCss();
    const menuStyle = JSON.parse(JSON.stringify(css.menuContent)); // Clone the current style
    const position = this.props.position === undefined ? 'right' : this.props.position;
    const supportedPositions = ['left', 'center', 'right'];

    if (supportedPositions.indexOf(position.toLowerCase()) === -1) {
      throw new Error("The value for 'position' prop is not supported for DropdownMenu. Try 'left', 'center' or 'right'.");
    }

    if (position) {
      let baseWidth = parseInt(
        DefaultCss.menuContent.minWidth.replace('px', ''), 10,
      );
      let offset = 0;
      baseWidth -= 40;

      // We need to use negative numbers as we are offsetting menu to the left
      if (position === 'center') {
        offset = (baseWidth / 2) * -1;
      }
      if (position === 'left') {
        offset = baseWidth * -1;
      }

      menuStyle.left = `${offset.toString()}px`;
    }

    return menuStyle;
  }

  getChildren() {
    return React.Children.map(
      this.props.children,
      (child) => React.cloneElement(child, { css: this.props.css }, null),
    );
  }

  getCss() {
    const propsCss = { ...this.props.css };
    const css = { ...DefaultCss };

    if (propsCss) {
      Object.keys(propsCss).forEach((key) => {
        css[key] = { ...DefaultCss[key], ...propsCss[key] };
      });
    }

    return css;
  }

  dropdownTitle() {
    return (
      <div className="mb-2 mt-2">
        <h2 className="text-xs text-gray-500 uppercase">{this.props.title}</h2>
      </div>
    );
  }

  fadeIn(element) {
    this.element.style.opacity = 0;

    const tick = function ticker() {
      this.element.style.opacity = +element.style.opacity + 0.04;

      if (+element.style.opacity < 1) {
        if (requestAnimationFrame) {
          requestAnimationFrame(tick);
        } else {
          setTimeout(tick, 16);
        }
      }
    };

    tick();
  }

  toggleArrow() {
    const carat = document.getElementById(this.CARAT_CLASS);

    if (carat) {
      if (carat.className === 'glyphicon glyphicon-triangle-top') {
        carat.className = 'glyphicon glyphicon-triangle-bottom';
      } else {
        carat.className = 'glyphicon glyphicon-triangle-top';
      }
    }
  }

  toggleMenu(e) {
    e.stopPropagation();
    const items = document.getElementById(this.MENUITEMS_DIV);
    if (items) {
      items.classList.toggle('show');
      if (this.props.fadeIn && this.props.fadeIn === 'true') {
        this.fadeIn(document.getElementById(this.MENUITEMS_DIV));
      }
    }
  }

  render() {
    if (this.props.children.length === 0) {
      throw new Error('DropdownMenu must have at least one MenuItem child.');
    }

    return (
      <div
        style={DefaultCss.menu}
        className={this.props.dropdownMenu}
        onFocus={this.props.onMouseover}
        onBlur={this.props.onMouseout}
      >
        {this.getTrigger()}
        <div
          data-reactbsdditems={this.MENUITEMS_DIV}
          id={this.MENUITEMS_DIV}
          className={`${this.MENUITEMS_DIV} position-div ${this.props.position} ${this.props.wrapClass}`}
          style={this.getMenuStyle()}
        >
          {this.props.dropdownTitle && <>{this.dropdownTitle()}</>}
          {this.props.isChildren
            ? <>{this.props.children}</>
            : <>{this.getChildren()}</>}
        </div>
      </div>
    );
  }
}

export default DropdownMenu;
