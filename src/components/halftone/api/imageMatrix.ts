import {Channel, extractImageChannel} from "./imageChannelExtractor";
import {extractImageData} from "./imageDataExtractor";

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
          extractImageData(url, resolution)
            .then((imgData) => extractImageChannel(imgData, ch))
            .then((imgMatrix) => resolve(imgMatrix))
            .catch(reject);
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
export const hslMatrix: ImageMatrix = CreateImageChannelMatrix(Channel.HSL);
export const redMatrix: ImageMatrix = CreateImageChannelMatrix(Channel.Red);
export const greenMatrix: ImageMatrix = CreateImageChannelMatrix(Channel.Green);
export const blueMatrix: ImageMatrix = CreateImageChannelMatrix(Channel.Blue);
export const luminanceMatrix: ImageMatrix = CreateImageChannelMatrix(Channel.Luminance);
export const lightnessMatrix: ImageMatrix = CreateImageChannelMatrix(Channel.Lightness);