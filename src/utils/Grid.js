import { getNeighbors } from "./AStar";
import { Node } from "./Node";
import { selectRandomType } from "./RandomSelection";

export class GridManager {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;

    this.nodeType = {
      NORMAL_TYPE: "normal",
      STONE_TYPE: "stone",
      TREE_TYPE: "tree",
    };

    this.typeOptions = [
      { type: this.nodeType.NORMAL_TYPE, chance: 94 },
      { type: this.nodeType.STONE_TYPE, chance: 4 },
      { type: this.nodeType.TREE_TYPE, chance: 6 },
    ];

    this.createGrid();
  }

  findCellFromNode(node) {
    return this.grid.flat().find((item) => item.node.equals(node));
  }

  setCellType(cell, type) {
    cell.type = type;
  }

  setNodes(startCell, endCell) {
    this.startCell = startCell;
    this.endCell = endCell;

    console.log(this.startCell, this.endCell);
  }

  getCellTypeLength(type) {
    return this.grid.flat().filter((cell) => cell.type == type).length;
  }

  getRandomCell() {
    const x = Math.floor(Math.random() * this.grid.length);
    const y = Math.floor(Math.random() * this.grid[x].length);
    return this.grid[x][y];
  }

  getNearestTreeCell(node) {
    return this.grid
      .flat()
      .filter((cell) => cell.type == "tree")
      .sort((a, b) => {
        const distanceA = a.node.distanceTo(node);
        const distanceB = b.node.distanceTo(node);
        return distanceA - distanceB;
      })[0];
  }

  getNearestTreeCellFromCurrentNode(node) {
    const nearestNeighbors = getNeighbors(
      this.getNearestTreeCell(node).node,
      this.grid
    )
      .filter((node) => node.type == "normal")
      .sort((a, b) => {
        const distanceA = a.node.distanceTo(node);
        const distanceB = b.node.distanceTo(node);
        return distanceA - distanceB;
      });

    return nearestNeighbors[0];
  }

  createGrid() {
    this.grid = [];

    for (let x = 0; x < this.rows; x++) {
      const row = [];

      for (let y = 0; y < this.cols; y++) {
        row.push({
          node: new Node(x, y),
          type: selectRandomType(this.typeOptions),
        });
      }

      this.grid.push(row);
    }

    this.startCell = this.getRandomCell();
    this.endCell = this.getNearestTreeCellFromCurrentNode(this.startCell.node);

    return this.grid;
  }
}
