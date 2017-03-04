
/*declare module 'react-native-photo-view' {
  import {Component} from 'react';
  export default class PhotoView extends Component<any, any> {}
}*/

declare module 'react-native-image-resizer' {
  export function ImageResizer(path, maxWidth, maxHeight, compressFormat, quality, rotation, outputPath);
}

declare module 'react-native-check-box' {
  import {Component} from 'react';
  export default class Checkbox extends Component<any, any> {}
}

declare module 'react-native-action-button' {
  import {Component} from 'react';
  export default class ActionButton extends Component<any, any> {}
}

declare module 'react-native-image-picker' {
  interface ImagePickerResponse {
    error;
    customButton;
    didCancel;

    data; // base64
    uri;
    fileName;
    path;
    type;
    fileSize;
    height;
    width;
    isVertical;
    originalRotation;
    timestamp;
  }
  export default class ImagePicker {
    static showImagePicker(option, response: (r: ImagePickerResponse) => any);
  }
}

declare module "react-native-button" {
  import * as React from 'react';
  import {Component} from 'react';

  interface Props {
    style?: React.ViewStyle;
    styleDisabled?: React.ViewStyle;
    onPress?: () => any;
  }

  export default class Button extends Component<Props, any> {}
}

declare module 'react-navigation' {

  export interface StackNavigatorConfig {
    /**
     * Sets the default screen of the stack. Must match one of the keys in route configs.
     */
    initialRouteName?;
    /**
     * The params for the initial route
     */
    initialRouteParams?;
    /**
     * Default navigation options to use for screens
     */
    navigationOptions?;
    /**
     * A mapping of overrides for the paths set in the route configs
     */
    paths?;
    /**
     * - Make the screens slide in from the bottom which is a common iOS pattern. Only works on iOS, has no effect on Android.
     */
    modal?; //
    mode?;
    /**
     * - Specifies how the header should be rendered:
     */
    headerMode?: 'float' | 'screen '| 'none';
    /**
     * - Use this prop to override or extend the default style for an individual card in stack.
     */
    cardStyle?;
  }

  export function StackNavigator(RouteConfigs: any, StackNavigatorConfig?: StackNavigatorConfig);
  export function TabNavigator();
  export function DrawerNavigator();

  type Action = any;
  export class NavigationActions {
    static navigate(params): Action;
    static reset(params): Action;
    static setParams(params);
  }

  export interface ScreenNavigationProp {
    navigation: {
      navigate: (routeName, params?, action?) => any;
      state: {
        /** the name of the route config in the router */
        routeName;
        /** a unique identifier used to sort routes */
        key;
        /** an optional object of string options for this screen */
        params;
      };
      setParams: (param: any) => void;
      goBack: (route?: string) => void;
      dispatch: (action: Action) => void; // Send an action to the router
    }
  }
}


declare module 'react-native-bottom-sheet-behavior' {
  import { Component } from "react";

  export class FloatingActionButton extends Component<any, any> {}
  export class NestedScrollView extends Component<any, any> {}
  export class CoordinatorLayout extends Component<any, any> {}
  export class BottomSheetBehavior extends Component<any, any> {}
}

declare interface Window {
  __REDUX_DEVTOOLS_EXTENSION__;
}

declare const __DEV__;