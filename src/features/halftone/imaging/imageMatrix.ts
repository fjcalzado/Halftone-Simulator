import { Channel } from "../../../models/channelModel";
import { extractImageChannel } from "./imageChannelExtractor";
import { extractImageData } from "./imageDataExtractor";

/**
 * ImageChannelMatrix Interface export.
 * @public
 */
export interface ImageMatrix {
  readonly channel: Channel;
  readonly getMatrix: (url: string, resolution: number) => Promise<any[][]>;
}

/**
 * Factory for creating ImageMatrix.
 * @private
 * @function CreateImageChannelMatrix
 * @param {Channel} {Target Channel type.}
 * @return {ImageChannelMatrix} {Returns an ImageMatrix.}
 */
const CreateImageChannelMatrix = (ch: Channel) => {

  // Create ImageChannelMatrix object to be returned.
  const imgChMatrix: ImageMatrix = {
    channel: ch,
    getMatrix: (url: string, resolution: number): Promise<any[][]> => {
      const promise = new Promise(
        (resolve, reject) => {
          try {
            extractImageData(url, resolution)
            .then((imgData) => extractImageChannel(imgData, ch))
            .then((imgMatrix) => resolve(imgMatrix))
            .catch((error) => {
              console.error(`[ERROR] Extracting Image Data: ${error.message}`);
              throw error; // Let error bubbles up.
            });
          } catch (error) {
            reject(error);
          }
        });
      return promise;
    },
  };

  return imgChMatrix;
};

/**
 * Export specialized ImageChannelMatrix Singleton objects.
 * @public
 * @return {ImageChannelMatrix} {ImageChannelMatrix Singleton object}
 */
export const rgbMatrix: ImageMatrix = CreateImageChannelMatrix(Channel.RGB);

// This is just for future usage, we dont really need all the specializations
// for this example.
// export const redMatrix: ImageMatrix = CreateImageChannelMatrix(Channel.Red);
// export const greenMatrix: ImageMatrix = CreateImageChannelMatrix(Channel.Green);
// export const blueMatrix: ImageMatrix = CreateImageChannelMatrix(Channel.Blue);
// export const hslMatrix: ImageMatrix = CreateImageChannelMatrix(Channel.HSL);
// export const hueMatrix: ImageMatrix = CreateImageChannelMatrix(Channel.Hue);
// export const saturationMatrix: ImageMatrix = CreateImageChannelMatrix(Channel.Saturation);
// export const lightnessMatrix: ImageMatrix = CreateImageChannelMatrix(Channel.Lightness);
// ...
