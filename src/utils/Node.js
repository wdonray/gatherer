export class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  distanceTo(other) {
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  equals(other) {
    return other.x == this.x && other.y == this.y;
  }

  display() {
    return `(${this.x},${this.y})`;
  }

  moveTo(target, speed, deltaTime) {
    this.x += (target.x - this.x) * speed * deltaTime.value;
    this.y += (target.y - this.y) * speed * deltaTime.value;
  }
}
