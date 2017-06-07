import { SampleImageItem } from "../../models/sampleImageModel";

const Img8bitTestLightness = require("./8bitTestLightness.bmp");
const Img8bitTestSaturation = require("./8bitTestSaturation.bmp");
const ImgCalibration = require("./Calibration-100-70-50.bmp");

export const TestImages: SampleImageItem[] = [
  {
    value: "8blight",
    label: "8-bit Test Lightness",
    description: "Test",
    url: Img8bitTestLightness,
  },
  {
    value: "8bsat",
    label: "8-bit Test Saturation",
    description: "Test",
    url: Img8bitTestSaturation,
  },
  {
    value: "calib",
    label: "Calibration 100-70-50",
    description: "Test",
    url: ImgCalibration,
  },
];
