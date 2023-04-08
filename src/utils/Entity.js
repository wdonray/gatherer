export class Entity {
  constructor() {
    this.speed = 10;
    this.index = 0;
    this.inventory = [];
  }

  step(node) {
    this.index++;
    this.node = node;
  }

  collectWood(cell) {
    this.inventory.push(cell);
    this.index = 0;
  }

  inInventory(cell) {
    return this.inventory.some((item) => item.node.equals(cell.node));
  }
}
