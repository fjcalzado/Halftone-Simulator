/**
 * URLFetcher Interface export.
 */
export interface URLFetcher {
  readonly getLocalUrl: (url: string) => Promise<string>;
}

/**
 * Factory for creating URLFetcher.
 * @function CreateURLFetcher
 * @return {URLFetcher} {Returns an URLFetcher}
 */
function CreateURLFetcher() {
  return {
    getLocalUrl: (url: string): Promise<string> => {
      const checkStatus = (response: Response): Promise<Response> => {
        if (response.ok) {
          return Promise.resolve(response);
        } else {
          const error = new Error(response.statusText);
          throw error;
        }
      };

      const extractBlob = (response: Response): Promise<Blob> => {
        return response.blob();
      };

      const extractLocalUrl = (blob: Blob): Promise<string> => {
        const localUrl = URL.createObjectURL(blob);
        return Promise.resolve(localUrl);
      };

      return fetch(url)
        .then((response) => checkStatus(response))
        .then((response) => extractBlob(response))
        .then((blob) => extractLocalUrl(blob));
    },
  };
};

/**
 * Export URLFetcher Singleton object.
 * @return {URLFetcher} {URLFetcher Singleton object}
 */
export const urlFetcher: URLFetcher = CreateURLFetcher();
