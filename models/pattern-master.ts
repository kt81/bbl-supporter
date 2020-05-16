import {GrowthTable} from "~/models/pattern";

// noinspection NonAsciiCharacters,JSNonASCIINames
export default {
  停滞期00: {
    ミートAP大: [-4, -4],
    パワーAP大: [-4, -4],
    コン守備AP大: [-4, -4],
    変化球AP大: [-4, -4],
    新球: [-4, -4],
    非AP大: [0, 0],
    非AP小: [0, 0],
  },
  停滞期01: {
    ミートAP大: [-4, -4],
    パワーAP大: [-4, -4],
    コン守備AP大: [-4, -4],
    変化球AP大: [-4, -4],
    新球: [-4, -4],
    非AP大: [0, 1],
    非AP小: [0, 0],
  },
  停滞期02: {
    ミートAP大: [-4, -4],
    パワーAP大: [-4, -4],
    コン守備AP大: [-4, -4],
    変化球AP大: [-4, -4],
    新球: [-4, -4],
    非AP大: [0, 2],
    非AP小: [0, 0],
  },
  停滞期03: {
    ミートAP大: [-4, -4],
    パワーAP大: [-4, -4],
    コン守備AP大: [-4, -4],
    変化球AP大: [-4, -4],
    新球: [-4, -4],
    非AP大: [0, 3],
    非AP小: [0, 0],
  },
  停滞期1: {
    ミートAP大: [2, 6],
    パワーAP大: [2, 6],
    コン守備AP大: [2, 6],
    変化球AP大: [1, 4],
    新球: [-1, -1],
    非AP大: [2, 4],
    非AP小: [1, 3],
  },
  停滞期2: {
    ミートAP大: [5, 8],
    パワーAP大: [6, 9],
    コン守備AP大: [6, 9],
    変化球AP大: [3, 6],
    新球: [4, 8],
    非AP大: [4, 6],
    非AP小: [2, 4],
  },
  停滞期3: {
    ミートAP大: [6, 9],
    パワーAP大: [7, 9],
    コン守備AP大: [7, 7],
    変化球AP大: [5, 8],
    新球: [5, 9],
    非AP大: [5, 7],
    非AP小: [3, 5],
  },
  通常期1: {
    ミートAP大: [9, 11],
    パワーAP大: [10, 13],
    コン守備AP大: [10, 13],
    変化球AP大: [6, 10],
    新球: [6, 10],
    非AP大: [7, 9],
    非AP小: [4, 6],
  },
  通常期2: {
    ミートAP大: [10, 13],
    パワーAP大: [11, 14],
    コン守備AP大: [12, 15],
    変化球AP大: [7, 11],
    新球: [7, 11],
    非AP大: [8, 10],
    非AP小: [5, 7],
  },
  通常期3: {
    ミートAP大: [11, 15],
    パワーAP大: [12, 16],
    コン守備AP大: [13, 17],
    変化球AP大: [9, 12],
    新球: [8, 12],
    非AP大: [9, 12],
    非AP小: [6, 8],
  },
  通常期4: {
    ミートAP大: [14, 18],
    パワーAP大: [15, 19],
    コン守備AP大: [16, 20],
    変化球AP大: [10, 15],
    新球: [9, 14],
    非AP大: [11, 14],
    非AP小: [7, 10],
  },
  成長期1: {
    ミートAP大: [16, 20],
    パワーAP大: [18, 22],
    コン守備AP大: [20, 24],
    変化球AP大: [12, 17],
    新球: [10, 15],
    非AP大: [13, 16],
    非AP小: [8, 11],
  },
  成長期2: {
    ミートAP大: [18, 22],
    パワーAP大: [19, 23],
    コン守備AP大: [21, 25],
    変化球AP大: [13, 18],
    新球: [11, 16],
    非AP大: [14, 17],
    非AP小: [9, 12],
  },
  成長期3: {
    ミートAP大: [20, 24],
    パワーAP大: [21, 25],
    コン守備AP大: [22, 27],
    変化球AP大: [15, 19],
    新球: [12, 17],
    非AP大: [15, 19],
    非AP小: [10, 13],
  },
  成長期4: {
    ミートAP大: [22, 26],
    パワーAP大: [22, 26],
    コン守備AP大: [26, 30],
    変化球AP大: [16, 21],
    新球: [13, 18],
    非AP大: [17, 20],
    非AP小: [11, 14],
  },
} as GrowthTable;