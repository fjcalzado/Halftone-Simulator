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

function cloneLayerParams(layerParams: LayerParameters): LayerParameters {
  return {
    ...layerParams,
    gridParams: {...layerParams.gridParams},
    dotParams: {...layerParams.dotParams},
  };
}

function layerNeedsRedraw(oldLayerParams: LayerParameters, newLayerParams: LayerParameters): boolean {
  if (oldLayerParams && newLayerParams) {
    const modifiedGridParams = JSON.stringify(oldLayerParams.gridParams) !==
                               JSON.stringify(newLayerParams.gridParams);
    const modifiedDotParams = JSON.stringify(oldLayerParams.dotParams) !==
                              JSON.stringify(newLayerParams.dotParams);
    return modifiedGridParams || modifiedDotParams;
  } else {
    return true;
  }
}

function updateLayerDots(singleLayerSelection, layerParams: LayerParameters,
                         imgFiller: img.ImageInterpolator): Promise<boolean> {
  return new Promise<boolean>(
    (resolve, reject) => {
      try {
        // Create dotTopology and gridTopology from layer params in
        // order to generate the grid-arranged dots for the layer.
        const dotTopology = dot.CreateDotTopology(layerParams.dotParams);
        grd.CreateGridTopology(layerParams.gridParams, imgFiller)
        .then((gridTopology) => {
          const timer = CreateTimer();

          // Once created the topologies, lets draw the dotted grid.
          // Merge update and enter dot selections, as we want to redraw every dot.
          const updateDotSelection = singleLayerSelection.selectAll("path")
              .data(gridTopology);
          updateDotSelection.exit().remove();
          updateDotSelection.enter().append("path")
            .merge(updateDotSelection)
            // From this point, we have newly created pahts (enter selection) and
            // also already existent paths (update selection) to be updated.
                .attr("d", dotTopology.dotShape)
                .attr("transform", dotTopology.dotTransform)
                .attr("fill", dotTopology.dotFill);

          timer.logElapsed(`[Update Layer DOTS] ${layerParams.name}`);
        })
        .catch((error) => {
          console.error(`[ERROR] Creating Grid Topology for Layer ${layerParams.name}: ${error.message}`);
          throw error;  // Let error bubbles up.
        });
        resolve(true);

      } catch (error) {
        reject(error);
      }
  });
}

/**
 * Constants.
 * @private
 */
const previousLayers = d3.local();
const layerSelector = "g[class^='layer']";

export function clear(masterNodeSelection) {
  masterNodeSelection.selectAll(layerSelector).remove();
}



export function draw(masterNodeSelection, sourceImage: any[][], layers: LayerStack): Promise<boolean> {
  return new Promise<boolean>(
    (resolve, reject) => {
      try {
        // STEP 1: PREPROCESS
        // Initialize image-level processors and sort layers by its zIndex.
        const imgFiller = img.CreateImageInterpolator(sourceImage, img.Bilinear);
        const sortedLayers = sortLayerStackByZIndex(layers);

        // STEP 2: Handle UPDATE, ENTER AND EXIT selections for layers.
        // Generate the final layer selection that needs redraw. This selection
        // will be the union between layers in enter selection and those layers in
        // update selection that really needs redraw (grid or dot topology modified).
        const layerSelection = masterNodeSelection.selectAll(layerSelector);
        const updateLayerSelection = layerSelection
            .data(sortedLayers, (layer) => layer.name).order();
        updateLayerSelection.exit().remove();
        const mergedLayerSelection = updateLayerSelection
          .enter().append("g")
          .merge(updateLayerSelection)
            .attr("class", (layer) => `layer-${layer.name}`)
            .attr("opacity", (layer) => layer.opacity);

        // STEP 3: Redraw dots for each layer that needs update.
        // DO NOT replace 'function' for 'arrow function' in 'each' method argument
        // as we need the proper scope for 'this', representing each layer node.
        const promiseList: Array<Promise<boolean>> = [];
        mergedLayerSelection.each(function(layerParams) {
          // Skip those layers that do no really need redraw as there is no grid/dot
          // topology modifications. We must compare with the previous layer params
          // locally stored.
          if (layerNeedsRedraw(previousLayers.get(this), layerParams)) {
            promiseList.push(updateLayerDots(d3.select(this), layerParams, imgFiller));
          }
          // Store current layer params to be able to do the previous comparison for the
          // next draw cycle.
          previousLayers.set(this, cloneLayerParams(layerParams));
        });

        // Wait for all layer promises to resolve.
        Promise.all(promiseList)
          .then((results) => {
            resolve(results.reduce((aggResult, promiseResult) => aggResult && promiseResult, true));
          })
          .catch((error) => {
            console.error(`[ERROR] Updating Layer DOTS: ${error.message}`);
            throw error;  // Let error bubbles up.
          });
      } catch (error) {
        reject(error);
      }
  });
}

export function reportLayerDOMStatus(masterNodeSelection) {
  if (masterNodeSelection) {
    masterNodeSelection.selectAll(layerSelector).each(function(layerDatum) {
      const size = d3.select(this).selectAll("path").size();
      logDebug(`[DOM Status] ${layerDatum.name}: ${size} nodes.`);
    });
  }
}
