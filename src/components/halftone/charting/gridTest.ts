import { GridPatternType } from "./gridPatterns";
import { CreateGridTopology, GridParameters } from "./gridTopology";

/**
 * Only for testing purposes. It appends a grid that simulates pixels.
 * @public
 * @function appendPixelPatternChecker
 * @param  {number} width: number  {Number of horizontal pixels.}
 * @param  {number} height: number {Number of vertical pixels.}
 * @param  {any} target      {Target SVG item where grid will be appended. }
 * @return {void}
 */
export function appendPixelPatternChecker(width: number, height: number, target): void {
  const gridParams: GridParameters = {
    targetWidth: width,
    targetHeight: height,
    scaleFactor: 1,
    rotationAngle: 0,
    pattern: GridPatternType.Square,
  };

  const pixelPattern = target.append("g")
      .attr("class", "pixel-pattern")
      .attr("transform", `translate(-0.5, -0.5)`)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", "0.025px");

  pixelPattern.selectAll("polyline")
    .data(CreateGridTopology(gridParams))
  .enter().append("polyline")
    .attr("points", (d) => `${d.x} ${d.y + 1}, ${d.x} ${d.y}, ${d.x + 1} ${d.y}`);

  pixelPattern.append("polyline")
    .attr("points", `0 ${height}, ${width} ${height}, ${width} 0`);

  return pixelPattern;
}
