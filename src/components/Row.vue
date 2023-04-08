<script setup>
import { computed } from "vue";
const props = defineProps({
  gap: {
    type: String,
    default: "1rem",
  },
});
const gapSize = computed(() => props.gap);
</script>

<template>
  <div class="row">
    <slot />
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: v-bind("gapSize");
  flex-direction: row;
}
:deep(> *) {
  margin: 0;
}
</style>
