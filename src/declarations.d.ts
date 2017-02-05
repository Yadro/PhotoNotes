declare module "react-native-button" {
  import React, { Component } from "react";

  interface Props {
    style?: React.ViewStyle;
    styleDisabled?: React.ViewStyle;
    onPress?: () => any;
  }

  export default class Button extends Component<Props, any> {}
}

declare module 'react-navigation' {

  export interface StackNavigatorConfig {
    initialRouteName?; //Sets the default screen of the stack. Must match one of the keys in route configs.
    initialRouteParams?; //The params for the initial route
    navigationOptions?; //Default navigation options to use for screens
    paths?; //A mapping of overrides for the paths set in the route configs
    modal?; //- Make the screens slide in from the bottom which is a common iOS pattern. Only works on iOS, has no effect on Android.
    mode?;
    headerMode?; //- Specifies how the header should be rendered:
    cardStyle?; //- Use this prop to override or extend the default style for an individual card in stack.
  }

  export interface NavigationProp {
    navigate?: {
      routeName; // - A destination routeName that has been registered somewhere in the app's router
      params; // - Params to merge into the destination route
      action; // - (advanced) The sub-action to run in the child router, if the screen is a navigator.
    };
    state?: {
      routeName; // - the name of the route config in the router
      key; // - a unique identifier used to sort routes
      params; // - an optional object of string options for this screen
    };
    setParams?;
    goBack?;
    dispatch?;
  }

  export function StackNavigator(RouteConfigs: any, StackNavigatorConfig?: StackNavigatorConfig);
  export function TabNavigator();
  export function DrawerNavigator();
  export class NavigationActions {
    static navigate(params);
    static reset(params);
    static setParams(params);
  }
}


declare module 'react-native-bottom-sheet-behavior' {
  import React, { Component } from "react";

  export class FloatingActionButton extends Component<any, any> {}
  export class NestedScrollView extends Component<any, any> {}
  export class CoordinatorLayout extends Component<any, any> {}
  export class BottomSheetBehavior extends Component<any, any> {}
}

declare interface window {
  __REDUX_DEVTOOLS_EXTENSION__();
}