<template>
  <v-container class="py-0">
    <v-row class="status-input-max-width">
      <v-col
        v-for="pType in StatusNames"
        :key="pType"
        :cols="2"
        class="no-gutters pa-1 min-input-width"
      >
        <grade-label :value="lazyValue[pType]" />
        <v-text-field
          outlined
          dense
          :label="pType"
          type="number"
          aria-valuemax="100"
          hide-details
          :value="lazyValue[pType]"
          @input="update(pType, $event)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue, {PropType} from "vue";
import GradeLabel from "~/components/GradeLabel.vue";
import {StatusNames, StatusSet, StatusType} from "~/models/status";

export default Vue.extend({
  components: {GradeLabel},
  props: {
    value: {
      type: Object as PropType<StatusSet>,
      default: () => ({} as StatusSet),
    },
  },
  data: () => ({
    lazyValue: {} as StatusSet,
    StatusNames,
  }),
  watch: {
    value() {
      this.lazyValue = {...this.value};
    },
  },
  methods: {
    update(key: StatusType, payload: string) {
      this.lazyValue[key] = parseInt(payload);
      if (this.lazyValue[key] <= 0) this.lazyValue[key] = 1;
      if (this.lazyValue[key] > 100) this.lazyValue[key] = 100;
      this.$emit("input", this.lazyValue);
    },
  },
});
</script>

<style scoped lang="scss">
.status-input-max-width {
  max-width: 600px;
}
.min-input-width {
  min-width: 90px;
}
</style>
