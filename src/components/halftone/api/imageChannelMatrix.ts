import {Channel, extractImageChannel} from "./imageChannelExtractor";
import {extractImageData} from "./imageDataExtractor";

/**
 * ImageChannelMatrix Interface export.
 * @public
 */
export interface ImageChannelMatrix {
  readonly channel: Channel;
  readonly getMatrix: (url: string, resolution: number) => Promise<number[][]>;
}

/**
 * Factory for creating ImageChannelMatrix.
 * @private
 * @function CreateImageChannelMatrix
 * @param {Channel} {Target Channel type.}
 * @return {ImageChannelMatrix} {Returns an ImageChannelMatrix.}
 */
const CreateImageChannelMatrix = (ch: Channel) => {

  // Create ImageChannelMatrix object to be returned.
  const imgChMatrix: ImageChannelMatrix = {
    channel: ch,
    getMatrix: (url: string, resolution: number): Promise<number[][]> => {
      const promise = new Promise(
        (resolve, reject) => {
          extractImageData(url, resolution)
            .then((imgData) => extractImageChannel(imgData, ch))
            .then((chMatrix) => resolve(chMatrix))
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
export const luminanceMatrix: ImageChannelMatrix = CreateImageChannelMatrix(Channel.Luminance);
export const redMatrix: ImageChannelMatrix = CreateImageChannelMatrix(Channel.Red);
export const greenMatrix: ImageChannelMatrix = CreateImageChannelMatrix(Channel.Green);
export const blueMatrix: ImageChannelMatrix = CreateImageChannelMatrix(Channel.Blue);