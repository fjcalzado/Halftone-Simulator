// FIX TO TS2339 *************************************
// https://github.com/Microsoft/TypeScript/issues/299#issuecomment-168538829
interface FileReaderEventTarget extends EventTarget {
    result: string;
}

interface FileReaderEvent extends Event {
    target: FileReaderEventTarget;
    getMessage(): string;
}
// ***************************************************


/**
 * LocalFileReader Interface export.
 */
export interface LocalFileReader {
  readonly getLocalFileAsURL: (file: File) => Promise<string>;
  readonly getLocalFileAsText: (file: File) => Promise<string>;
  readonly getLocalFileAsBinary: (file: File) => Promise<string>;
}

/**
 * Factory for creating LocalFileReader.
 * @function CreateLocalFileReader
 * @return {LocalFileReader} {Returns a LocalFileReader}
 */
function CreateLocalFileReader() {

  const getLocalFile = (file: File, readCallback: (reader: FileReader) => void): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = (event: FileReaderEvent) => resolve(event.target.result);
        readCallback(reader);
      } catch (error) {
        reject(error);
      }
    });
  };

  return {

    getLocalFileAsURL: (file: File): Promise<string> => {
      return getLocalFile(file, (reader) => reader.readAsDataURL(file));
    },
    getLocalFileAsText: (file: File): Promise<string> => {
      return getLocalFile(file, (reader) => reader.readAsText(file));
    },
    getLocalFileAsBinary: (file: File): Promise<string> => {
      return getLocalFile(file, (reader) => reader.readAsBinaryString(file));
    },
  };
}

/**
 * Export LocalFileReader Singleton object.
 * @return {LocalFileReader} {LocalFileReader Singleton object}
 */
export const localFileReader: LocalFileReader = CreateLocalFileReader();
