
export default class Note {
  id: number;
  title: string;
  content: string;
  image;
  originalImage;
  createdAt: number;
  updatedAt: number;
  images: {
    originPath: string;
    originUri: string;
    thumbnail: any;
  };


  constructor(title = '', content = '', image = '', images?) {
    this.title = title;
    this.content = content;
    this.image = image;
    this.images = {
      originPath: null,
      originUri: null,
      thumbnail: {},
    };
  }
}