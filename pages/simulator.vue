<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <p>すまんけど野手にしか対応してへんで</p>
        <h2>現在の値</h2>
        <status-inputs v-model="currentStatus" class="mb-5" @input="updateHandler" />
        <h2>目標とする値</h2>
        <status-inputs v-model="goalStatus" class="mb-5" @input="updateHandler" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="py-0">
        <v-btn color="primary my-1" @click.stop="saveSettings">ブラウザにセーブ</v-btn>
        <v-btn color="secondary my-1" @click.stop="loadSettings">ロード</v-btn>
        <v-dialog v-model="dialog" width="500">
          <template v-slot:activator="{on}">
            <v-btn color="red lighten-2 my-1" dark v-on="on">
              セーブクリア
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="headline grey lighten-2 mb-4">
              <v-icon color="orange" class="mr-1" large>mdi-alert-circle-outline</v-icon>
              データを完全に消そうとしています
            </v-card-title>
            <v-card-text>
              ブラウザにセーブした内容も入力フィールドの中身も両方消えます。<br />
              ほんまにええんか？
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" text @click="clearSettings">
                クリア
              </v-btn>
              <v-btn color="secondary" text @click="dialog = false">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-row class="mt-10">
      <v-col cols="12">
        <h2>必要経験値</h2>
        <v-simple-table dense>
          <thead>
            <tr>
              <th></th>
              <th v-for="sType in StatusNames" :key="sType">{{ sType }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Total</th>
              <td v-for="sType in StatusNames" :key="sType">{{ goalExpMap[sType] }}</td>
            </tr>
            <tr>
              <th>Diff</th>
              <td v-for="sType in StatusNames" :key="sType">
                {{ requiredExpMap[sType] }}
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="12">
        <h2>練習シミュ</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="4" align-self="end">
        <v-select
          v-model="growthType"
          class="mb-5"
          label="成長型"
          hide-details
          :items="GrowthTypeNames"
        ></v-select>
      </v-col>
      <v-col :cols="4" align-self="end">
        <v-slider
          v-model="age"
          class="mb-5"
          min="18"
          max="35"
          thumb-label="always"
          label="現在年齢"
          hide-details
        ></v-slider>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h3>成長曲線</h3>
        <v-sparkline
          auto-draw
          :labels="growthLabels"
          :label-size="5"
          color="grey lighten-1"
          :value="growthLine"
          :smooth="5"
          :gradient="graphGradient"
          gradient-direction="bottom"
        ></v-sparkline>
      </v-col>
    </v-row>
    <v-snackbar v-model="showingResult" color="info" :timeout="3000" top>
      {{ resultText }}
      <v-btn text @click="closeResult">
        Close
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import _ from "lodash";
import {calcExp, StatusNames, StatusSet, StatusType} from "~/models/status";
import StatusInputs from "~/components/StatusInputs.vue";
import {
  GrowthPatternByAgeMaster,
  GrowthType,
  GrowthTypeNames,
  Period,
  PeriodColorMap,
  PeriodNames,
} from "~/models/pattern";
import PatternMaster from "~/models/pattern-master";

type ExpMap = {
  [key in StatusType]: number;
};
export default Vue.extend({
  name: "Simulator",
  components: {
    StatusInputs,
  },
  data() {
    const graphGradient = PeriodNames.map((p) => PeriodColorMap[p as Period]);
    return {
      currentStatus: {} as StatusSet,
      goalStatus: {} as StatusSet,
      requiredExpMap: {} as ExpMap,
      goalExpMap: {} as ExpMap,
      StatusNames,
      GrowthTypeNames,
      dialog: false,
      showingResult: false,
      resultText: "" as string,
      growthType: "" as GrowthType,
      age: 18,
      GrowthPatternByAgeMaster,
      PeriodColorMap,
      graphGradient,
    };
  },
  computed: {
    /**
     * 非AP大の最小値でてきとうにグラフ用の値を作る
     */
    growthLine(): number[] {
      if (!this.growthType) return [];
      const growthMap = GrowthPatternByAgeMaster[this.growthType];
      const res = [] as number[];
      for (let i = 18; i <= 35; ++i) {
        const gt = growthMap[i] as Period;
        const mst = PatternMaster[gt];
        res.push(mst.非AP大[0]);
      }
      return res;
    },
    growthLabels(): any[] {
      return _.range(18, 36);
      // ラベルに成長期も入れようとしてた名残。（みっちりするので解決策がみつかるまでやめた）
      // if (!this.growthType) return range;
      // const growthMap = GrowthPatternByAgeMaster[this.growthType];
      // return range.map((age) => {
      //   return `${age}歳`;
      // });
    },
  },
  mounted() {
    this.loadSettings();
  },
  methods: {
    updateHandler() {
      for (const s in StatusNames) {
        const type = StatusNames[s];
        const current = this.currentStatus[type];
        const goal = this.goalStatus[type];
        this.$data.goalExpMap[type] = calcExp(type, goal);
        this.$data.requiredExpMap[type] = calcExp(type, goal, current);
      }
    },
    saveSettings() {
      localStorage.currentStatus = JSON.stringify(this.currentStatus);
      localStorage.goalStatus = JSON.stringify(this.goalStatus);
      localStorage.growthType = this.growthType;
      localStorage.age = this.age;
      this.showResult("セーブしました");
    },
    loadSettings() {
      const current = localStorage.currentStatus;
      const goal = localStorage.goalStatus;
      if (!current || !goal) {
        return;
      }
      this.currentStatus = JSON.parse(current) as StatusSet;
      this.goalStatus = JSON.parse(goal) as StatusSet;
      this.growthType = localStorage.growthType;
      this.age = localStorage.age;
      this.updateHandler();
      this.showResult("データをロードしました");
    },
    clearSettings() {
      localStorage.removeItem("currentStatus");
      localStorage.removeItem("goalStatus");
      localStorage.removeItem("growthType");
      localStorage.removeItem("age");
      this.currentStatus = {} as StatusSet;
      this.goalStatus = {} as StatusSet;
      this.dialog = false;
      this.showResult("セーブをクリアしました");
    },
    showResult(message: string) {
      this.resultText = message;
      this.showingResult = true;
    },
    closeResult() {
      this.showingResult = false;
      this.resultText = "";
    },
  },
});
</script>
