import { GridParameters, CreateDefaultGridParams } from "./gridModel";
import { DotParameters, CreateDefaultDotParams } from "./dotModel";

/**
 * Layer Model.
 * @public
 */

export interface LayerParameters {
  name: string;
  visible: boolean;
  opacity: number;
  zIndex: number;
  gridParams: GridParameters;
  dotParams: DotParameters;
}

export type LayerStack = LayerParameters[];

export const CreateDefaultLayerParams = () => {
  return {
    name: "NewLayer",
    visible: true,
    opacity: 1,
    zIndex: 0,
    gridParams: CreateDefaultGridParams(),
    dotParams: CreateDefaultDotParams(),
  };
};

export const CloneLayerParams = (layerParams: LayerParameters): LayerParameters => {
  return {
    ...layerParams,
    gridParams: {...layerParams.gridParams},
    dotParams: {...layerParams.dotParams},
  };
};
