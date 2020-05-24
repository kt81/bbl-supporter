import {
  GrowthPatternByAgeMaster,
  GrowthType,
  Period,
  StatusGrowthMap,
  StatusGrowthType,
} from "~/models/pattern";
import {
  calcExp,
  evalGrade,
  ExpTable,
  Grade,
  gradeIterator,
  GradeMax,
  StatusNames,
  StatusSet,
  StatusType,
} from "~/models/status";
import PatternMaster from "~/models/pattern-master";

declare const Charge = "練習溜め";
export type ChargeType = typeof Charge;
export type TrainingSet = {[type in StatusType | ChargeType]: number};
export type TrainingPlan = {[age in number]: TrainingSet};

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
export type TrainingResultSet = {
  statusSet: StatusSet;
  expSet: ExpSet;
};
export function calcAfterTrainingStatus(
  age: number,
  ap: StatusType,
  growthType: GrowthType,
  currentStatus: StatusSet,
  currentFractionExp: ExpSet,
  trainingSet: TrainingSet
): TrainingResultSet {
  const periodMaster = GrowthPatternByAgeMaster[growthType];
  const period = periodMaster[age];
  const points = calcUpDownInPeriod(period, ap, trainingSet);
  const resStatusSet = {} as StatusSet;
  const resExpSet = {} as ExpSet;
  const result = {
    statusSet: resStatusSet,
    expSet: resExpSet,
  } as TrainingResultSet;

  for (const s in StatusNames) {
    const statusType = s as StatusType;
    let currentPoint = currentStatus[statusType];
    let exp = currentFractionExp[statusType];

    const [grade] = evalGrade(currentPoint);
    const [upExp, downExp] = points[statusType];
    const expF = calcExp(statusType, Grade.F);

    // 減少分の処理。常に減少するやつを先にやるものとする
    if (exp >= expF) {
      exp += downExp;
      if (exp < expF) {
        // Gになったらそれ以上はさがらんのじゃ
        exp = expF - 2; // TODO PenaltyMaster的なの1回分の半分を引く
      }
    }
    // 上昇
    exp += upExp;
    // 必要経験値を取る
    const reqExp = ExpTable[statusType][grade];
    // 各グレードでポイントを足していく
    gradeIterator(grade, Grade.A).forEach((g) => {
      const gradeMaxPoint = GradeMax[g];
      while (exp >= reqExp) {
        exp -= reqExp;
        currentPoint++;
        if (currentPoint >= gradeMaxPoint) return; // 次のグレードへ
      }
    });
    resStatusSet[statusType] = currentPoint;
    resExpSet[statusType] = exp;
  }
  return result;
}

/**
 * 指定されたプランでの期間内のマイナス、プラスを計算する
 * @return [upExp:number, downExp:number] downExpはマイナスで入ってる
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
