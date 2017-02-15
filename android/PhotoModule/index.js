import { PropTypes } from 'react';
import { requireNativeComponent, View, NativeModules } from 'react-native';

var iface = {
  name: 'PhotoView',
  propTypes: {
    src: PropTypes.string,
    value: PropTypes.number,
    borderRadius: PropTypes.number,
    resizeMode: PropTypes.oneOf(['cover', 'contain', 'stretch']),
    ...View.propTypes // include the default view properties
  },
};

module.exports = {
  PhotoView: requireNativeComponent('RCTPhotoView', iface),
  Threshold: NativeModules.Threshold,
  readThresholdSave: NativeModules.Threshold.readThresholdSave,
}
