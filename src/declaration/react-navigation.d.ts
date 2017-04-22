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
