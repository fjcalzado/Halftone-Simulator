import chroma from "chroma-js";

/**
 * Channel Enum.
 * @public
 */
export enum Channel {
    RGB = 1,
    HSL,
    Red_Normalized,
    Green_Normalized,
    Blue_Normalized,
    Luminance,
    Lightness,
}

/**
 * Get normalized value of a pixel's channel given its RGB components.
 * @private
 * @function getChannelValue
 * @param  {number} r: number   {R component.}
 * @param  {number} g: number   {G component.}
 * @param  {number} b: number   {B component.}
 * @param  {Channel} ch: Channel {Target channel type.}
 * @return {number} {Normalized channel value [0..1].}
 */
function getChannelValue(r: number, g: number, b: number, ch: Channel): number {
  switch (ch) {
    case Channel.RGB:         return chroma(r, g, b).rgb();
    case Channel.HSL:         return chroma(r, g, b).hsl();
    case Channel.Red_Normalized:         return r / 255;
    case Channel.Green_Normalized:       return g / 255;
    case Channel.Blue_Normalized:        return b / 255;
    case Channel.Luminance:   return chroma(r, g, b).luminance();
    case Channel.Lightness:   return chroma(r, g, b).hsl()[2];
    default:                  return 0;
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
