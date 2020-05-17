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
    return {
      currentStatus: {} as StatusSet,
      goalStatus: {} as StatusSet,
      requiredExpMap: {} as ExpMap,
      goalExpMap: {} as ExpMap,
      StatusNames,
      dialog: false,
      showingResult: false,
      resultText: "",
    };
  },
  computed: {},
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
      this.updateHandler();
      this.showResult("データをロードしました");
    },
    clearSettings() {
      localStorage.removeItem("currentStatus");
      localStorage.removeItem("goalStatus");
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
