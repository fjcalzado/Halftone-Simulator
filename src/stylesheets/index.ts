import { identifiers } from "../identifiers";

/**
 * Barrel aggregator.
 * @public
 */
export const contextStylesheets = {
  // Project Features CSS.
  [identifiers.pictureSetup]: require("./components/pictureSetup.scss"),
  [identifiers.halftone]: require("./components/halftone.scss"),
  [identifiers.layerSetup]: require("./components/layerSetup.scss"),
  [identifiers.presetSelector]: require("./components/presetSelector.scss"),
  [identifiers.setupLayout]: require("./components/setupLayout.scss"),

  // Project Components CSS.
  [identifiers.simulator]: require("./components/simulator.scss"),
  [identifiers.wait]: require("./components/wait.scss"),
  [identifiers.downloader]: require("./components/downloader.scss"),
  [identifiers.sliderEx]: require("./components/sliderEx.scss"),
  [identifiers.colorPicker]: require("./components/colorPicker.scss"),
  [identifiers.colorPickerToggleable]: require("./components/colorPickerToggleable.scss"),
  [identifiers.filePicker]: require("./components/filePicker.scss"),
  [identifiers.jsonExporter]: require("./components/jsonExporter.scss"),
  [identifiers.jsonImporter]: require("./components/jsonImporter.scss"),
  [identifiers.layerItem]: require("./components/layerItem.scss"),
  [identifiers.layerList]: require("./components/layerList.scss"),
  [identifiers.layerRenamer]: require("./components/layerRenamer.scss"),
  [identifiers.layerAdder]: require("./components/layerAdder.scss"),
  [identifiers.layerParams]: require("./components/layerParams.scss"),
  [identifiers.backgroundColorPicker]: require("./components/backgroundColorPicker.scss"),
  [identifiers.pictureSelector]: require("./components/pictureSelector.scss"),
  [identifiers.pictureUpload]: require("./components/pictureUpload.scss"),
  [identifiers.pictureResolution]: require("./components/pictureResolution.scss"),

  // Vendor/Third-Party Components CSS.
  [identifiers.vendorButton]: require("./components/react-toolbox/button.scss"),
  [identifiers.vendorDialog]: require("./components/react-toolbox/dialog.scss"),
  [identifiers.vendorInput]: require("./components/react-toolbox/input.scss"),
  [identifiers.vendorList]: require("./components/react-toolbox/list.scss"),
  [identifiers.vendorMenu]: require("./components/react-toolbox/menu.scss"),
  [identifiers.vendorSwitch]: require("./components/react-toolbox/switch.scss"),
  [identifiers.vendorSlider]: require("./components/react-toolbox/slider.scss"),
  [identifiers.vendorDropdown]: require("./components/react-toolbox/dropdown.scss"),
  [identifiers.vendorTabs]: require("./components/react-toolbox/tabs.scss"),
  [identifiers.vendorProgress]: require("./components/react-toolbox/progress.scss"),
  [identifiers.vendorTooltip]: require("./components/react-toolbox/tooltip.scss"),

  // TODO: Remove, just for testing ************************
  CMPIntroMock: require("./components/introMock.scss"),
};

