import { identifiers } from "../identifiers";

/**
 * Barrel aggregator.
 * @public
 */
export const contextStylesheets = {
  // Project Features CSS.
  [identifiers.halftone]: require("./components/halftone.scss"),
  [identifiers.layerSetup]: require("./components/layerSetup.scss"),

  // Project Components CSS.
  [identifiers.layerItem]: require("./components/layerItem.scss"),
  [identifiers.layerList]: require("./components/layerList.scss"),
  [identifiers.layerRenamer]: require("./components/layerRenamer.scss"),

  // Vendor/Third-Party Components CSS.
  [identifiers.vendorList]: "",
  [identifiers.vendorMenu]: "",
  [identifiers.vendorDialog]: require("./components/react-toolbox/dialog.scss"),

  // TODO: Remove, just for testing ************************
  CMPIntroMock: require("./components/introMock.scss"),
};

