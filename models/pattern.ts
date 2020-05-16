/**
 * 成長パターン管理
 */
/* eslint-disable no-labels,no-prototype-builtins */
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
      for (const t in GrowthPeriodNames) {
        if (!GrowthPeriodNames.hasOwnProperty(t)) continue;
        const val = row.shift() as string;
        if (val == null) {
          window.console.error(
            "Column is too few. type:" + GrowthPeriodNames[t]
          );
          break LOOP;
        }
        const [min, max] = val.split("〜");
        pattern[GrowthPeriodNames[t]] = [Number(min), Number(max)];
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
  [key in PointGrowthType]: [number, number];
};
export type GrowthTable = {
  [key in Period]: GrowthPattern;
};
export const ReasonMultiMessages = [
  "2年後に確定",
  "データ数が足りず絞り込めていません",
] as const;
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

/**
 * 基本は全部大。Weakだけ小
 */
export const GrowthPeriodNames = [
  "ミートAP大",
  "パワーAP大",
  "コン守備AP大",
  "変化球AP大",
  "新球",
  "非AP大",
  "非AP小",
] as const;
export type PointGrowthType = typeof GrowthPeriodNames[number];

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
