
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
