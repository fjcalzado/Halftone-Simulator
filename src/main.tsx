import * as React from "react";
import * as ReactDOM from "react-dom";
import {HalftoneComponent} from "./components/halftone/halftone";
import {SliderComponent} from "./components/slider/slider";

const img = [[0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
             [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
             [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
             [0.5, 0.5, 0.5, 0.5, 0.5, 0.5] ];

ReactDOM.render(
  <div>
    <p>This is React component injecting HTML</p>
    <SliderComponent initialValue={43}
                     range={{min: 0,
                             max: 100,
                             step: 0.01}}
                      onValueChanged={() => true}
    />
    <HalftoneComponent image={img}
                       width={"800px"}
                       height={"400px"}
    />
  </div>
  , document.getElementsByClassName("app-container")[0]);
