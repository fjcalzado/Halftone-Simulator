import { Preset, PresetCollection } from "../../models/presetModel";

export const PresetList: PresetCollection = [
   {
    name: "Default",
    description: "Simplest pattern",
    thumbnailUrl: require("./DefaultSprite.svg"),
    layerStackJSON: require("./Default.json"),
    customBackgroundColor: true,
    backgroundColor: "rgb(255, 255, 255)",
  },
  {
    name: "CMYK",
    description: "Simulates CMYK printing",
    thumbnailUrl: require("./CMYKPrintSprite.svg"),
    layerStackJSON: require("./CMYKPrint.json"),
    customBackgroundColor: true,
    backgroundColor: "rgb(255, 255, 255)",
  },
  {
    name: "",
    description: "... More presets to come ...",
    thumbnailUrl: "",
    layerStackJSON: require("./Default.json"),
    customBackgroundColor: true,
    backgroundColor: "rgb(255, 255, 255)",
  },
];
