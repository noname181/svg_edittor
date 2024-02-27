/*
 * Calculates an SVG shape's real bounding box coords.
 */

const getRealBBox = async (obj) => {

  let tempCanv, ctx, w, h;

  // we need to use a temp canvas to get imagedata
  const getImageData = (dataUrl) => {
    if (tempCanv == null) {
      tempCanv = document.createElement('canvas');
      tempCanv.style.border = '1px solid blue';
      tempCanv.style.position = 'absolute';
      tempCanv.style.top = '-100%';
      tempCanv.style.visibility = 'hidden';
      ctx = tempCanv.getContext('2d');
      document.body.appendChild(tempCanv);
    }

    return new Promise(function(resolve, reject) {
      if (dataUrl == null) return reject();

      var image = new Image();
      image.addEventListener('load', () => {
        w = image.width;
        h = image.height;
        tempCanv.width = w;
        tempCanv.height = h;
        ctx.drawImage(image, 0, 0, w, h);
        var imageData = ctx.getImageData(0, 0, w, h).data.buffer;
        resolve(imageData, false);
      });
      image.src = dataUrl;
    });
  }


  // analyze pixels 1-by-1
  const scanPixels = (imageData) => {
    var data = new Uint32Array(imageData),
      x, y, y1, y2, x1 = w, x2 = 0;

    // y1
    for(y = 0; y < h; y++) {
      for(x = 0; x < w; x++) {
        if (data[y * w + x] & 0xff000000) {
          y1 = y;
          y = h;
          break;
        }
      }
    }

    // y2
    for(y = h - 1; y > y1; y--) {
      for(x = 0; x < w; x++) {
        if (data[y * w + x] & 0xff000000) {
          y2 = y;
          y = 0;
          break;
        }
      }
    }

    // x1
    for(y = y1; y < y2; y++) {
      for(x = 0; x < w; x++) {
        if (x < x1 && data[y * w + x] & 0xff000000) {
          x1 = x;
          break;
        }
      }
    }

    // x2
    for(y = y1; y < y2; y++) {
      for(x = w - 1; x > x1; x--) {
        if (x > x2 && data[y * w + x] & 0xff000000) {
          x2 = x;
          break;
        }
      }
    }

    return {
      x1: x1,
      x2: x2,
      y1: y1,
      y2: y2,
      width: x2 - x1,
      height: y2 - y1
    }
  }

  let data = await getImageData(obj.toDataURL());

  return scanPixels(data);

}

export default getRealBBox
