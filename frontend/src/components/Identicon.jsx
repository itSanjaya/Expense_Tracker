// src/components/Identicon.jsx
import { generateIdenticon } from "../utils/identicon";

/**
 * GitHub-style identicon avatar.
 * Props:
 *   seed      — string to generate the pattern from (email or userId)
 *   size      — pixel size (default 32)
 *   round     — border radius multiplier 0–1 (default 0.28, use 0.5 for circle)
 *   className — extra classes
 */
function Identicon({ seed, size = 32, round = 0.28, className = "" }) {
  const { grid, color } = generateIdenticon(seed || "user");

  const padding = Math.floor(size * 0.12);
  const innerSize = size - padding * 2;
  const cellSize = innerSize / 5;
  const rx = size * round;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ display: "block", flexShrink: 0 }}
    >
      <rect width={size} height={size} fill="#e4e4e7" rx={rx} />
      {grid.map((row, rowIdx) =>
        row.map((filled, colIdx) =>
          filled ? (
            <rect
              key={`${rowIdx}-${colIdx}`}
              x={padding + colIdx * cellSize}
              y={padding + rowIdx * cellSize}
              width={cellSize}
              height={cellSize}
              fill={color}
            />
          ) : null
        )
      )}
    </svg>
  );
}

export default Identicon;