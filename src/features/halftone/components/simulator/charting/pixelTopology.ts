import * as d3 from "d3";

import { CreateTimer } from "../../../../../util";
import { GridPatternType, GridParameters, CreateDefaultGridParams } from "../../../../../models/gridModel";
import { CreateGridTopology } from "./gridTopology";


/**
 * Only for testing purposes. It appends a pixel topology: a grid that simulates
 * pixels layout.
 * @public
 * @function CreatePixelTopology
 * @param  {number} width: number  {Number of horizontal pixels.}
 * @param  {number} height: number {Number of vertical pixels.}
 * @param  {any} masterNode: any {Target SVG item where pixel topology layer will be appended. }
 * @return {any} {Pixel Topology Layer (SVG item) generated.}
 */
export function AddPixelTopologyLayer(width: number, height: number, masterNode: any): Promise<any> {
  return new Promise<void>((resolve, reject) => {
    try {
      const gridParams: GridParameters = CreateDefaultGridParams();

      CreateGridTopology(gridParams, width, height).then((gridTopology) => {
        const timer = CreateTimer();
        const pixelLayer = masterNode.append("g")
          .attr("class", "pixel-topology-layer")
          .attr("transform", `translate(-0.5, -0.5)`)
          .attr("fill", "none")
          .attr("stroke", "black")
          .attr("stroke-width", "0.025px");

        pixelLayer.selectAll("polyline")
          .data(gridTopology)
        .enter().append("polyline")
          .attr("points", (d) => `${d.x} ${d.y + 1}, ${d.x} ${d.y}, ${d.x + 1} ${d.y}`);

        pixelLayer.append("polyline")
          .attr("points", `0 ${height}, ${width} ${height}, ${width} 0`);

        timer.logElapsed("[Add Pixel Topology Layer]");
        resolve(pixelLayer);
      })
      .catch((error) => {
        console.error(`[ERROR] Creating Grid Topology: ${error.message}`);
        throw error; // Let error bubbles up.
      });
    } catch (error) {
      reject(error);
    }
  });
}
