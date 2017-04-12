/**
 * Calculate the new size for an image to fulfill a certain resolution.
 * @private
 * @function adjustSizeFromResolution
 * @param  {Object} originalSize: {x: number, y: number} {Object containing original size.}
 * @param  {number} res: number {Target resolution in number of pixels.}
 * @return {Object} {Object containing the adjusted size.}
 */
function adjustSizeFromResolution(originalSize: {x: number, y: number}, res: number) {
  if (res >= (originalSize.x * originalSize.y)) {
    return originalSize;
  } else {
    const ar = originalSize.x / originalSize.y;
    const adjustedX = Math.sqrt(ar * res);
    const adjustedY = adjustedX / ar;
    return {
      x: Math.round(adjustedX),
      y: Math.round(adjustedY),
    };
  }
}

/**
 * Function to extract image data (pixel data) for a given image url and
 * a target resolution. It resamples image automatically. URL must be in 
 * the same domain, pay attention to CORS issues.
 * @public
 * @function extractImageData
 * @param  {string} url: string {Image URL. Same domain.}
 * @param  {number} res: number {Target resolution in number of pixels. Resampling done automatically.}
 * @return {ImageData} {Image Data (pixels) extracted from image URL.}
 */
export function extractImageData(url: string, res: number): Promise < ImageData > {
  return new Promise < ImageData > (
    (resolve, reject) => {
      try {
        // New img HTML object to load image.
        const img = new Image();
        img.crossOrigin = "Anonymous";

        // Once image is load, use in-memory canvas to extract pixels and resolve.
        img.onload = () => {
          const canvas = document.createElement("canvas");

          const originalSize = {
            x: img.naturalWidth,
            y: img.naturalHeight,
          };
          const adjustedSize = adjustSizeFromResolution(originalSize, res);
          canvas.width = adjustedSize.x;
          canvas.height = adjustedSize.y;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, adjustedSize.x, adjustedSize.y);
          resolve(ctx.getImageData(0, 0, adjustedSize.x, adjustedSize.y));
        };

        // Let img object load the url.
        img.src = url;
      } catch (e) {
        reject(e.message);
      }
    });
}
