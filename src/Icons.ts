const nativeImageSource = require('nativeImageSource');

interface Icons {
  'addPhotoBlack';
  'addPhotoWhite';
  'addToPhotosBlack';
  'addToPhotosWhite';
  'arrowBlack';
  'arrowWhite';
  'attachBlack';
  'attachWhite';
  'checkBlack';
  'checkWhite';
  'closeBlack';
  'closeWhite';
  'cropBlack';
  'cropWhite';
  'deleteIconBlack';
  'deleteIconWhite';
  'editBlack';
  'editWhite';
  'moreBlack';
  'moreWhite';
  'undoBlack';
  'undoWhite';
  'sortBlack';
  'sortWhite';
  'shareBlack';
  'shareWhite';
  'searchBlack';
  'searchWhite';
  'redoBlack';
  'redoWhite';
  'cameraBlack';
  'cameraWhite';
  'photoBlack';
  'photoWhite';

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
}

const postfix = '_24dp';
const colorsPostfix = {
  'Black': '_black',
  'White': '_white',
};

const iconSource = {
  'addPhoto': 'ic_add_a_photo',
  'addToPhotos': 'ic_add_to_photos',
  'arrow': 'ic_arrow_back',
  'attach': 'ic_attach_file',
  'check': 'ic_check',
  'close': 'ic_close',
  'crop': 'ic_crop',
  'deleteIcon': 'ic_delete',
  'edit': 'ic_mode_edit',
  'more': 'ic_more_vert',
  'undo': 'ic_undo',
  'sort': 'ic_sort',
  'share': 'ic_share',
  'search': 'ic_search',
  'redo': 'ic_redo',
  'camera': 'ic_photo_camera',
  'photo': 'ic_photo',

  // editor
  'bold': 'ic_format_bold',
  'italic': 'ic_format_italic',
  'under': 'ic_format_underlined',
  'listBullet': 'ic_format_list_bulleted',
  'title': 'ic_title',
};

const icons = {};
for (let color in colorsPostfix) {
  for (let name in iconSource) {
    icons[name + color] = nativeImageSource({
      android: iconSource[name] + colorsPostfix[color] + postfix,
      width: 24,
      height: 24
    });
  }
}

export default <Icons>icons;