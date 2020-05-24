export enum Grade {
  S = "S",
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
  F = "F",
  G = "G",
}
// 本当にGeneratorするの大仰なのでやめた
export function gradeIterator(from: Grade, to = Grade.S): Grade[] {
  const out = [] as Grade[];
  let isIgnored = true;
  for (const g in Grade) {
    if (isIgnored) {
      if (g === from) {
        isIgnored = false;
      } else {
        continue;
      }
    }
    out.push(g as Grade);
    if (to === g) {
      break;
    }
  }
  return out;
}

export const GradeMin: {[grade: string]: number} = {
  [Grade.S]: 100,
  [Grade.A]: 90,
  [Grade.B]: 75,
  [Grade.C]: 60,
  [Grade.D]: 45,
  [Grade.E]: 30,
  [Grade.F]: 15,
  [Grade.G]: 1,
};
export const GradeMax: {[grade: string]: number} = {
  [Grade.S]: 100,
  [Grade.A]: 99,
  [Grade.B]: 89,
  [Grade.C]: 74,
  [Grade.D]: 59,
  [Grade.E]: 44,
  [Grade.F]: 29,
  [Grade.G]: 14,
};

export const ExpTable: {[key in StatusType]: {[key in Grade]: number}} = {
  ミート: {
    [Grade.G]: 30,
    [Grade.F]: 30,
    [Grade.E]: 30,
    [Grade.D]: 50,
    [Grade.C]: 70,
    [Grade.B]: 90,
    [Grade.A]: 100,
    [Grade.S]: 0,
  },
  パワー: {
    [Grade.G]: 30,
    [Grade.F]: 30,
    [Grade.E]: 30,
    [Grade.D]: 40,
    [Grade.C]: 50,
    [Grade.B]: 70,
    [Grade.A]: 90,
    [Grade.S]: 0,
  },
  走力: {
    [Grade.G]: 20,
    [Grade.F]: 20,
    [Grade.E]: 20,
    [Grade.D]: 30,
    [Grade.C]: 40,
    [Grade.B]: 60,
    [Grade.A]: 80,
    [Grade.S]: 0,
  },
  守備: {
    [Grade.G]: 20,
    [Grade.F]: 20,
    [Grade.E]: 20,
    [Grade.D]: 30,
    [Grade.C]: 40,
    [Grade.B]: 60,
    [Grade.A]: 80,
    [Grade.S]: 0,
  },
  小技: {
    [Grade.G]: 20,
    [Grade.F]: 20,
    [Grade.E]: 20,
    [Grade.D]: 30,
    [Grade.C]: 40,
    [Grade.B]: 60,
    [Grade.A]: 80,
    [Grade.S]: 0,
  },
  精神: {
    [Grade.G]: 20,
    [Grade.F]: 20,
    [Grade.E]: 20,
    [Grade.D]: 30,
    [Grade.C]: 40,
    [Grade.B]: 60,
    [Grade.A]: 80,
    [Grade.S]: 0,
  },
};

export const StatusNames = [
  "ミート",
  "パワー",
  "走力",
  "守備",
  "小技",
  "精神",
  // TODO 投手分
] as const;
export type StatusType = typeof StatusNames[number];

export type StatusSet = {
  [key in StatusType]: number;
};

/**
 * ポイント→ABC評価変換
 * @param point
 * @return [current, next]
 */
export function evalGrade(point: number): [Grade, Grade] {
  if (isNaN(point) || point <= 0) return [Grade.G, Grade.F];

  let next = Grade.S;
  for (const g in GradeMin) {
    if (point >= GradeMin[g]) return [g as Grade, next];
    next = g as Grade;
  }
  // 来ることはないけど
  window.console.error("bug");
  return [Grade.G, Grade.F];
}

/**
 * 当該ポイントに到達するまでに必要なEXPを計算する
 * @param type
 * @param pointOrGrade
 * @param currentPoint
 * @param currentExpFraction
 */
export function calcExp(
  type: StatusType,
  pointOrGrade: number | Grade,
  currentPoint: number = 1,
  currentExpFraction: number = 0
): number {
  const table = ExpTable[type];
  let totalExp = 0;

  let goalPoint: number;
  if (typeof pointOrGrade !== "number") {
    goalPoint = GradeMin[pointOrGrade as Grade];
  } else {
    goalPoint = pointOrGrade as number;
  }

  while (currentPoint < goalPoint) {
    // グレードを上げながらループしていく
    const [grade, nextGrade] = evalGrade(currentPoint);
    const thisGradeExpConsumptionPerPoint = table[grade];
    const nextGradeMinPoint = GradeMin[nextGrade];
    const upPoint =
      goalPoint < nextGradeMinPoint
        ? goalPoint - currentPoint // このグレードで確定
        : nextGradeMinPoint - currentPoint; // このグレードの天井まで上げて次へ
    totalExp += upPoint * thisGradeExpConsumptionPerPoint;
    currentPoint += upPoint;
  }

  return totalExp - currentExpFraction;
}
