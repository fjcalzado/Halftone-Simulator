import * as d3 from "d3";
import * as dot from "./dotTopology";
import * as grd from "./gridTopology";
import * as timer from "../../../api/timerLog";
import * as imgX from "../api/imageInterpolator";

/**
 * Interface Export.
 * @public
 */

export interface LayerParameters {
  name: string;
  opacity: number;
  zIndex: number;
  baseImage: any[][];
  gridParams: grd.GridParameters;
  dotParams: dot.DotParameters;
}

function selectLayer(masterNode, name: string) {
  return masterNode.select(`.layer-${name}`);
}

export function layerExists(masterNode, name: string): boolean {
  return !selectLayer(masterNode, name).empty();
}

export function addLayer(masterNode, layerParams: LayerParameters): Promise<boolean> {
  return new Promise<boolean>(
    (resolve, reject) => {
      if (layerExists(masterNode, layerParams.name)) {
        resolve(false);
      } else {
        try {
          const dotTopology = dot.CreateDotTopology(layerParams.dotParams);
          const rgbFiller = imgX.CreateImageInterpolator(layerParams.baseImage, imgX.Bilinear);

          grd.CreateGridTopology(layerParams.gridParams, rgbFiller)
            .then((gridTopology) => {
              timer.reset();
              masterNode.append("g")
                  .attr("class", `layer-${layerParams.name}`)
                  .attr("opacity", layerParams.opacity)
                .selectAll("path")
                  .data(gridTopology)
                .enter().append("path")
                    .attr("d", dotTopology.dotShape)
                    .attr("transform", dotTopology.dotTransform)
                    .attr("fill", dotTopology.dotFill);
              timer.logElapsed("[DrawGridTopology]");
              resolve(true);
            })
            .catch((error) => {
              console.error(`[ERROR] Adding Layer: ${error.message}`);
              throw error;  // Let error bubbles up.
            });
        } catch (error) {
          reject(error);
        }
      }
  });
}
