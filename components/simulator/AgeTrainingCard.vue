<template>
  <v-card :color="periodColor" outlined>
    <v-card-title class="py-0 px-2">{{ age }}〜{{ Number(age) + 1 }}歳</v-card-title>
    <v-card-text class="py-0 px-2">
      <v-row class="px-3">
        <v-col
          v-for="sType in StatusNames"
          :key="sType"
          cols="2"
          style="min-width: 65px"
          class="py-0 px-1"
        >
          <v-text-field
            :label="sType"
            hide-details
            dense
            type="number"
            min="0"
            max="60"
            class="pa-0"
            :value="lazyValue[sType]"
            @input="update(sType, $event)"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="pa-2">
          <div
            v-for="sType in StatusNames"
            :key="sType"
            class="pa-0 text-center d-inline-block"
            style="width:50px"
          >
            <small>{{ sType }}</small>
            <br />
            <grade-label v-bind="resultSet.statusSet[sType]" />
            {{ resultSet.statusSet[sType] }}
            :
            {{ resultSet.expSet[sType] }}
            <br />
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue, {PropOptions, PropType} from "vue";
import GradeLabel from "~/components/GradeLabel.vue";
import {StatusSet, StatusNames, StatusType} from "~/models/status";
import {GrowthPatternByAgeMaster, GrowthType, PeriodColorMap} from "~/models/pattern";
import {calcAfterTrainingStatus, ExpSet, TrainingResultSet, TrainingSet} from "~/models/training";

export default Vue.extend({
  components: {
    GradeLabel,
  },
  props: {
    initStatus: {
      type: Object,
      required: true,
    } as PropOptions<StatusSet>,
    initExpFraction: {
      type: Object,
      required: true,
    } as PropOptions<ExpSet>,
    growthType: {
      type: String,
      required: true,
    } as PropOptions<GrowthType>,
    age: {
      type: Number,
      required: true,
    },
    ap: {
      type: String,
      required: true,
    } as PropOptions<StatusType>,
    value: {
      type: Object as PropType<TrainingSet>,
      default: () => ({} as TrainingSet),
    },
  },
  data() {
    return {
      StatusNames,
      lazyValue: {} as TrainingSet,
    };
  },
  computed: {
    periodColor(): string {
      const ageUnit = Math.floor(Number(this.age) / 2) * 2;
      const pattern = GrowthPatternByAgeMaster[this.growthType as GrowthType][ageUnit];
      return PeriodColorMap[pattern];
    },
    resultSet(): TrainingResultSet {
      return calcAfterTrainingStatus(
        this.age,
        this.ap,
        this.growthType,
        this.initStatus,
        this.initExpFraction,
        this.lazyValue
      );
    },
  },
  watch: {
    value() {
      this.lazyValue = {...this.value};
    },
  },
  methods: {
    update(key: StatusType, payload: string) {
      this.lazyValue[key] = parseInt(payload);
      this.$emit("input", this.lazyValue);
    },
  },
});
</script>
