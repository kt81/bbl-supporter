<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-center">
        <logo />
      </div>
      <v-card>
        <v-card-title class="headline">
          BBLサポーター
        </v-card-title>
        <v-card-text>
          <p>
            BBLをプレイするうえでの諸々を色々してくれるやつです
          </p>
          <hr class="my-3" />
          <br />
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import Logo from "~/components/Logo.vue";

export default {
  components: {
    Logo,
  },
};
</script>
