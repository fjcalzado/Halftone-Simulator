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
  [identifiers.vendorButton]: require("./components/react-toolbox/button.scss"),
  [identifiers.vendorDialog]: require("./components/react-toolbox/dialog.scss"),
  [identifiers.vendorInput]: require("./components/react-toolbox/input.scss"),
  [identifiers.vendorList]: require("./components/react-toolbox/list.scss"),
  [identifiers.vendorMenu]: require("./components/react-toolbox/menu.scss"),
  [identifiers.vendorSwitch]: require("./components/react-toolbox/switch.scss"),

  // TODO: Remove, just for testing ************************
  CMPIntroMock: require("./components/introMock.scss"),
};

