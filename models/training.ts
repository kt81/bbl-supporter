/** イマイチやる気が出ない確率 */
export const SluggishRatePrc = 5;
/** 集中確率。集中○ありの状態のみ扱う */
export const ConcentrateRatePrc = 25;

export class ActiveTrainingSkill {
  /** 積極鍛錬ボーナス */
  public static readonly ActiveBonus = [2, 4];
  /** 積極鍛錬ペナルティ（一番左のマイナスステに足される） */
  public static readonly ActivePenalty = [-1, -2];
}
