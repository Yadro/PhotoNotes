
export default class Note {
  id;
  title;
  content;
  image;


  constructor(id, title, content, image) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.image = image;
  }
}