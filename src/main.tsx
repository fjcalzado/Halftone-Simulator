import * as React from "react";
import * as ReactDOM from "react-dom";
import {SliderComponent} from "./components/slider";

ReactDOM.render(
  <div>
  <p>This is React component injecting HTML</p>
  <SliderComponent initialValue={43}
                   range={{min: 0,
                           max: 100,
                           step: 0.01}}
                   onValueChanged={() => true}
  />
  </div>
  , document.getElementsByClassName("app-container")[0]);
