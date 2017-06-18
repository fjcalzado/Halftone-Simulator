import { identifiers } from "../identifiers";

/**
 * Barrel aggregator.
 * @public
 */
export const contextStylesheets = {
  [identifiers.app]: require("./app/app.scss"),

  // Project Features CSS.
  [identifiers.navigationBar]: require("./features/navigationBar.scss"),
  [identifiers.pictureSetup]: require("./features/pictureSetup.scss"),
  [identifiers.halftone]: require("./features/halftone.scss"),
  [identifiers.layerSetup]: require("./features/layerSetup.scss"),
  [identifiers.presetSelector]: require("./features/presetSelector.scss"),
  [identifiers.setupLayout]: require("./features/setupLayout.scss"),

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

  // Vendor/Third-Party components CSS.
  [identifiers.vendorButton]: require("./vendor/react-toolbox/button.scss"),
  [identifiers.vendorDialog]: require("./vendor/react-toolbox/dialog.scss"),
  [identifiers.vendorInput]: require("./vendor/react-toolbox/input.scss"),
  [identifiers.vendorList]: require("./vendor/react-toolbox/list.scss"),
  [identifiers.vendorMenu]: require("./vendor/react-toolbox/menu.scss"),
  [identifiers.vendorSwitch]: require("./vendor/react-toolbox/switch.scss"),
  [identifiers.vendorSlider]: require("./vendor/react-toolbox/slider.scss"),
  [identifiers.vendorDropdown]: require("./vendor/react-toolbox/dropdown.scss"),
  [identifiers.vendorTabs]: require("./vendor/react-toolbox/tabs.scss"),
  [identifiers.vendorProgress]: require("./vendor/react-toolbox/progress.scss"),
  [identifiers.vendorTooltip]: require("./vendor/react-toolbox/tooltip.scss"),
  [identifiers.vendorAvatar]: require("./vendor/react-toolbox/avatar.scss"),
  [identifiers.vendorAppBar]: require("./vendor/react-toolbox/appbar.scss"),

  // TODO: Remove, just for testing ************************
  CMPIntroMock: require("./components/introMock.scss"),
};

