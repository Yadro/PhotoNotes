
export default class Note {
  id;
  title;
  content;
  image;
  originalImage;
  createdAt: number;


  constructor(title, content, image) {
    this.title = title;
    this.content = content;
    this.image = image;
  }
}