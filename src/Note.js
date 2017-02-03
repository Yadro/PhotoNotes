
export default class Note {
  id;
  title;
  content;
  image;


  constructor(title, content, image) {
    this.title = title;
    this.content = content;
    this.image = image;
  }
}