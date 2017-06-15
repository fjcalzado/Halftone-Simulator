import { convertDataToURL } from "../util";

/**
 * LocalFileDownloader Interface export.
 */
export interface LocalFileDownloader {
  readonly downloadContent: (filename: string, content: string, type: string) => void;
  readonly downloadURL: (filename: string, URL: string) => void;
  readonly clean: () => void;
  link: any;
}

/**
 * Factory for creating LocalFileDownloader.
 * @function CreateLocalFileDownloader
 * @return {LocalFileDownloader} {Returns a LocalFileDownloader}
 */
function CreateLocalFileDownloader() {
  const downloader: LocalFileDownloader = {
    link: null,

    downloadContent: (filename: string, content: string, type: string): void => {
      return downloader.downloadURL(filename, convertDataToURL(content, type));
    },

    downloadURL: (filename: string, URL: string): void => {
      downloader.link = document.createElement("a");
      document.body.appendChild(downloader.link);
      downloader.link.setAttribute("id", "fileDownloaderLink");
      downloader.link.setAttribute("download", filename);
      downloader.link.setAttribute("href", URL);
      downloader.link.style["display"] = "none";
      downloader.link.click();

      setTimeout(() => {
        window.URL.revokeObjectURL(URL);
      }, 10);
    },

    clean: () => {
      document.body.removeChild(downloader.link);
      downloader.link = null;
    }
  };
  return downloader;
};

/**
 * Export LocalFileDownloader Singleton object.
 * @return {LocalFileDownloader} {LocalFileDownloader Singleton object}
 */
export const localFileDownloader: LocalFileDownloader = CreateLocalFileDownloader();