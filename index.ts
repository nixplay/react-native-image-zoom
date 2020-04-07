import { Platform } from 'react-native';
import ImageZoomIos from './index.ios';
import ImageZoomAndroid from './index.android';

const ImageZoom = Platform.OS === 'ios'
  ? ImageZoomIos
  : ImageZoomAndroid;

export default ImageZoom;
