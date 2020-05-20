import {
  GrowthPatternByAgeMaster,
  GrowthType,
  Period,
  StatusGrowthMap,
  StatusGrowthType,
} from "~/models/pattern";
import {evalGrade, ExpTable, StatusNames, StatusSet, StatusType} from "~/models/status";
import PatternMaster from "~/models/pattern-master";

declare const Charge = "練習溜め";
type ChargeType = typeof Charge;
type TrainingSet = {[type in StatusType | ChargeType]: number};
type TrainingPlan = {[age in number]: TrainingSet};

/** イマイチやる気が出ない確率 */
export const SluggishRatePrc = 5;
/** 集中確率。集中○ありの状態のみ扱う */
export const ConcentrateRatePrc = 25;
export const ConcentrateBonusAvg = 4;
export const NormalResultRatePrc = 100 - SluggishRatePrc - ConcentrateRatePrc;

export class ActiveTrainingSkill {
  /** 積極鍛錬ボーナス */
  public static ActiveBonusAvg = 3;
  public static readonly ActiveBonus = [2, 4];
  /** 積極鍛錬ペナルティ（一番左のマイナスステに足される） */
  public static ActivePenaltyAvg = -1.5;
  public static readonly ActivePenalty = [-1, -2];
}

export const PenaltyTargetMap = {
  ミート: ["パワー", "守備"],
  パワー: ["パワー", "走力"], // 本当はケガも
  走力: ["パワー"],
  守備: ["ミート"],
  小技: [],
  精神: [],
  特殊: ["精神"],
} as {[key in StatusType]: StatusType[]};

export type ExpSet = {
  [key in StatusType]: number;
};
export function calcLifetimePlan(
  ap: StatusType,
  growthType: GrowthType,
  currentStatus: StatusSet,
  currentExp: ExpSet,
  trainingPlan: TrainingPlan
) {
  const periodMaster = GrowthPatternByAgeMaster[growthType];
  for (const age in trainingPlan) {
    const set = trainingPlan[age];
    const period = periodMaster[age];
    const points = calcUpDownInPeriod(period, ap, set);
    for (const s in StatusNames) {
      const status = s as StatusType;
      const currentPoint = currentStatus[status];
      const exp = currentExp[status];
      const [upExp, downExp] = points[status];
      // 現在のグレード
      const [grade] = evalGrade(currentPoint);
      // 経験値を取る
      const reqExp = ExpTable[status][grade];
    }
  }
}

/**
 * 指定されたプランでの期間内のマイナス、プラスを計算する
 * @return [upExp:number, downExp:number]
 */
export function calcUpDownInPeriod(
  period: Period,
  ap: StatusType,
  trainingPlanForThisPeriod: TrainingSet
): {[key in StatusType]: [number, number]} {
  const pattern = PatternMaster[period];
  const out = {} as {[key in StatusType]: [number, number]};
  StatusNames.forEach((st) => {
    if (!out[st]) {
      out[st] = [0, 0];
    }
    const num = trainingPlanForThisPeriod[st];
    if (!num) return;
    const sgType: StatusGrowthType = ap === st ? StatusGrowthMap[st] : "非AP大";
    const [min, max] = pattern[sgType];
    const avg = (min + max) / 2 + ActiveTrainingSkill.ActiveBonusAvg;
    const res =
      (avg * NormalResultRatePrc +
        // イマハラ
        avg * SluggishRatePrc * 0.5 +
        // 集中
        (avg + ConcentrateBonusAvg) * ConcentrateRatePrc) /
      100; // percentのまま掛けてるので
    const penaltyStatus = PenaltyTargetMap[st];
    out[st][0] += res;
    let isFirst = true;
    penaltyStatus.forEach((ps) => {
      // TODO -3 はてきとう。ちゃんと成長期マスタに入れてAvgもってくる
      out[ps][1] += -3 + (isFirst ? ActiveTrainingSkill.ActivePenaltyAvg : 0);
      isFirst = false;
    });
  });
  return out;
}
