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
                     //onValueChanged={onSliderValueChanged}
    />
    <HalftoneComponent image={img}
                       width={"80vw"}
                       height={"60vh"}
    />
  </div>
  , document.getElementsByClassName("app-container")[0]);


import {urlFetcher} from "./api/urlFetcher";
// const url = "../img/test.jpg";
const url = "https://viralsweep.com/blog/wp-content/uploads/2015/02/unsplash.jpg";
urlFetcher.getLocalUrl(url)
  .then((urlLocal) => {
    const imgElement = document.createElement("IMG");
    imgElement.setAttribute("crossOrigin", "Anonymous");
    imgElement.setAttribute("src", urlLocal);
    document.getElementsByClassName("app-container")[0].appendChild(imgElement);
  })
  .catch((error) => {
    let p = document.createElement("P");
    p.innerHTML = "ERROOOOOOOR";
    document.getElementsByClassName("app-container")[0].appendChild(p);
});
