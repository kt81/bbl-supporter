/*
 * tsのテストで、jestがvueを読めない問題対策。ついでにIDEも一緒に直る
 */
declare module "*.vue" {
  import Vue from "vue";
  // noinspection JSDuplicatedDeclaration,JSUnusedGlobalSymbols
  export default Vue;
}
// noinspection JSUnusedGlobalSymbols
/**
 * CSS module形式でstyleを書いたときにコンポーネント内に発生するやつ
 */
declare const $style: {[index: string]: boolean};
