<template>
  <div class="logo">
    <img src="yakiu.jpg" alt="Supporter" />
  </div>
</template>

<style scoped>
.logo {
  display: inline-block;
  animation: turn 0.5s linear infinite;
  transform: rotateY(180deg);
  position: relative;
  overflow: hidden;
  height: 180px;
  width: 245px;
}

@keyframes turn {
  100% {
    transform: rotateX(0deg);
  }
}

@keyframes godown {
  100% {
    top: 180px;
  }
}

@keyframes goright {
  100% {
    left: 70px;
  }
}
</style>
