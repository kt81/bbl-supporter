<template>
  <v-row>
    <v-col
      v-for="pType in StatusNames"
      :key="pType"
      :class="[$style.statusInput, {'px-1': true}]"
    >
      <grade-label :value="value[pType]" />
      <v-text-field
        v-model.number="value[pType]"
        outlined
        filled
        dense
        :label="pType"
        type="number"
        aria-valuemax="100"
        @input="update"
        @change="update"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import GradeLabel from "~/components/GradeLabel.vue";
import {StatusNames, StatusSet, StatusType} from "~/models/status";

export default Vue.extend({
  components: {GradeLabel},
  data: () => ({
    value: {} as StatusSet,
    StatusNames,
  }),
  // watch: {
  //   value: {
  //     handler(val: StatusSet) {
  //       for (const k in val) {
  //         const key = k as StatusType;
  //         if (val[key] <= 0) val[key] = 1;
  //         if (val[key] > 100) val[key] = 100;
  //       }
  //     },
  //     deep: true,
  //   },
  // },
  methods: {
    update() {
      const val = this.$data.value;
      for (const k in val) {
        const key = k as StatusType;
        if (val[key] <= 0) val[key] = 1;
        if (val[key] > 100) val[key] = 100;
      }
      this.$emit("input", val);
    },
  },
});
</script>

<style module lang="scss">
.statusInput {
  max-width: 90px;
}
</style>
