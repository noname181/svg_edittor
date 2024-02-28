const reduceImageSize = (canvas, fabric, file) => {
  //Reduce img size
  const blobURL = window.URL.createObjectURL(file);

  const mimeType = file.type;
  const mimeName = file.name;
  const mimeSize = file.size;
  const quality = mimeSize > 1000000 ? 0.1 : 0.5;

  const _canvas = document.createElement("canvas");
  const context = _canvas.getContext('2d');
  const _img = new Image();


  _img.onload = function () {
    _canvas.width = _img.width;
    _canvas.height = _img.height;
    context.drawImage(_img, 0, 0);
    _canvas.toBlob(function (blob) {
      // Handle the compressed image
      if (blob !== null) {
        var _file = new File([blob], mimeName, { lastModified: Date.now(), type: mimeType });
        let reader = new FileReader()
        reader.onload = (f) => {
          fabric.Image.fromURL(f.target.result, (img) => {
            img.set({ left: canvas.width - 200, top: 0 })
            img.scaleToHeight(200)
            img.scaleToWidth(200)
            canvas.add(img)
            canvas.setActiveObject(img)
            canvas.trigger('object:modified')
          })
        }
        reader.readAsDataURL(_file)
      }
    }, mimeType, quality);
  }

  _img.src = blobURL;
}


export default reduceImageSize;
