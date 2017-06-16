import { Preset, PresetCollection } from "../../models/presetModel";

export const PresetList: PresetCollection = [
   {
    name: "Default",
    description: "Simplest pattern",
    thumbnailUrl: "",
    json: require("./Default.json"),
  },
  {
    name: "CMYK",
    description: "Simulates CMYK print pattern",
    thumbnailUrl: "",
    json: require("./CMYK_Print.json"),
  },
];
