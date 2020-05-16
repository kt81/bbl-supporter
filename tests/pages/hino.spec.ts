import {mount, createLocalVue} from "@vue/test-utils";
import Vuetify from "vuetify";
import {HinoCommentType} from "~/models/pattern";
import HinoPage from "~/pages/hino.vue";

const localVue = createLocalVue();

describe("日野研ページ", () => {
  const baseOptions = () => ({
    localVue,
    vuetify: new Vuetify(),
  });

  test("何もしてない状態ではラベルは空", () => {
    const page = mount(HinoPage, baseOptions());
    const label = page.find("#hino-growth-type-labels");
    expect(label.exists()).toBeFalsy();
  });

  test("8〜10で変わらないに設定するとじぞじぞと普通持続が表示される", async () => {
    const page = mount(HinoPage, baseOptions());
    const textarea = page.find("#hino-numbers-textarea");
    expect(textarea.exists()).toBeTruthy();
    const select = page.find("#hino-growth-comment-select");
    expect(select.exists()).toBeTruthy();
    const btn = page.find("#hino-submit-btn");
    expect(btn.exists()).toBeTruthy();
    // ↑前提

    const hinoComment = "変わらない" as HinoCommentType;
    await textarea.setValue("8 10 9 10 8 9 \n10"); // てきとう
    await select.setValue(hinoComment);
    await btn.trigger("click");

    const label = page.find("#hino-growth-type-labels");
    expect(label.exists()).toBeTruthy();
    expect(label.element.textContent).toContain("持続"); // 普通(持続)も含まれてしまうが、、、
    expect(label.element.textContent).toContain("普通(持続)");
  });
});
