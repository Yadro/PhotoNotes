import {
  Image,
  Dimensions,
  Linking,
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

export function dimensionsToPixel(width, height) {
  const dimensions = Dimensions.get("window");
  return {
    width: width * dimensions.scale,
    height: height * dimensions.scale,
  }
}

export function pixelToDimensions({width, height}) {
  const dimensions = Dimensions.get("window");
  return {
    width: width / dimensions.scale,
    height: height / dimensions.scale,
  }
}

export function getSizePexel() {
  const dimensions = Dimensions.get("window");
  return {
    width: dimensions.width * dimensions.scale,
    height: dimensions.height * dimensions.scale,
  }
}

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

export function range(from, to) {
  const arr = [];
  for (let i = from; i < to; i++) {
    arr.push(i);
  }
  return arr;
}

export function getMaxId(arr: {id}[]) {
  let max = 0;
  arr.forEach(e => {
    max = Math.max(e.id, max)
  });
  return max;
}

export function sendEmail(url) {
  Linking.canOpenURL(url).then(supported => {
    if (!supported) {
      console.log('Can\'t handle url: ' + url);
    } else {
      return Linking.openURL(url);
    }
  }).catch(err => console.error('An error occurred', err));
}