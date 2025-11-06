function sqr(x) {
  return x * x;
}

function distanceBetween(p1, p2) {
  const deltaX = p1[0] - p2[0];
  const deltaY = p1[1] - p2[1];
  return Math.sqrt(sqr(deltaX) + sqr(deltaY));
}

function drawCircle(width, height, cx, cy, radius) {
  const lines = [];

  for (let h = 0; h < height; h++) {
    let line = '';
    for (let w = 0; w < width; w++) {
      const d = distanceBetween([w, h], [cx, cy]);
      const char = d <= radius ? '⬜️' : '⬛️';
      line += char;
    }
    lines.push(line);
  }

  return lines.join('\n');
}

function main(args) {
  const width = +args[0] || 30;
  const height = +args[1] || 30;
  const cx = +args[2] || 15;
  const cy = +args[3] || 15;
  const radius = +args[4] || 13;
  console.log(drawCircle(width, height, cx, cy, radius));
}

main(Deno.args);