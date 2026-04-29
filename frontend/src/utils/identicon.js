// src/utils/identicon.js
// Generates a GitHub-style 5x5 pixel identicon from a string (email/id)

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function intToRGB(hash) {
  const h = (hash % 360);
  return `hsl(${h}, 55%, 45%)`;
}

/**
 * Returns a 5x5 boolean grid (mirrored left-right like GitHub)
 * and a color string, derived from the input string.
 */
export function generateIdenticon(str) {
  const input = (str || "user").toLowerCase().trim();
  const hash = hashString(input);

  // 5 columns, but only generate left 3, mirror to right
  const grid = [];
  for (let row = 0; row < 5; row++) {
    const rowArr = [];
    for (let col = 0; col < 5; col++) {
      // Mirror: col 0↔4, col 1↔3, col 2 is center
      const mirrorCol = col < 3 ? col : 4 - col;
      const index = row * 3 + mirrorCol;
      const bit = (hash >> index) & 1;
      rowArr.push(bit === 1);
    }
    grid.push(rowArr);
  }

  const color = intToRGB(hash);
  return { grid, color };
}