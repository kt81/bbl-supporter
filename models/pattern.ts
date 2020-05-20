/**
 * 成長パターン管理
 */
/* eslint-disable no-labels,no-prototype-builtins */
import {StatusType} from "~/models/status";

export default class Pattern {
  public static createFromMatrix(matrix: any[][]) {
    matrix.shift(); // header
    const out = {} as GrowthTable;
    LOOP: for (const period in PeriodNames) {
      if (!PeriodNames.hasOwnProperty(period)) continue; // fuckn' linter
      const row = matrix.shift();
      if (row == null) {
        window.console.error("Row data is too few. period:" + period);
        break;
      }
      const pattern = {} as GrowthPattern;
      row.shift(); // row header
      for (const t in StatusGrowthTypeNames) {
        if (!StatusGrowthTypeNames.hasOwnProperty(t)) continue;
        const val = row.shift() as string;
        if (val == null) {
          window.console.error("Column is too few. type:" + StatusGrowthTypeNames[t]);
          break LOOP;
        }
        const [min, max] = val.split("〜");
        pattern[StatusGrowthTypeNames[t]] = [Number(min), Number(max)];
      }
      out[PeriodNames[period]] = pattern;
    }
    return out;
  }

  public static searchGrowthPattern(
    min: number,
    max: number,
    comment: HinoCommentType
  ): [GrowthType[], ReasonMulti | null] {
    const master = require("~/models/pattern-master").default as GrowthTable;
    const typeCandidates = [] as GrowthType[];
    let reason: ReasonMulti | null = null;
    let isFirstPeriodCandidate = true;
    for (const p in master) {
      // noinspection JSUnfilteredForInLoop,JSNonASCIINames
      const period = p as Period;
      const [mstMin, mstMax] = master[period]["非AP大"];
      // window.console.log(mstMin, mstMax);
      if (!(mstMin <= min && min <= mstMax && mstMin <= max && max <= mstMax)) {
        continue;
      }

      // さらにこのperiodを含むGrowthTypeを探す
      const growthTypes = First2YearsPeriodGrowthTypeMap[period];
      if (!growthTypes) continue;

      let isFirstType = typeCandidates.length === 0;
      growthTypes.forEach((t) => {
        if (First2YearsHinoCommentMap[comment].includes(t)) {
          typeCandidates.push(t);
          if (isFirstType) {
            isFirstType = false;
          } else if (isFirstPeriodCandidate) {
            reason = "2年後に確定";
          } else {
            reason = "データ数が足りず絞り込めていません";
          }
        }
      });
      isFirstPeriodCandidate = isFirstType;
    }
    return [typeCandidates, reason];
  }
}

export type GrowthPattern = {
  [key in StatusGrowthType]: [number, number];
};
export type GrowthTable = {
  [key in Period]: GrowthPattern;
};
export const ReasonMultiMessages = ["2年後に確定", "データ数が足りず絞り込めていません"] as const;
export type ReasonMulti = typeof ReasonMultiMessages[number];

export const PeriodNames = [
  "停滞期00",
  "停滞期01",
  "停滞期02",
  "停滞期03",
  "停滞期1",
  "停滞期2",
  "停滞期3",
  "通常期1",
  "通常期2",
  "通常期3",
  "通常期4",
  "成長期1",
  "成長期2",
  "成長期3",
  "成長期4",
] as const;
export type Period = typeof PeriodNames[number];
export const PeriodColorMap = {
  停滞期00: "#d1cce1",
  停滞期01: "#e6e6e6",
  停滞期02: "#d1d1d1",
  停滞期03: "#c5c5c5",
  停滞期1: "#aea2cf",
  停滞期2: "#cea1b7",
  停滞期3: "#e1cad3",
  通常期1: "#9fbbeb",
  通常期2: "#9ebdc2",
  通常期3: "#b0cfa3",
  通常期4: "#f5dd95",
  成長期1: "#f2dec6",
  成長期2: "#f0c497",
  成長期3: "#e29594",
  成長期4: "#d86465",
} as {[key in Period]: string};

/**
 * 基本は全部大。Weakだけ小
 */
export const StatusGrowthTypeNames = [
  "総合AP大",
  "ミートAP大",
  "パワーAP大",
  "コン守備AP大",
  "変化AP小",
  "新球",
  "非AP大",
  "非AP小",
] as const;
export type StatusGrowthType = typeof StatusGrowthTypeNames[number];
export const StatusGrowthMap = {
  ミート: "ミートAP大",
  パワー: "パワーAP大",
  走力: "総合AP大",
  守備: "総合AP大",
  小技: "非AP大",
  精神: "非AP大",
  // TODO 投手分
} as {[key in StatusType]: StatusGrowthType};

export const enum SkillType {
  None,
  PassiveTraining,
  ActiveTraining,
  BalancedTraining,
  MinutenessTraining,
  Concentration,
  SubAp,
  Gips,
}

export const HinoComments = ["変わらない", "もっと伸びる", "伸びなくなる"];
export type HinoCommentType = typeof HinoComments[number];
export const First2YearsHinoCommentMap = {
  変わらない: ["持続", "普通(持続)"],
  もっと伸びる: ["早熟", "普通早", "普通", "晩成", "凹凸", "持続早"],
  伸びなくなる: ["鍋底", "正弦波"],
} as {[key in HinoCommentType]: GrowthType[]};
export const First2YearsPeriodGrowthTypeMap = {
  停滞期3: ["晩成", "凹凸"],
  通常期1: ["普通", "制限波"],
  通常期2: ["持続", "普通(持続)", "持続早"],
  通常期3: ["普通早"],
  成長期2: ["早熟", "鍋底"],
} as {
  [key in Period]: GrowthType[];
};

