<script setup>
import { ref } from "vue";
import Grid from "../src/components/Grid.vue";

const cols = ref(getRandomNumber());
const rows = ref(getRandomNumber());

function getRandomNumber() {
  return Math.floor(Math.random() * 11) + 10;
}

function reset() {
  cols.value = getRandomNumber();
  rows.value = getRandomNumber();
}
</script>

<template>
  <div class="console">
    <div>
      <label for="rows">Rows</label>
      <input id="rows" v-model="rows" maxlength="2" />
    </div>

    <div>
      <label for="cols">Columns</label>
      <input id="cols" v-model="cols" maxlength="2" />
    </div>

    <button class="btn" @click="reset">Reset</button>
  </div>
  <main>
    <Grid :rows="rows" :cols="cols" />
  </main>
</template>

<style lang="scss">
body {
  background-color: rgb(34, 44, 58);
  margin: 0;
}

main {
  width: 100vw;
  height: 100vh;
  display: grid;
  justify-content: center;
  align-items: center;
}

.console {
  color: white;
  position: absolute;
  top: 10px;
  left: 100%;

  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  transform: translateX(-110%);

  border: 1px solid #d9dce1;
  border-radius: 0.2rem;
  padding: 10px;
}

.console input {
  display: block;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 12px;
  width: 100px;
}

.btn {
  text-align: center;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  padding: 0.5rem;
  border-radius: 3px;
  background-color: #1a98ff;
  color: white;
  border: 0;
  text-decoration: none;
  line-height: 1;
  transition: background-color 0.5s;

  &:hover {
    cursor: pointer;
    text-decoration: none;
    background-color: #0071d0;
  }

  &:active {
    transition: background-color 0s;
    background-color: #025da9;
  }

  &:focus-visible {
    outline-offset: 2px;
  }
}
</style>
