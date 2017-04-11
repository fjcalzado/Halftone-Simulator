import * as React from "react";

/**
 * Stateless and Invisible component aimed to convert a given image
 * via URL (images will be fetch using promises) to a 2D matrix of 
 * normalized luminance points (range [0..1]).
 */

interface IProps {
  imageURL: string;
  resolution: number;
  onImageConverted: (pattern: number[][]) => void;
}

export class HalftoneImageConverter extends React.Component < IProps, {} > {

  constructor(props) {
    super(props);
  }
    
  public render() {
    return (
      <div></div>
    );
  }

  private fetchImage(imageURL: string) {
    
  }


}