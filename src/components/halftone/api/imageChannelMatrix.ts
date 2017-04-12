import {extractImageData} from "./imageDataExtractor";

/**
 * ImageChannelMatrix Interface export.
 */
export enum Channel {
    Luminance = 1,
    // Only luminance supported so far.
    // To be extended with more channels.
    // Red,
    // Green,
    // Blue,
}

export interface ImageChannelMatrix {
  channel: Channel;
  getMatrix: (url: string, resolution: number) => Promise<number[][]>;
}

/**
 * Factory for creating ImageChannelMatrix.
 * @function CreateImageChannelMatrix
 * @return {ImageChannelMatrix} {Returns an ImageChannelMatrix}
 */
const CreateImageChannelMatrix = (ch: Channel) => {

  // Create ImageChannelMatrix object to be returned.
  const imgChMatrix: ImageChannelMatrix = {
    channel: ch,
    getMatrix: (url: string, resolution: number): Promise<number[][]> => {
      const promise = new Promise(
        (resolve, reject) => {
          extractImageData(url, resolution)
            .then()
            .catch(reject);
        }
      );
      return promise;
    },
  };

  return imgChMatrix;
};

/**
 * Export ImageChannelMatrix Singleton object.
 * @return {ImageChannelMatrix} {ImageChannelMatrix Singleton object}
 */
export const luminanceMatrix: ImageChannelMatrix = CreateImageChannelMatrix(Channel.Luminance);

















export function getBase64FromImageUrl(url) {
    const img = new Image();
    document.getElementsByClassName("app-container")[0].appendChild(img);

    img.crossOrigin = "Anonymous";

    img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        //const dataURL = canvas.toDataURL("image/png");

        //alert(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
    };

    img.src = url;
}
