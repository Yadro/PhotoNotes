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
  if (width < height) {
    const deltaPerc = ((height - screenHeight) * 100) / height;
    return {
      width: width / 100 * (100 - deltaPerc),
      height: screenHeight,
    };
  } else {
    const deltaPerc = ((width - screenWidth) * 100) / width;
    return {
      width: screenWidth,
      height: height / 100 * (100 - deltaPerc),
    };
  }
}

export function getResizedImage(uri, target: {height, width}) {
  return new Promise((resolve, reject) => {
    Image.getSize(uri, (width, height) => {
      const resized = getSizeInContainer({width: target.width, height: target.height}, width, height);
      console.log(resized);
      ImageResizer.createResizedImage(uri, resized.width, resized.height, 'PNG', 100)
        .then((resizedImageUri) => resolve({
          image: resizedImageUri,
          size: resized
        }))
        .catch(e => reject(e))
    }, e => reject(e));
  });
}