import * as React from 'react';
import {StyleSheet, ToolbarAndroid} from 'react-native';
const nativeImageSource = require('nativeImageSource');

interface ToolbarP {
  title?: string;
  subTitle?: string;
  navIcon?;
  logo?;
  overflowIcon?;
  actions?;
  onIconClicked?;
  onActionSelected?;
  color?: string;
  subtitleColor?: string;
  backgroundColor?: string;
  style?;
}
const Toolbar = ({
  title, subTitle,
  navIcon, logo, overflowIcon,
  actions, onIconClicked, onActionSelected,
  color, subtitleColor, backgroundColor, style
}: ToolbarP) => (
  <ToolbarAndroid
    logo={logo}
    navIcon={navIcon}
    title={title}
    subtitle={subTitle}

    actions={actions}
    onIconClicked={onIconClicked ? onIconClicked : onActionSelected}
    onActionSelected={onActionSelected}

    overflowIcon={overflowIcon}
    titleColor={color || 'black'}
    subtitleColor={subtitleColor ? subtitleColor : (color || 'black')}
    style={[css.toolbar, backgroundColor && {backgroundColor}, style]}
    elevation={5}
  />
);
export default Toolbar;

const css = StyleSheet.create({
  toolbar: {
    backgroundColor: 'white',
    height: 56,
  }
});