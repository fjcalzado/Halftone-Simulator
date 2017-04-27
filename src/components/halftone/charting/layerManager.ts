import * as d3 from "d3";

import * as timer from "../../../api";
import * as img from "../imaging";
import * as dot from "./dotTopology";
import * as grd from "./gridTopology";


/**
 * Interface Export.
 * @public
 */

export interface LayerParameters {
  name: string;
  opacity: number;
  zIndex: number;
  sourceImage: any[][];
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
          const rgbFiller = img.CreateImageInterpolator(layerParams.sourceImage, img.Bilinear);

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
              timer.logElapsed("[Add Layer To DOM]");
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

export function removeLayer(masterNode, name: string): Promise<boolean> {
  return new Promise<boolean>(
    (resolve, reject) => {
      if (layerExists(masterNode, name)) {
        try {
          timer.reset();
          selectLayer(masterNode, name).remove();
          timer.logElapsed("[Remove Layer From DOM]");
        } catch (error) {
          reject(error);
        }
      } else {
        resolve(false);
      }
  });
}

function updateLayerAttribute(masterNode, name: string,
                              modifyAttribute: (selection) => void): boolean {
  if (layerExists(masterNode, name)) {
    modifyAttribute( selectLayer(masterNode, name) );
    return true;
  } else {
    return false;
  }
}

export function updateLayerName(masterNode, name: string, newName: string) {
  return updateLayerAttribute(masterNode, name, (selection) => {
    selection.attr("class", `layer-${newName}`);
  });
}

export function updateLayerOpacity(masterNode, name: string, newOpacity: number) {
  return updateLayerAttribute(masterNode, name, (selection) => {
    selection.attr("opacity", newOpacity);
  });
}
