<template>
  <section>
    <v-container>
      <v-row>
        <v-col cols="12" md="8">
          <p>日野研10回で出た数値（半角数字）</p>
          <v-textarea
            id="hino-numbers-textarea"
            v-model="hino"
            outlined
            label="日野研の数字（改行かスペース区切り）"
            placeholder="例) 8 10 9 8 8 9 ... "
          ></v-textarea>
          <p>
            <small class="grey--text">
              出た最大値と最小値だけでも正確に判別できます (例：8 10）
            </small>
          </p>
          <v-select
            id="hino-growth-comment-select"
            v-model="hinoComment"
            :items="HinoComments"
            label="二年後のコメントを選んで下さい"
          ></v-select>
          <v-btn id="hino-submit-btn" @click.prevent="onHinoSubmit"
            >型判別</v-btn
          >
        </v-col>
      </v-row>

      <v-row v-if="candidates.length > 0">
        <p :class="$style.result">
          あなたの成長型は ...
          <span id="hino-growth-type-labels" :class="$style.growthType">{{
            candidates.join(", ")
          }}</span>
          です
          <span v-if="reasonMulti">({{ reasonMulti }})</span>
        </p>
      </v-row>
      <v-row v-if="isNotFound">
        <p :class="$style.result">
          適合する型が見つかりませんでした。入力ミスが無いか確認してください
        </p>
      </v-row>
    </v-container>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Pattern, {GrowthType, HinoComments} from "~/models/pattern";

const HINO_DELIMITER = " ";
export default Vue.extend({
  data: () => ({
    hino: "",
    hinoComment: {
      type: "string",
    },
    reasonMulti: {
      type: "string",
    },
    HinoComments,
    candidates: [] as GrowthType[],
    isNotFound: false,
  }),
  methods: {
    onHinoSubmit() {
      const tokens = this.$data.hino
        .replace("\n", HINO_DELIMITER)
        .split(HINO_DELIMITER);
      const nums = tokens
        .filter((x: string) => x !== "")
        .map(Number)
        .filter((x: number) => !isNaN(x));
      if (nums.length === 0) {
        window.console.error("malformed string");
        return;
      }
      const min = Math.min(...nums);
      const max = Math.max(...nums);
      const comment = this.$data.hinoComment;
      if (comment === undefined) return;
      [
        this.$data.candidates,
        this.$data.reasonMulti,
      ] = Pattern.searchGrowthPattern(min, max, comment);
      this.$data.isNotFound = this.$data.candidates.length === 0;
    },
  },
});
</script>

<!--suppress CssUnusedSymbol -->
<style module>
.growthType {
  font-size: larger;
  font-weight: bold;
  color: darkorchid;
}
.result {
  margin: 15px;
}
</style>
