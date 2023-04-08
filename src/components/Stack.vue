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
  <div class="stack">
    <slot />
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  gap: v-bind("gapSize");
  flex-direction: column;
}
:deep(> *) {
  margin: 0;
}
</style>
