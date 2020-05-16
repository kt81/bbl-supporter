import Pattern, {GrowthType, ReasonMulti} from "~/models/pattern";

describe("Search Growth Pattern", () => {
  test("8〜10だけだと持続系2種", () => {
    const [actual, reason] = Pattern.searchGrowthPattern(8, 10, "変わらない");
    const expects = ["持続", "普通(持続)"] as GrowthType[];
    const expectedReason = "2年後に確定" as ReasonMulti;
    // 順序は気にしないのでsortしてしまうぞ
    expect(actual.sort()).toEqual(expects.sort());
    expect(reason).toBe(expectedReason);
  });
  test("8〜10で伸びなくなるみたいなあり得ないパターンは何も返らない", () => {
    const [actual] = Pattern.searchGrowthPattern(8, 10, "伸びなくなる");
    expect(actual).toEqual([]);
  });
  test("普通早は1個だけ確定で解る", () => {
    const [actual] = Pattern.searchGrowthPattern(9, 12, "もっと伸びる");
    const expects = ["普通早"] as GrowthType[];
    expect(actual.sort()).toEqual(expects.sort());
  });
});
