import * as React from "react";
import * as ReactDOM from "react-dom";
import {HalftoneComponent} from "./features/halftone";

ReactDOM.render(
  <div>
    {/*<p>This is React component injecting HTML</p>
    <SliderComponent initialValue={43}
                     range={{min: 0,
                             max: 100,
                             step: 0.01}}
                     onValueChanged={(value: number) => true}
    />*/}
    <HalftoneComponent imageUrl={"../res/img/lu.jpg"}                       resolution={10000}
                       width={"90vw"}
                       height={"75vh"}
    />    
  </div>
  , document.getElementsByClassName("app-container")[0]);

