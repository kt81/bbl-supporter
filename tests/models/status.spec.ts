import {calcExp, evalGrade, Grade} from "~/models/status";

describe("Gradeテスト", () => {
  test("ポイント14はGになる", () => {
    const [curr, next] = evalGrade(14);
    expect(curr).toBe(Grade.G);
    expect(next).toBe(Grade.F);
  });
  test("ポイント15はFになる", () => {
    const [curr, next] = evalGrade(15);
    expect(curr).toBe(Grade.F);
    expect(next).toBe(Grade.E);
  });
  test("ポイント20はFになる", () => {
    const [curr, next] = evalGrade(20);
    expect(curr).toBe(Grade.F);
    expect(next).toBe(Grade.E);
  });
  test("ポイント90はAになる", () => {
    const [curr, next] = evalGrade(90);
    expect(curr).toBe(Grade.A);
    expect(next).toBe(Grade.S);
  });
  test("ポイント99はAになる", () => {
    const [curr, next] = evalGrade(99);
    expect(curr).toBe(Grade.A);
    expect(next).toBe(Grade.S);
  });
  describe("ポイント100以上ではcurrentもnextもSになる", () => {
    test("100でS、S", () => {
      const [curr, next] = evalGrade(100);
      expect(curr).toBe(Grade.S);
      expect(next).toBe(Grade.S);
    });
    test("101でS、S", () => {
      const [curr, next] = evalGrade(101);
      expect(curr).toBe(Grade.S);
      expect(next).toBe(Grade.S);
    });
  });
});

describe("経験値計算 (calcExp)", () => {
  test("数値指定で計算できる。G1から14までミートを上げるのに30*13必要", () => {
    const exp = calcExp("ミート", 14, 1, 0);
    expect(exp).toBe(30 * 13);
  });
  test("グレード指定で計算できる。G1からF(15)までミートを上げるのに30*14必要", () => {
    const exp = calcExp("ミート", Grade.F, 1, 0);
    expect(exp).toBe(30 * 14);
  });
  test("端数EXPを盛り込める。G1からF(15)までミートを上げるのに30*14-端数15必要", () => {
    const fraction = 15;
    const exp = calcExp("ミート", Grade.F, 1, fraction);
    expect(exp).toBe(30 * 14 - fraction);
  });
  test("成長途中からの計算ができる F20->D45", () => {
    const exp = calcExp("ミート", Grade.D, 20);
    // Fは15からなので既に5上がってる扱い、残りは10
    expect(exp).toBe(30 * 10 + 30 * 15);
  });
  test("F20からC60までミートを上げるのに30*15(F)+30*15(E)+50*15(D)必要", () => {
    const exp = calcExp("ミート", Grade.C, 20, 0);
    expect(exp).toBe(30 * 10 + 30 * 15 + 50 * 15);
  });
  test("パワーの計算結果はミートと違う F20->C60", () => {
    const exp = calcExp("パワー", Grade.C, 20);
    expect(exp).toBe(30 * 10 + 30 * 15 + 40 * 15);
  });
  test("F20からS100まで上げるのに正しく計算できる", () => {
    const exp = calcExp("ミート", Grade.S, 20, 0);
    expect(exp).toBe(
      30 * 10 + // F
      30 * 15 + // E
      50 * 15 + // D
      70 * 15 + // C
      90 * 15 + // B
        100 * 10 // A
    );
  });
});
