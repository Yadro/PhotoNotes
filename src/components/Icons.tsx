const nativeImageSource = require('nativeImageSource');
import * as React from 'react';
import {Image} from 'react-native';

interface Icons {
  addBlack;
  addWhite;
  addPhotoBlack;
  addPhotoWhite;
  addToPhotosBlack;
  addToPhotosWhite;
  arrowBlack;
  arrowWhite;
  menuBlack;
  menuWhite;
  attachBlack;
  attachWhite;
  checkBlack;
  checkWhite;
  closeBlack;
  closeWhite;
  cropBlack;
  cropWhite;
  deleteIconBlack;
  deleteIconWhite;
  editBlack;
  editWhite;
  moreBlack;
  moreWhite;
  undoBlack;
  undoWhite;
  sortBlack;
  sortWhite;
  shareBlack;
  shareWhite;
  searchBlack;
  searchWhite;
  redoBlack;
  redoWhite;
  cameraBlack;
  cameraWhite;
  photoBlack;
  photoWhite;
  settingsBlack;
  settingsWhite;
  libraryBooksWhite;
  libraryBooksBlack;

  boldBlack;
  boldWhite;
  italicBlack;
  italicWhite;
  underBlack;
  underWhite;
  listBulletBlack;
  listBulletWhite;
  titleBlack;
  titleWhite;
  pastBlack;
  pastWhite;
  copyBlack;
  copyWhite;
  timeWhite;
  timeBlack;

  labelWhite;
  labelBlack;
  labelOutlineWhite;
  labelOutlineBlack;
  checkboxWhite;
  checkboxBlack;
  checkboxBlankWhite;
  checkboxBlankBlack;
}

const postfix = '_24dp';
const colorsPostfix = {
  'Black': '_black',
  'White': '_white',
};

const iconSource = {
  add: 'ic_add',
  addPhoto: 'ic_add_a_photo',
  addToPhotos: 'ic_add_to_photos',
  arrow: 'ic_arrow_back',
  attach: 'ic_attach_file',
  check: 'ic_check',
  close: 'ic_close',
  crop: 'ic_crop',
  deleteIcon: 'ic_delete',
  edit: 'ic_mode_edit',
  more: 'ic_more_vert',
  undo: 'ic_undo',
  sort: 'ic_sort',
  share: 'ic_share',
  search: 'ic_search',
  redo: 'ic_redo',
  camera: 'ic_photo_camera',
  photo: 'ic_photo',
  settings: 'ic_settings',

  // editor
  bold: 'ic_format_bold',
  italic: 'ic_format_italic',
  under: 'ic_format_underlined',
  listBullet: 'ic_format_list_bulleted',
  title: 'ic_title',
  copy: 'ic_content_copy',
  past: 'ic_content_paste',
  time: 'ic_access_time',

  label: 'ic_label',
  labelOutline: 'ic_label_outline',
  checkbox: 'ic_check_box',
  checkboxBlank: 'ic_check_box_outline_blank',

  menu: 'ic_menu',
  libraryBooks: 'ic_library_books'
};

const icons = {};
const pathsLocal = {};
for (let color in colorsPostfix) {
  for (let name in iconSource) {
    pathsLocal[name + color] = iconSource[name] + colorsPostfix[color] + postfix;
    icons[name + color] = nativeImageSource({
      android: iconSource[name] + colorsPostfix[color] + postfix,
      width: 24,
      height: 24
    });
  }
}

export default icons as Icons;

export const paths = pathsLocal as Icons;

const styleSize = {width: 24, height: 24};
export function Icon(props) {
  const {uri, tint, style} = props;
  if (tint) {
    return <Image style={[styleSize, style]} source={{uri}} tintColor={tint}/>
  }
  return <Image style={[styleSize, style]} source={{uri}}/>
}