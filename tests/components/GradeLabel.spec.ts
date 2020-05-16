import {mount} from "@vue/test-utils";
import GradeLabel from "~/components/GradeLabel.vue";

test("Vue component can be loaded into jest test.", () => {
  const component = mount(GradeLabel, {
    propsData: {
      value: 1,
    },
  });
  expect(component.element.textContent).toBe("G");
});
