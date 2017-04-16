import * as timer from "../../../api/timerLog";
import { GridPatternType } from "./gridPatterns";
import { CreateGridTopology, GridParameters } from "./gridTopology";
const d3 = require("d3");

/**
 * Only for testing purposes. It appends a pixel topology: a grid that simulates
 * pixels layout.
 * @public
 * @function CreatePixelTopologyLayer
 * @param  {number} width: number  {Number of horizontal pixels.}
 * @param  {number} height: number {Number of vertical pixels.}
 * @param  {any} parent: any {Target SVG item where pixel topology layer will be appended. }
 * @return {any} {Pixel Topology Layer (SVG item) generated.}
 */
export function CreatePixelTopologyLayer(width: number, height: number, parent: any): Promise<any> {
  return new Promise<void>((resolve, reject) => {
    try {
      const gridParams: GridParameters = {
        pattern: GridPatternType.Square,
        targetWidth: width,
        targetHeight: height,
        scaleFactor: 1,
        rotationAngle: 0,
      };

      CreateGridTopology(gridParams).then((gridTopology) => {
        timer.reset();
        const pixelLayer = parent.append("g")
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

        timer.logElapsed("[DrawPixelTopologyLayer]");
        resolve(pixelLayer);
      })
      .catch((error) => { throw error; });
    } catch (error) {
      reject(error.message);
    }
  });
}
