export default {
  picture: "picture",
  text: "text",
  typeMap() {
    return {
      jpg: this.picture,
      png: this.picture,
      jpeg: this.picture,
      bmp: this.picture,
      svg: this.picture,
      webp: this.picture,
      ico: this.picture,
      gif: this.picture,
      txt: this.text
    };
  }
};
