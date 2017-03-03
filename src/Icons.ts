const nativeImageSource = require('nativeImageSource');

interface Icons {
  'addPhoto';
  'addToPhotos';
  'arrow';
  'attach';
  'check';
  'close';
  'crop';
  'delete';
  'edit';
  'more';
  'undo';
  'sort';
  'share';
  'search';
  'redo';
  'camera';
  'photo';
}

const iconSource = {
  'addPhoto': 'ic_add_a_photo_black_24dp',
  'addToPhotos': 'ic_add_to_photos_black_24dp',
  'arrow': 'ic_arrow_back_black_24dp',
  'attach': 'ic_attach_file_black_24dp',
  'check': 'ic_check_black_24dp',
  'close': 'ic_close_black_24dp',
  'crop': 'ic_crop_black_24dp',
  'delete': 'ic_delete_black_24dp',
  'edit': 'ic_mode_edit_black_24dp',
  'more': 'ic_more_vert_black_24dp',
  'undo': 'ic_undo_black_24dp',
  'sort': 'ic_sort_black_24dp',
  'share': 'ic_share_black_24dp',
  'search': 'ic_search_black_24dp',
  'redo': 'ic_redo_black_24dp',
  'camera': 'ic_photo_camera_black_24dp',
  'photo': 'ic_photo_black_24dp',
};

const icons = {};
for (let name in iconSource) {
  icons[name] = nativeImageSource({
    android: iconSource[name],
    width: 24,
    height: 24
  });
}

export default <Icons>icons;