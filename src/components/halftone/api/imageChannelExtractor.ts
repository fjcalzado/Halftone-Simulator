import chroma from "chroma-js";

/**
 * Channel Enum.
 * @public
 */
export enum Channel {
    RGB = 1,
    HSL,
    Red,
    Green,
    Blue,
    Luminance,
    Hue,
    Saturation,
    Lightness,
}

/**
 * Get value of a pixel's channel given its RGB components.
 * @private
 * @function getChannelValue
 * @param  {number} r: number   {R component.}
 * @param  {number} g: number   {G component.}
 * @param  {number} b: number   {B component.}
 * @param  {Channel} ch: Channel {Target channel type.}
 * @return {number} {Normalized channel value [0..1].}
 */
export function getChannelValue(r: number, g: number, b: number, ch: Channel): number {
  switch (ch) {
    case Channel.RGB:         return chroma(r, g, b).rgb();
    case Channel.HSL:         return chroma(r, g, b).hsl();
    case Channel.Red:         return r;
    case Channel.Green:       return g;
    case Channel.Blue:        return b;
    case Channel.Luminance:   return chroma(r, g, b).luminance();
    case Channel.Hue:         return chroma(r, g, b).hsl()[0];
    case Channel.Saturation:  return chroma(r, g, b).hsl()[1];
    case Channel.Lightness:   return chroma(r, g, b).hsl()[2];
    default:                  return chroma(r, g, b).rgb();
  }
}

/**
 * Function to extract specific channel information in 2D array format
 * for a given image data (pixel data).
 * @public
 * @function extractImageChannel
 * @param  {ImageData} imgData: ImageData {Image Data containing pixel values and size.}
 * @param  {type} ch: Channel {Target channel type.}
 * @return {number[][]} {Channel matrix in 2D array format.}
 */
export function extractImageChannel(imgData: ImageData, ch: Channel): Promise<number[][]> {
  return new Promise<number[][]> (
    (resolve, reject) => {
      try {
        const chMatrix: number[][] = [];
        const px = imgData.data;
        for (let i = 0; i < px.length; i += 4) {
          // Calculate Matrix coordinates.
          // Initialize matrix with a new empty row when needed.
          // Finally, populate matrix with ch value.
          const pxIndex = Math.trunc(i / 4);
          const rowIndex = Math.trunc(pxIndex / imgData.width);
          const colIndex = pxIndex % imgData.width;
          if (colIndex === 0) {
            chMatrix.push([]);
          }
          chMatrix[rowIndex][colIndex] = getChannelValue(px[i], px[i + 1], px[i + 2], ch);
        }
        resolve(chMatrix);
      } catch (e) {
        reject(e.message);
      }
  });
}
