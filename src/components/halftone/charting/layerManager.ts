import * as d3 from "d3";

import {CreateTimer, logDebug} from "../../../api-utils";
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
  gridParams: grd.GridParameters;
  dotParams: dot.DotParameters;
}

export type LayerStack = LayerParameters[];

/**
 * Helper functions.
 * @private
 */

function sortLayerStackByZIndex(layers: LayerStack): LayerStack {
  return layers.sort((a, b) => a.zIndex - b.zIndex);
}

export function draw(masterNode, sourceImage: any[][], layers: LayerStack): Promise<boolean> {
  return new Promise<boolean>(
    (resolve, reject) => {
      try {
        // Initialize image-level processors.
        const rgbFiller = img.CreateImageInterpolator(sourceImage, img.Bilinear);

        // Sort layers by its zIndex.
        const sortedLayers = sortLayerStackByZIndex(layers);

        // Re-Join data with layer DOM nodes and re-sort them.
        const layerSelection = masterNode.selectAll("g[class^='layer']")
            .data(sortedLayers, (d) => d.name)
            .order();

        // Remove exit selection.
        layerSelection.exit().remove();

        // Append enter selection and prepare update.
        const updateLayerSelection = layerSelection.enter().append("g")
            .attr("class", (d) => `layer-${d.name}`)
            .attr("opacity", (d) => d.opacity);

        // Update each layer.
        // DO NOT replace 'function' for 'arrow function' as we need the proper
        // scope for 'this'.
        updateLayerSelection.each(function(layerDatum) {
          // Create dotTopology and gridTopology from layer data (datum) in
          // order to generate the dot grid for the layer.
          const dotTopology = dot.CreateDotTopology(layerDatum.dotParams);
          grd.CreateGridTopology(layerDatum.gridParams, rgbFiller)
          .then((gridTopology) => {
            // Once created the topologies, lets draw the dot grid.
            // For that purpose, we have to reselect the current layer to update.
            // 'each' method provides us with 'this' already pointed to the
            // right node, so just select 'this'.
            const timer = CreateTimer();
            d3.select(this).selectAll("path")
                .data(gridTopology)
              .enter().append("path")
                  .attr("d", dotTopology.dotShape)
                  .attr("transform", dotTopology.dotTransform)
                  .attr("fill", dotTopology.dotFill);
            timer.logElapsed(`[Add Layer To DOM] ${layerDatum.name}`);
          })
          .catch((error) => {
            console.error(`[ERROR] Adding Layer ${layerDatum.name}: ${error.message}`);
            throw error;  // Let error bubbles up.
          });
        });
        resolve(true);
      } catch (error) {
        reject(error);
      }
  });
}

export function reportLayerDOMStatus(masterNode) {
  if (masterNode) {
    masterNode.selectAll("g[class^='layer']").each(function(layerDatum) {
      const size = d3.select(this).selectAll("path").size();
      logDebug(`[DOM Status] ${layerDatum.name}: ${size} nodes.`);
    });
  }
}












// *************************** EXPERIMENTAL ************************************


/*
// Layer Cache.
let layers: LayerStack = [];

// Master Node where layers will be appended.
let masterNode = null;



function selectLayerInDOM(name: string) {
  return masterNode.select(`.layer-${name}`);
}

function selectLayerInCache(name: string) {
  return layers.find((layerParam) => layerParam.name === name);
}

function layerExistsInDOM(name: string): boolean {
  return !selectLayerInDOM(name).empty();
}

function layerExistsInCache(name: string): boolean {
  return selectLayerInCache(name) !== undefined;
}

function sortLayerCache() {
  layers.sort((a, b) => a.zIndex - b.zIndex);
}

export function setMasterNode(node) {
  masterNode = node;
}

export function addLayer(layerParams: LayerParameters): boolean {
  if (!layerExistsInCache(layerParams.name)) {
    layers.push(layerParams);
    sortLayerCache();
    return true;
  } else {
    return false;
  }
}

export function removeLayer(name: string) {
  if (layerExistsInCache(name)) {
    layers = layers.filter((layerParams) => layerParams.name !== name);
    return true;
  } else {
    return false;
  }
}

function updateLayerAttribute(name: string, modifyAttribute: (selection) => void): boolean {
  if (layerExistsInCache(name) && layerExistsInDOM(name)) {
    modifyAttribute( selectLayerInDOM(name) );
    return true;
  } else {
    return false;
  }
}

export function updateLayerName(name: string, newName: string) {
  return updateLayerAttribute(name, (selection) => {
    selection.attr("class", `layer-${newName}`);
  });
}

export function updateLayerOpacity(name: string, newOpacity: number) {
  return updateLayerAttribute(name, (selection) => {
    selection.attr("opacity", newOpacity);
  });
}
*/

// export function addLayer(masterNode, layerParams: LayerParameters): Promise<boolean> {
//   return new Promise<boolean>(
//     (resolve, reject) => {
//       if (layerExists(masterNode, layerParams.name)) {
//         resolve(false);
//       } else {
//         try {
//           const dotTopology = dot.CreateDotTopology(layerParams.dotParams);
//           const rgbFiller = img.CreateImageInterpolator(layerParams.sourceImage, img.Bilinear);

//           grd.CreateGridTopology(layerParams.gridParams, rgbFiller)
//             .then((gridTopology) => {
//               timer.reset();
//               masterNode.append("g")
//                   .attr("class", `layer-${layerParams.name}`)
//                   .attr("opacity", layerParams.opacity)
//                 .selectAll("path")
//                   .data(gridTopology)
//                 .enter().append("path")
//                     .attr("d", dotTopology.dotShape)
//                     .attr("transform", dotTopology.dotTransform)
//                     .attr("fill", dotTopology.dotFill);
//               timer.logElapsed("[Add Layer To DOM]");
//               resolve(true);
//             })
//             .catch((error) => {
//               console.error(`[ERROR] Adding Layer: ${error.message}`);
//               throw error;  // Let error bubbles up.
//             });
//         } catch (error) {
//           reject(error);
//         }
//       }
//   });
// }

// export function removeLayer(masterNode, name: string): Promise<boolean> {
//   return new Promise<boolean>(
//     (resolve, reject) => {
//       if (layerExists(masterNode, name)) {
//         try {
//           timer.reset();
//           selectDOMLayer(masterNode, name).remove();
//           timer.logElapsed("[Remove Layer From DOM]");
//         } catch (error) {
//           reject(error);
//         }
//       } else {
//         resolve(false);
//       }
//   });
// }