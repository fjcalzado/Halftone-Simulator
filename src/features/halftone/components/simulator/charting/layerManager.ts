import * as d3 from "d3";

import { ImageInterpolator, CreateImageInterpolator, Bilinear, NearestNeighbor } from "../imaging";
import { CreateTimer, logDebug } from "../../../../../util";
import { DotParameters } from "../../../../../models/dotModel";
import { GridParameters } from "../../../../../models/gridModel";
import { CreateDotTopology, DotTopology } from "./dotTopology";
import { CreateGridTopology } from "./gridTopology";
import { LayerParameters, LayerStack, CloneLayerParams } from "../../../../../models/layerModel";


/**
 * Helper functions.
 * @private
 */

function sortLayersByZIndex(layers: LayerStack): LayerStack {
  // Inverse order, so that lowest zIndex is the top layer.
  return layers.sort((a, b) => b.zIndex - a.zIndex);
}


/**
 * Check whether a layer needs redraw by comparing it against its previous value
 * and detecting any dot parameters or grid parameters change. Only layers with
 * changes in its dot/grid topology need redraw, a change in layer parameters like
 * zIndex or name should not imply a redraw to avoid a performance hit.
 * @private
 * @function layerNeedsRedraw
 * @param  {LayerParameters} oldLayerParams: LayerParameters {First member in the comparison.}
 * @param  {LayerParameters} newLayerParams: LayerParameters {Second member in the comparison.}
 * @return {boolean} {True if grid or dot topology have changed.}
 */
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

/**
 * Draw a layer described by its parameters and given a D3 selection
 * to draw into and a link to the base image in form of an image filler.
 * @private
 * @function drawLayer
 * @param  {D3 single selection} singleLayerSelection  {Layer selection in D3 format.}
 * @param  {LayerParameters} layerParams: LayerParameters {Layer parameters.}
 * @param  {number} targetWidth {Target image width in pixels.}
 * @param  {number} targetHeight {Target image height in pixels.}
 * @param  {ImageInterpolator} {Image interpolater used by brid topology to extract image pixel info.}
 * @return {Promise<boolean>} {Promise indicating if operation was succesfully completed.}
 */
function drawLayer(singleLayerSelection, layerParams: LayerParameters, targetWidth: number,
                   targetHeight: number, imgFiller: ImageInterpolator): Promise<boolean> {
  return new Promise<boolean>(
    (resolve, reject) => {
      try {
        // Create dotTopology and gridTopology from layer params in
        // order to generate the grid-arranged dots for the layer.
        const dotTopology = CreateDotTopology(layerParams.dotParams);
        CreateGridTopology(layerParams.gridParams, targetWidth, targetHeight, imgFiller)
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
            resolve(true);
          })
          .catch((error) => {
            console.error(`[ERROR] Creating Grid Topology for Layer ${layerParams.name}: ${error.message}`);
            throw error;  // Let error bubbles up.
          });
      } catch (error) {
        reject(error);
      }
  });
}

/**
 * Constants.
 * @private
 */
const layerSelector = "g[class^='layer']";

/**
 * Local state.
 * @private
 */
let currentLayers = null;

/**
 * Reset current layer state.
 * @function resetState
 * @return {void}
 */
export function resetState() {
  currentLayers = d3.local();
}

/**
 * Clear all layers for the given master node.
 * @public
 * @function clear
 * @param  {D3 single selection} masterNodeSelection {Master node selection to be cleared.}
 * @return {void} {void}
 */
export function clearLayers(masterNodeSelection) {
  masterNodeSelection.selectAll(layerSelector).remove();
}

/**
 * Draw layers given a set of layer parameters, a source image and
 * a master node to draw into.
 * @public
 * @function draw
 * @param  {D3 single selection} masterNodeSelection {Master node selection to be drawn.}
 * @param  {any[][]} sourceImage: any[][] {Source image in matrix format}
 * @param  {LayerStack} layers: LayerStack {Stack of layers described by its parameters}
 * @return {Promise<boolean>} {Promise indicating if operation was succesfully completed.}
 */
export function drawLayers(masterNodeSelection, sourceImage: any[][], layers: LayerStack): Promise<boolean> {
  return new Promise<boolean>(
    (resolve, reject) => {
      try {
        // STEP 1: PREPROCESS
        // Initialize image-level processors.
        // Also sort layers by its zIndex and filter not visible ones.
        // TODO: Interpolator selectable from UI (NN/Bilinear).
        const imgFiller = CreateImageInterpolator(sourceImage, Bilinear);
        const sortedVisibleLayers = sortLayersByZIndex(layers).filter((layer) => layer.visible);

        // STEP 2: Handle UPDATE, ENTER AND EXIT selections for layers.
        // Generate the final layer selection that needs redraw. This selection
        // will be the union between layers in enter selection and those layers in
        // update selection that really needs redraw (grid or dot topology modified).
        const layerSelection = masterNodeSelection.selectAll(layerSelector);
        const updateLayerSelection = layerSelection
            .data(sortedVisibleLayers, (layer) => layer.name).order();
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
          if (layerNeedsRedraw(currentLayers.get(this), layerParams)) {
            promiseList.push(drawLayer(d3.select(this), layerParams,
                                       sourceImage[0].length, sourceImage.length,
                                       imgFiller));
          }
          // Store current layer params to be able to do the previous comparison for the
          // next draw cycle.
          currentLayers.set(this, CloneLayerParams(layerParams));
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

/**
 * Only for debugg puposes. It logs current layers and its number of nodes.
 * @public
 * @function reportLayerDOMStatus
 * @param  {D3 single selection} masterNodeSelection {Master node to report.}
 * @return {void}
 */
export function reportLayerDOMStatus(masterNodeSelection) {
  if (masterNodeSelection) {
    masterNodeSelection.selectAll(layerSelector).each(function(layerDatum) {
      const size = d3.select(this).selectAll("path").size();
      logDebug(`[DOM Status] ${layerDatum.name}: ${size} nodes.`);
    });
  }
}
