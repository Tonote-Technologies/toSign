<template>
  <div class="lds-ellipsis">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<script setup></script>

<style scoped>
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}

.lds-ellipsis div {
  position: absolute;
  top: 33px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #003bb3;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}

.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}

.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}

.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}

.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}

@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(0);
  }
}

@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(24px, 0);
  }
}

/* .preloader {
  position: relative;
  width: 125px;
  height: 125px;
  margin: auto;
  transform: scale(var(--scale));
}

.preloader>span {
  position: absolute;
  background-color: transparent;
  height: 22px;
  width: 22px;
  border-radius: 12px;
  animation-name: f_fadeG;
  animation-duration: 1.2s;
  animation-iteration-count: infinite;
  animation-direction: normal;
}

.rot-1 {
  left: 0;
  top: 51px;
  animation-delay: 0.45s;
}

.rot-2 {
  left: 15px;
  top: 15px;
  animation-delay: 0.6s;
}

.rot-3 {
  left: 51px;
  top: 0;
  animation-delay: 0.75s;
}

.rot-4 {
  right: 15px;
  top: 15px;
  animation-delay: 0.9s;
}

.rot-5 {
  right: 0;
  top: 51px;
  animation-delay: 1.05s;
}

.rot-6 {
  right: 15px;
  bottom: 15px;
  animation-delay: 1.2s;
}

.rot-7 {
  left: 51px;
  bottom: 0;
  animation-delay: 1.35s;
}

.rot-8 {
  left: 15px;
  bottom: 15px;
  animation-delay: 1.5s;
}

@keyframes f_fadeG {
  0% {
    background-color: var(--color);
  }

  100% {
    background-color: transparent;
  }
} */
</style>