export const GrowthTypeNames = [
  "早熟",
  "普通早",
  "普通",
  "鍋底",
  "正弦波",
  "晩成",
  "凹凸",
  "持続",
  "普通(持続)",
  "持続早",
] as const;
export type GrowthType = typeof GrowthTypeNames[number];

/**
 * 年齢毎の成長パターン
 */
export const GrowthPatternByAgeMaster = {
  "早熟": {
    18: "成長期2",
    19: "成長期2",
    20: "成長期4",
    21: "成長期4",
    22: "成長期2",
    23: "成長期2",
    24: "通常期3",
    25: "通常期3",
    26: "停滞期3",
    27: "停滞期3",
    28: "停滞期2",
    29: "停滞期2",
    30: "停滞期1",
    31: "停滞期1",
    32: "停滞期01",
    33: "停滞期01",
    34: "停滞期01",
    35: "停滞期01",
  },
  "普通早": {
    18: "通常期3",
    19: "通常期3",
    20: "成長期1",
    21: "成長期1",
    22: "成長期3",
    23: "成長期3",
    24: "通常期4",
    25: "通常期4",
    26: "通常期3",
    27: "通常期3",
    28: "停滞期3",
    29: "停滞期3",
    30: "停滞期2",
    31: "停滞期2",
    32: "停滞期1",
    33: "停滞期1",
    34: "停滞期00",
    35: "停滞期00",
  },
  "普通": {
    18: "通常期1",
    19: "通常期1",
    20: "通常期3",
    21: "通常期3",
    22: "成長期1",
    23: "成長期1",
    24: "成長期3",
    25: "成長期3",
    26: "成長期1",
    27: "成長期1",
    28: "停滞期2",
    29: "停滞期2",
    30: "停滞期2",
    31: "停滞期2",
    32: "停滞期1",
    33: "停滞期1",
    34: "停滞期1",
    35: "停滞期1",
  },
  "鍋底": {
    18: "成長期2",
    19: "成長期2",
    20: "通常期2",
    21: "通常期2",
    22: "通常期1",
    23: "通常期1",
    24: "通常期2",
    25: "通常期2",
    26: "通常期2",
    27: "通常期2",
    28: "通常期4",
    29: "通常期4",
    30: "停滞期2",
    31: "停滞期2",
    32: "停滞期2",
    33: "停滞期2",
    34: "停滞期1",
    35: "停滞期1",
  },
  "正弦波": {
    18: "通常期1",
    19: "通常期1",
    20: "停滞期3",
    21: "停滞期3",
    22: "通常期1",
    23: "通常期1",
    24: "通常期2",
    25: "通常期2",
    26: "通常期4",
    27: "通常期4",
    28: "成長期1",
    29: "成長期1",
    30: "通常期1",
    31: "通常期1",
    32: "通常期1",
    33: "通常期1",
    34: "停滞期3",
    35: "停滞期3",
  },
  "晩成": {
    18: "停滞期3",
    19: "停滞期3",
    20: "通常期1",
    21: "通常期1",
    22: "通常期1",
    23: "通常期1",
    24: "通常期1",
    25: "通常期1",
    26: "通常期2",
    27: "通常期2",
    28: "通常期4",
    29: "通常期4",
    30: "通常期4",
    31: "通常期4",
    32: "成長期2",
    33: "成長期2",
    34: "停滞期1",
    35: "停滞期1",
  },
  "凹凸": {
    18: "停滞期3",
    19: "停滞期3",
    20: "成長期2",
    21: "成長期2",
    22: "停滞期3",
    23: "停滞期3",
    24: "成長期2",
    25: "成長期2",
    26: "停滞期3",
    27: "停滞期3",
    28: "成長期1",
    29: "成長期1",
    30: "停滞期2",
    31: "停滞期2",
    32: "通常期2",
    33: "通常期2",
    34: "停滞期1",
    35: "停滞期1",
  },
  "持続": {
    18: "通常期2",
    19: "通常期2",
    20: "通常期2",
    21: "通常期2",
    22: "通常期2",
    23: "通常期2",
    24: "通常期2",
    25: "通常期2",
    26: "通常期2",
    27: "通常期2",
    28: "通常期2",
    29: "通常期2",
    30: "通常期2",
    31: "通常期2",
    32: "通常期2",
    33: "通常期2",
    34: "通常期2",
    35: "通常期2",
  },
  "普通(持続)": {
    18: "通常期2",
    19: "通常期2",
    20: "通常期2",
    21: "通常期2",
    22: "通常期2",
    23: "通常期2",
    24: "通常期3",
    25: "通常期3",
    26: "通常期4",
    27: "通常期4",
    28: "通常期3",
    29: "通常期3",
    30: "通常期1",
    31: "通常期1",
    32: "停滞期3",
    33: "停滞期3",
    34: "停滞期3",
    35: "停滞期3",
  },
  "持続早": {
    18: "通常期2",
    19: "通常期2",
    20: "通常期4",
    21: "通常期4",
    22: "成長期1",
    23: "成長期1",
    24: "通常期4",
    25: "通常期4",
    26: "通常期3",
    27: "通常期3",
    28: "停滞期2",
    29: "停滞期2",
    30: "停滞期2",
    31: "停滞期2",
    32: "停滞期1",
    33: "停滞期1",
    34: "停滞期02",
    35: "停滞期02",
  },
} as GrowthPatternByAge;
type GrowthPatternByAge = {
  [key in GrowthType]: {[age in number]: Period};
};
