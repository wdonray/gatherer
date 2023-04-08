<script setup>
import Row from "./Row.vue";
import { watch, toRef, reactive, computed, ref } from "vue";
import { GridManager } from "../utils/Grid.js";
import { aStar } from "../utils/AStar.js";
import { Entity } from "../utils/Entity";

const props = defineProps({
  rows: { type: Number, required: true },
  cols: { type: Number, required: true },
});

const rows = toRef(props, "rows");
const cols = toRef(props, "cols");
const cellSize = 30;
const cellSizePx = computed(() => `${cellSize}px`);

const controller = reactive({
  grid: null,
  manager: new GridManager(rows.value, cols.value),
  path: null,
});

const entity = reactive(new Entity());
const stepping = ref(null);

watch([rows, cols], () => gridReset(), { immediate: true });

function nodeExistInPath(node) {
  return controller.path.some((cell) => cell.node.equals(node));
}

function isStartNode(node) {
  return controller.manager.startCell.node.equals(node);
}

function isEndNode(node) {
  return controller.manager.endCell.node.equals(node);
}

function isEntity(node) {
  return entity.node.equals(node);
}

function buildGrid() {
  controller.manager = new GridManager(rows.value, cols.value);
  entity.node = controller.manager.startCell.node;
  controller.grid = controller.manager.grid;
  controller.path = aStar(controller.manager);
}

function entityStep() {
  if (entity.node.equals(controller.manager.endCell.node)) {
    const nearestTreeCell = controller.manager.getNearestTreeCell(entity.node);

    if (!nearestTreeCell || entity.inInventory(nearestTreeCell)) {
      gridReset();
      return;
    }

    entity.collectWood(nearestTreeCell);

    controller.manager.setCellType(
      nearestTreeCell,
      controller.manager.nodeType.NORMAL_TYPE
    );

    const nextEndCell = controller.manager.getNearestTreeCellFromCurrentNode(
      entity.node
    );
    const entityCell = controller.manager.findCellFromNode(entity.node);

    controller.manager.setNodes(entityCell, nextEndCell);
    controller.path = aStar(controller.manager);

    clearInterval(stepping.value);

    return setTimeout(() => {
      stepping.value = setInterval(() => entityStep(), 50 * entity.speed);
    }, 2000);
  }

  if (entity.index > controller.path.length) {
    return;
  }

  entity.step(controller.path[entity.index].node);
}

function gridReset() {
  clearInterval(stepping.value);
  Object.assign(entity, new Entity());

  buildGrid();

  stepping.value = setInterval(() => entityStep(), 50 * entity.speed);
}
</script>

<template>
  <div class="grid-info">
    <span>Grid size: {{ rows }}x{{ cols }}</span>
    <span class="info-path" v-if="controller.path?.length"
      >Path distance: {{ controller.path.length - 2 }}</span
    >
    <span class="info-entity">Entity: {{ entity.node.display() }}</span>
    <span class="info-entity"
      >Entity Inventory: {{ entity.inventory.length }}</span
    >
    <span>Trees: {{ controller.manager.getCellTypeLength("tree") }}</span>
    <span>Stones: {{ controller.manager.getCellTypeLength("stone") }}</span>
  </div>

  <div class="grid">
    <Row v-for="(row, x) in controller.grid" :gap="0" :key="x">
      <div
        v-for="(cell, y) in row"
        :key="y"
        class="cell"
        :class="{
          entity: isEntity(cell.node),
          'start-node': isStartNode(cell.node),
          'end-node': isEndNode(cell.node),
          stone: cell.type == 'stone',
          tree: cell.type == 'tree',
          path:
            nodeExistInPath(cell.node) &&
            !isStartNode(cell.node) &&
            !isEndNode(cell.node),
        }"
      ></div>
    </Row>
  </div>
</template>

<style scoped lang="scss">
@mixin spriteCell {
  position: relative;
  overflow: hidden;
}

@mixin sprite {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: -50%;
  left: -50%;

  transform: translate(50%, 50%);
  z-index: -1;

  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.grid-info {
  color: white;
  font-size: medium;
  font-weight: bold;
  position: absolute;
  top: 10px;
  right: 100%;
  transform: translateX(110%);
  display: grid;
  gap: 0.5rem;
  grid-template-columns: 1fr;
  white-space: nowrap;

  border: 1px solid #d9dce1;
  border-radius: 0.2rem;
  padding: 10px;
}

.grid-info span:not([class]) {
  color: white;
}

.info-entity {
  color: rgb(3, 95, 172);
}

.info-path {
  color: #5d85c5;
}

.grid {
  display: flex;
  flex-direction: column;
  position: relative;
}

.cell {
  min-width: v-bind("cellSizePx");
  height: v-bind("cellSizePx");
  border: 2px solid rgb(25, 31, 44);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: x-small;
}

.stone {
  @include spriteCell();

  &::before {
    @include sprite();
    background-image: url("../assets/stone.png") !important;
  }
}

.tree {
  @include spriteCell();

  &::before {
    @include sprite();
    background-image: url("../assets/tree.png") !important;
  }
}

.start-node {
  border: 2px solid rgb(3, 95, 172) !important;
}

.end-node {
  border: 2px solid #762615 !important;
}

.path {
  background-color: #5d85c5;
}

.entity {
  background-color: yellow;
}
</style>
