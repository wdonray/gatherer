export function aStar(gridManager) {
  const grid = gridManager.grid;
  const openSet = new Set([gridManager.startCell]);
  const closedSet = new Set();
  const gScore = new Map().set(gridManager.startCell.node, 0);
  const fScore = new Map().set(
    gridManager.startCell.node,
    heuristic(gridManager.startCell.node, gridManager.endCell.node)
  );

  console.log({ gScore, fScore });

  while (openSet.size > 0) {
    const current = [...openSet].sort(
      (a, b) => fScore.get(a.node) - fScore.get(b.node)
    )[0];

    console.log(current);

    if (current.node.equals(gridManager.endCell.node))
      return reconstructPath(current);

    openSet.delete(current);
    closedSet.add(current);
    for (const neighbor of getNeighbors(current.node, grid)) {
      if (closedSet.has(neighbor)) continue;

      const g = gScore.get(current.node) + 1;
      if (!openSet.has(neighbor)) openSet.add(neighbor);
      else if (g >= gScore.get(neighbor.node)) continue;

      neighbor.parent = current;
      gScore.set(neighbor.node, g);
      fScore.set(
        neighbor.node,
        g + heuristic(neighbor.node, gridManager.endCell.node)
      );
    }
  }

  return null;
}
function reconstructPath(current) {
  const path = [current];
  while (current.parent) {
    path.unshift(current.parent);
    current = current.parent;
  }
  return path;
}

export function getNeighbors(node, grid) {
  const neighbors = [];
  const { x, y } = node;
  if (grid[x - 1]?.[y]) neighbors.push(grid[x - 1][y]);
  if (grid[x + 1]?.[y]) neighbors.push(grid[x + 1][y]);
  if (grid[x]?.[y - 1]) neighbors.push(grid[x][y - 1]);
  if (grid[x]?.[y + 1]) neighbors.push(grid[x][y + 1]);
  if (grid[x - 1]?.[y - 1]) neighbors.push(grid[x - 1][y - 1]);
  if (grid[x - 1]?.[y + 1]) neighbors.push(grid[x - 1][y + 1]);
  if (grid[x + 1]?.[y - 1]) neighbors.push(grid[x + 1][y - 1]);
  if (grid[x + 1]?.[y + 1]) neighbors.push(grid[x + 1][y + 1]);

  return neighbors.filter((neighbor) => !neighbor.isStone);
}

function heuristic(node1, node2) {
  const dx = Math.abs(node1.x - node2.x);
  const dy = Math.abs(node1.y - node2.y);
  return dx + dy;
}
