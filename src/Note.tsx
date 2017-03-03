
export default class Note {
  id: number;
  title: string;
  content: string;
  image;
  originalImage;
  createdAt: number;
  updatedAt: number;


  constructor(title?, content?, image?) {
    this.title = title;
    this.content = content;
    this.image = image;
  }
}