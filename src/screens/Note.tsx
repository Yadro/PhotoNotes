
export default class Note {
  id: number;
  title: string;
  content: string;
  image;
  originalImage;
  createdAt: number;
  updatedAt: number;

  images = {
    originPath: null,
    originUri: null,
    thumbnail: {},
  };
  fileName = null;
  saved = false;


  constructor(title = '', content = '', image = '', images?) {
    this.title = title;
    this.content = content;
    this.image = image;
    if (images) {
      this.images = images;
    }
  }

  static createInstanse(data) {
    const note = new Note(data.title, data.content, data.image, data.images);
    note.id = data.id;
    note.createdAt = data.createdAt;
    note.updatedAt = data.updatedAt;
    data.originalImage = data.originalImage;
    note.fileName = data.fileName;
    note.saved = data.saved;
    return note;
  }
}