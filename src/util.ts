import {
  Image
} from 'react-native';
import ImageResizer from "react-native-image-resizer";
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


export function getSizeInContainer(layout, width, height) {
  const {width: screenWidth, height: screenHeight} = layout;
  if (screenWidth < screenHeight) {
    return {
      width: screenWidth,
      height: height - height * Math.abs((screenWidth - width) / width),
    };
  } else {
    return {
      width: width - width * Math.abs((screenHeight - height) / height),
      height: screenHeight,
    }
  }
}

export function getResizedImage(uri, target: {height, width}) {
  return new Promise((resolve, reject) => {
    Image.getSize(uri, (width, height) => {
      const resized = getSizeInContainer({width: target.width, height: target.height}, width, height);

      ImageResizer.createResizedImage(uri, resized.width, resized.height, 'PNG', 100)
        .then((resizedImageUri) => resolve(resizedImageUri))
        .catch(e => reject(e))
    }, e => reject(e));
  });
}