import * as React from "react";
import * as ReactDOM from "react-dom";
import {HalftoneComponent} from "./components/halftone";
import {SliderComponent} from "./components/slider";

const img = [[1, 1, 0.5, 0.5, 0.5, 1],
             [1, 1, 0.5, 0.5, 0.5, 0.5],
             [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
             [1, 0.5, 0.5, 0.5, 0.5, 1] ];

ReactDOM.render(
  <div>
    <p>This is React component injecting HTML</p>
    <SliderComponent initialValue={43}
                     range={{min: 0,
                             max: 100,
                             step: 0.01}}
                     onValueChanged={(value: number) => true}
    />
    <HalftoneComponent image={img}
                       width={"80vw"}
                       height={"60vh"}
    />    
  </div>
  , document.getElementsByClassName("app-container")[0]);

