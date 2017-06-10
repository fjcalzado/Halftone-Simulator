/**
 * LocalFileDownloader Interface export.
 */
export interface LocalFileDownloader {
  readonly download: (filename: string, content: string, type: string) => void;
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

    download: (filename: string, content: string, type: string): void => {
      const url = window.URL.createObjectURL(new Blob([content], { "type" : type }));
      
      downloader.link = document.createElement("a");
      document.body.appendChild(downloader.link);
      downloader.link.setAttribute("id", "fileDownloaderLink");
      downloader.link.setAttribute("download", filename);
      downloader.link.setAttribute("href", url);
      downloader.link.style["display"] = "none";
      downloader.link.click();

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
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