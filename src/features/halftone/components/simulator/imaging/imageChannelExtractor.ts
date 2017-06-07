import chroma from "chroma-js";
import * as d3 from "d3";

import { Channel } from "../../../../../models/channelModel";

/**
 * Helper function to convert from RGB to CMYK color space.
 * @private
 * @function RGBToCMYK
 * @param  {number} r: number {Input R channel.}
 * @param  {number} g: number {Input G channel.}
 * @param  {number} b: number {Input B channel.}
 * @return {number[]} {Output color in CMYK space.}
 */
function RGBToCMYK(r: number, g: number, b: number): number[] {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const k = Math.min( 1 - rn, 1 - gn, 1 - bn );
  if (k === 1) { return [0, 0, 0, 100]; }
  const c = ( 1 - rn - k ) / ( 1 - k );
  const m = ( 1 - gn - k ) / ( 1 - k );
  const y = ( 1 - bn - k ) / ( 1 - k );

  return [ Math.round( c * 100 ),
           Math.round( m * 100 ),
           Math.round( y * 100 ),
           Math.round( k * 100 ) ];
}

/**
 * Helper function to extract every object attribute value into an array.
 * @private
 * @function extractAttributeArray
 * @param  {type} obj {Input object}
 * @return {type} {Output Array}
 */
const extractAttributeArray = (obj) => Object.keys(obj).map((key) => obj[key]);

/**
 * Get a function to extract the value of a pixel's channel given its RGB components.
 * @private
 * @function CreateChFromRGBCalculator
 * @param  {Channel} ch: Channel {Target channel type.}
 * @return {function} {Channel value.}
 */
export function CreateChExtractorForRGB(ch: Channel) {
  return (r: number, g: number, b: number): any => {
    switch (ch) {
      case Channel.RGB:         return [r, g, b];
      case Channel.Red:         return r;
      case Channel.Green:       return g;
      case Channel.Blue:        return b;
      case Channel.HSL:         return extractAttributeArray(d3.hsl(d3.rgb(r, g, b)));
      case Channel.Hue:         return d3.hsl(d3.rgb(r, g, b)).h;
      case Channel.Saturation:  return d3.hsl(d3.rgb(r, g, b)).s;
      case Channel.Lightness:   return d3.hsl(d3.rgb(r, g, b)).l;
      case Channel.CMYK:        return RGBToCMYK(r, g, b);
      case Channel.Cyan:        return RGBToCMYK(r, g, b)[0];
      case Channel.Magenta:     return RGBToCMYK(r, g, b)[1];
      case Channel.Yellow:      return RGBToCMYK(r, g, b)[2];
      case Channel.Black:       return RGBToCMYK(r, g, b)[3];
      default:                  return [r, g, b];
    }
  };
}

/**
 * Function to extract specific channel information in 2D array format
 * for a given image data (pixel data).
 * @public
 * @function extractImageChannel
 * @param  {ImageData} imgData: ImageData {Image Data containing pixel values and size.}
 * @param  {type} ch: Channel {Target channel type.}
 * @return {any[][]} {Channel matrix in 2D array format.}
 */
export function extractImageChannel(imgData: ImageData, ch: Channel): Promise<any[][]> {
  return new Promise<any[][]> (
    (resolve, reject) => {
      try {
        const chExtractor = CreateChExtractorForRGB(ch);
        const chMatrix: any[][] = [];
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
          chMatrix[rowIndex][colIndex] = chExtractor(px[i], px[i + 1], px[i + 2]);
        }
        resolve(chMatrix);
      } catch (e) {
        reject(e.message);
      }
  });
}
