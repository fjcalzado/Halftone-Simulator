/**
* URLFetcher Interface export.
*/
export enum FetcherMode{
  Object = 1,
  Image
}

export interface URLFetcher {
  getLocalUrl: (url: string) => Promise<string>;
}

/**
* Factory for creating URLFetcher.
* @function CreateURLFetcher
* @return {URLFetcher} {Returns an URLFetcher}
*/
const CreateURLFetcher = () => {
  return {
    getLocalUrl: (url: string): Promise<string> => {      
      
      const checkStatus = (response: Response): Promise<Response> => {
        if (response.ok) {
          return Promise.resolve(response);
        } else {
          let error = new Error(response.statusText);
          throw error;
        }
      }

      const extractBlob = (response: Response): Promise<Blob> => {
        return response.blob();
      }

      const extractLocalUrl = (blob: Blob): Promise<string> => {
        let localUrl = URL.createObjectURL(blob);
        return Promise.resolve(localUrl);
      }
      
      // const requestOptions = {
      //   method: "GET",
      //   headers: new Headers(),
      //   mode: "no-cors",
      //   credentials: "include"
      // }

      return fetch(url/*, requestOptions*/)
        .then((response) => checkStatus(response))
        .then((response) => extractBlob(response))
        .then((blob) => extractLocalUrl(blob));
    }
  };
}

/**
* Export URLFetcher Singleton object.
* @return {URLFetcher} {URLFetcher Singleton object}
*/
export const urlFetcher: URLFetcher = CreateURLFetcher();