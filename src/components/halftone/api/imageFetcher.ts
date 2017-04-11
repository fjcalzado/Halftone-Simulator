class ImageFetcher {
  
  public getImage(imageURL: string): Promise<string> {
    return fetch(imageURL)
      .then(this.checkStatus)
      .then(this.extractBlob)
      .then(this.extractLocalUrl);
  }

  private checkStatus(response: Response): Promise<Response> {
    if (response.ok) {
      return Promise.resolve(response);
    } else {
      let error = new Error(response.statusText);
      throw error;
    }
  }

  private extractBlob(response: Response): Promise<Blob> {
    return response.blob();
  }

  private extractLocalUrl(blob: Blob): Promise<string> {
    let localUrl = URL.createObjectURL(blob);
    return Promise.resolve(localUrl);
  }
}

export const imageFetcher = new ImageFetcher();