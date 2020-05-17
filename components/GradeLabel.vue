<template>
  <span
    :class="{
      gradeLabel: true,
      [grade]: true,
    }"
    >{{ grade }}</span
  >
</template>

<script lang="ts">
import Vue from "vue";
import {evalGrade} from "~/models/status";

export default Vue.extend({
  props: {
    value: {
      type: Number,
      default: undefined,
    },
  },
  computed: {
    grade() {
      return evalGrade(this.$props.value)[0];
    },
  },
});
</script>

<style lang="scss" scoped>
span.gradeLabel {
  font-weight: bold;
  color: #6a6a68; // default - G
}

span.S {
  color: #ffc0cb;
}

span.A {
  color: #d06da3;
}

span.B {
  color: #ff0000;
}

span.C {
  color: #de9610;
}

span.D {
  color: #f2cf01;
}

span.E {
  color: #a0c238;
}

span.F {
  color: #66b7ec;
}

span.G {
  color: #6a6a68;
}
</style>
