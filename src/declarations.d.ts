
declare module 'react-native-image-resizer' {
  export default class {
    static createResizedImage(path, maxWidth, maxHeight,
                              compressFormat, quality, rotation?, outputPath?): Promise<string>;
  }
}

declare module 'react-native-google-analytics-bridge' {
  export class GoogleAnalyticsTracker {
    constructor(id: string);
    trackEvent(screen: string, action: string);
    trackScreenView(screen: string);
  }
}
declare module 'react-native-dialogs' {
  type MultiChoiceCallback = (indices: number[], selected: string[]) => any;
  type ChoiceCallback = (indices: number, selected: string) => any;
  interface DialogOptions {
    title?: string;
    content?: string;
    items?: string[];
    selectedIndex?: number;
    itemsCallback?: MultiChoiceCallback;
    itemsCallbackSingleChoice?: ChoiceCallback;
    itemsCallbackMultiChoice?: MultiChoiceCallback;

    input?: {
      prefill?: string;
      callback?: (choose: number) => void;
    }

    positiveText?: string;
    negativeText?: string;
    neutralText?: string;
  }
  export default class {
    set(options: DialogOptions): void;
    show(): void;
  }
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
  import {Component} from 'react';
  import {ViewStyle} from 'react-native';

  interface Props {
    style?: ViewStyle;
    styleDisabled?: ViewStyle;
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
  export function DrawerNavigator(RouteConfigs, DrawerNavigatorConfig);

  type Action = any;
  export class NavigationActions {
    static navigate(params): Action;
    static reset(params): Action;
    static setParams(params);
  }

  export interface ScreenNavigationProp {
    screenProps: any;
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
