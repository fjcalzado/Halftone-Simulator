/**
 * Convert any serialized data to a data URL.
 * @public
 * @function convertDataToURL
 * @param  {string} data: string {Input serialized data.}
 * @param  {string} type: string {Type of the URL to convert data to.}
 * @return {string} {Output data URL.}
 */
export function convertDataToURL(data: string, type: string ): string {
  return window.URL.createObjectURL(new Blob([data], { "type" : type }));
};

/**
 * Convert URL to PNG image.
 * @public
 * @function convertURLToPNG
 * @param  {string} URL: string    {Input URL to be converted into a PNG.}
 * @param  {number} width: number  {Target width of the resulting PNG image.}
 * @param  {number} height: number {Target height of the resulting PNG image.}
 * @return {Promise} {Return a promise that resolves as a PNG Url.}
 */
export function convertURLToPNG(URL: string, width: number, height: number): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");        
        context.drawImage(img, 0, 0);
        const pngURL = canvas.toDataURL("image/png");
        resolve(pngURL);
      };
      img.onerror = () => {
        reject(new Error("Error while converting URL to PNG Image"));
      };
      img.src = URL;
    } catch (error) {
      reject(error);
    }
  });
};
