<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2>現在の値</h2>
        <status-inputs v-model="currentStatus" @input="updateHandler" />
        <h2>目標とする値</h2>
        <status-inputs v-model="goalStatus" @input="updateHandler" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h2>必要経験値</h2>
        <v-row>
          <v-btn @click="onSubmit">
            再計算する（自動で計算されないとき用）
          </v-btn>
        </v-row>
        <v-data-table
          disable-pagination
          :headers="headers"
          :items="[
            {
              name: 'トータル経験値',
              ...goalExpMap,
            },
            {
              name: '必要差分経験値',
              ...requiredExpMap,
            },
          ]"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {DataTableHeader} from "vuetify";
import {calcExp, StatusNames, StatusSet, StatusType} from "~/models/status";
import StatusInputs from "~/components/StatusInputs.vue";

type ExpMap = {
  [key in StatusType]: number;
};
export default Vue.extend({
  name: "Simulator",
  components: {
    StatusInputs,
  },
  data() {
    const headers: DataTableHeader[] = [
      {
        text: "",
        value: "name",
      },
      ...StatusNames.map((s) => ({
        text: s,
        value: s,
      })),
    ];

    return {
      currentStatus: {} as StatusSet,
      goalStatus: {} as StatusSet,
      requiredExpMap: {} as ExpMap,
      goalExpMap: {} as ExpMap,
      StatusNames,
      headers,
    };
  },
  computed: {},
  methods: {
    onSubmit() {
      this.updateHandler();
      window.console.log(this.$data.goalExpMap);
      window.console.log(this.$data.requiredExpMap);
    },
    updateHandler() {
      for (const s in StatusNames) {
        const type = StatusNames[s];
        const current = this.$data.currentStatus[type];
        const goal = this.$data.goalStatus[type];
        this.$data.goalExpMap[type] = calcExp(type, goal);
        this.$data.requiredExpMap[type] = calcExp(type, goal, current);
      }
    },
  },
});
</script>
