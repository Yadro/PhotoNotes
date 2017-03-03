import {NavigationActions} from "react-navigation";

/**
 * @example this.props.navigation.dispatch(navigationReset('RouteName'));
 * TODO not tested params
 */
export const navigationReset = (routeName, params?) =>
  NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({routeName, params})
    ]
  });