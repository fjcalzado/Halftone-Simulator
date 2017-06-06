import { SampleImageItem } from "../../models/sampleImageModel";

const ImgF1 = require("./f1.jpg");
const ImgLu = require("./lu.jpg");
const ImgMa = require("./ma.jpg");
const ImgMall = require("./mall.jpg");
const ImgMota = require("./mota.jpg");
const ImgNyc = require("./nyc.jpg");

export const SampleImages: SampleImageItem[] = [
  {
    value: "lu",
    label: "Fashion",
    description: "Portrait",
    url: ImgLu,
  },
  {
    value: "f1",
    label: "Formula 1",
    description: "Sports",
    url: ImgF1,
  },
  {
    value: "ma",
    label: "Classic Car",
    description: "Black & White",
    url: ImgMa,
  },
  {
    value: "mall",
    label: "Pier",
    description: "Inspirational",
    url: ImgMall,
  },
  {
    value: "mota",
    label: "Cat",
    description: "Animals",
    url: ImgMota,
  },
  {
    value: "nyc",
    label: "New York City",
    description: "Night Landscape",
    url: ImgNyc,
  },
];


