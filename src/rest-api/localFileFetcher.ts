// FIX TO TS2339 *************************************
// https://github.com/Microsoft/TypeScript/issues/299#issuecomment-168538829
interface FileReaderEventTarget extends EventTarget {
    result: string;
}

interface FileReaderEvent extends Event {
    target: FileReaderEventTarget;
    getMessage(): string;
}
// TO BE DELETED *************************************



/**
 * LocalFileFetcher Interface export.
 */
export interface LocalFileFetcher {
  readonly getLocalFileAsURL: (file: File) => Promise<string>;
}

/**
 * Factory for creating LocalFileFetcher.
 * @function CreateLocalFileFetcher
 * @return {LocalFileFetcher} {Returns a LocalFileFetcher}
 */
function CreateLocalFileFetcher() {
  return {
    getLocalFileAsURL: (file: File): Promise<string> => {
      return new Promise<string>((resolve, reject) => {
        try {
          const reader = new FileReader();
          reader.onload = (event: FileReaderEvent) => resolve(event.target.result);
          reader.readAsDataURL(file);
        } catch (error) {
          reject(error);
        }
      });
    },
  };
};

/**
 * Export LocalFileFetcher Singleton object.
 * @return {LocalFileFetcher} {LocalFileFetcher Singleton object}
 */
export const localFileFetcher: LocalFileFetcher = CreateLocalFileFetcher();