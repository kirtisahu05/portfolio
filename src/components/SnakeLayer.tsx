"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { IconType } from "react-icons";

// Ambient Nokia-style Snake that lives in the gaps between cards. The wrapped
// area is divided into CELL-px "pixels"; every cell under an element marked
// `data-snake-obstacle` is blocked, so the snake can only travel the gutters.
// `data-snake-obstacle="row"` is for headings above a grid: it blocks that
// element's whole row across the wrapped area, plus the open space above it
// (up to the nearest card or the top edge), so the snake never passes above
// a heading — it runs between the heading and the cards below instead.
// Each tick it takes the shortest path (BFS) to the nearest dot, eats it, and
// grows. Its body is a stream of 0/1 digits (`look="binary"`, default) or a
// solid pixel line (`look="solid"`). The "dots" it eats are tech-stack icons (`foodIcons`), drawn as small
// elements over their lane cell; the snake itself is drawn on a canvas.
// Purely decorative: aria-hidden, no pointer events, paused when
// off-screen or the tab is hidden, and off for prefers-reduced-motion.

const CELL = 6; // px per snake "pixel"
const TICK_MS = 90; // Nokia-ish pace
const FOOD_COUNT = 4;
const START_LENGTH = 6;
const GROW_PER_DOT = 3;
const MAX_LENGTH = 30;
const EDGE_MARGIN = 2; // keep the snake a hair away from card edges
const MAX_GUTTER = 8; // cells; open runs up to this wide count as a gutter
// px of board beyond the wrapped area, so a lane runs around the outside of the
// cards. Minus EDGE_MARGIN it must stay ≥ 2·CELL − 1 so a full cell always fits,
// wherever the grid lines fall.
const OUTER_PAD = 14;

// Reduce the open area to single-cell center lines, so the snake runs in one
// line down the middle of every gap instead of zig-zagging across a wide one.
//  1. For each open cell, measure the horizontal and vertical run of open cells
//     it sits in.
//  2. A cell in a narrow run (≤ MAX_GUTTER) is kept only if it's the middle of
//     that run — the centerline of a vertical or horizontal gutter.
//  3. Where gutters cross, the runs are wide in both directions, so step 2
//     drops those cells; extend each centerline straight through such wide
//     cells so crossing lanes meet and the network stays connected.
//  4. Keep only the largest connected network (see below).
//  5. Prune dead ends so every lane is part of a loop.
export function toCenterLines(free: Uint8Array, cols: number, rows: number): Uint8Array {
  const n = cols * rows;
  const hLen = new Uint16Array(n);
  const hPos = new Uint16Array(n);
  const vLen = new Uint16Array(n);
  const vPos = new Uint16Array(n);
  for (let y = 0; y < rows; y++) {
    let x = 0;
    while (x < cols) {
      if (!free[y * cols + x]) {
        x++;
        continue;
      }
      const start = x;
      while (x < cols && free[y * cols + x]) x++;
      for (let k = start; k < x; k++) {
        hLen[y * cols + k] = x - start;
        hPos[y * cols + k] = k - start;
      }
    }
  }
  for (let x = 0; x < cols; x++) {
    let y = 0;
    while (y < rows) {
      if (!free[y * cols + x]) {
        y++;
        continue;
      }
      const start = y;
      while (y < rows && free[y * cols + x]) y++;
      for (let k = start; k < y; k++) {
        vLen[k * cols + x] = y - start;
        vPos[k * cols + x] = k - start;
      }
    }
  }

  const VERTICAL = 1;
  const HORIZONTAL = 2;
  const lane = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    if (!free[i]) continue;
    if (hLen[i] <= MAX_GUTTER && hPos[i] === (hLen[i] - 1) >> 1) lane[i] |= VERTICAL;
    if (vLen[i] <= MAX_GUTTER && vPos[i] === (vLen[i] - 1) >> 1) lane[i] |= HORIZONTAL;
  }
  const seeds = Array.from(lane.keys()).filter((i) => lane[i]);
  for (const i of seeds) {
    const x = i % cols;
    if (lane[i] & VERTICAL) {
      for (const step of [-cols, cols]) {
        for (let j = i + step; j >= 0 && j < n && free[j] && hLen[j] > MAX_GUTTER; j += step) lane[j] |= VERTICAL;
      }
    }
    if (lane[i] & HORIZONTAL) {
      for (let j = i - 1; j >= 0 && (j % cols) < x && free[j] && vLen[j] > MAX_GUTTER; j--) lane[j] |= HORIZONTAL;
      for (let j = i + 1; j < n && (j % cols) > x && free[j] && vLen[j] > MAX_GUTTER; j++) lane[j] |= HORIZONTAL;
    }
  }
  // 4. Keep only the largest connected network — small offset fragments (e.g.
  //    beside a zone label, where the open strip changes height) would strand
  //    dots the snake can never reach.
  const out = new Uint8Array(n);
  const comp = new Int32Array(n).fill(-1);
  let best = -1;
  let bestSize = 0;
  for (let i = 0, id = 0; i < n; i++) {
    if (!lane[i] || comp[i] !== -1) continue;
    const stack = [i];
    comp[i] = id;
    let size = 0;
    while (stack.length) {
      const c = stack.pop()!;
      size++;
      const x = c % cols;
      for (const nb of [x > 0 ? c - 1 : -1, x < cols - 1 ? c + 1 : -1, c - cols, c + cols]) {
        if (nb >= 0 && nb < n && lane[nb] && comp[nb] === -1) {
          comp[nb] = id;
          stack.push(nb);
        }
      }
    }
    if (size > bestSize) {
      bestSize = size;
      best = id;
    }
    id++;
  }
  // Keep the lane bits (1 vertical, 2 horizontal, 3 both) — laneCenters()
  // uses them to center each cell in its gap.
  for (let i = 0; i < n; i++) out[i] = comp[i] === best && best !== -1 ? lane[i] : 0;

  // 5. Prune dead ends (cells with one open neighbor), repeatedly, so every
  //    lane is part of a loop — a snake that runs into a dead end can't turn
  //    around.
  const degree = (i: number) => {
    const x = i % cols;
    return (x > 0 && out[i - 1] ? 1 : 0) + (x < cols - 1 && out[i + 1] ? 1 : 0) +
      (i - cols >= 0 && out[i - cols] ? 1 : 0) + (i + cols < n && out[i + cols] ? 1 : 0);
  };
  const leaves: number[] = [];
  for (let i = 0; i < n; i++) if (out[i] && degree(i) <= 1) leaves.push(i);
  while (leaves.length) {
    const c = leaves.pop()!;
    if (!out[c] || degree(c) > 1) continue;
    out[c] = 0;
    const x = c % cols;
    for (const nb of [x > 0 ? c - 1 : -1, x < cols - 1 ? c + 1 : -1, c - cols, c + cols]) {
      if (nb >= 0 && nb < n && out[nb] && degree(nb) <= 1) leaves.push(nb);
    }
  }
  return out;
}

type Rect = { l: number; t: number; r: number; b: number };

// Pixel position to draw each lane cell at, so the snake runs down the exact
// middle of every gap even though it moves on a CELL-px grid. For a vertical
// lane cell, x is the midpoint between the nearest card edges to its left and
// right (or the board edge, for the outer lane); horizontal lanes do the same
// for y. Cells where a lane passes through a crossing (wide in that
// direction) reuse the center from the nearest narrow cell on the same lane.
export function laneCenters(
  lane: Uint8Array,
  cols: number,
  rows: number,
  rects: Rect[],
  boardW: number,
  boardH: number
): { px: Float32Array; py: Float32Array } {
  const n = cols * rows;
  const px = new Float32Array(n).fill(NaN);
  const py = new Float32Array(n).fill(NaN);
  const narrow = (MAX_GUTTER + 2) * CELL;
  for (let i = 0; i < n; i++) {
    if (!lane[i]) continue;
    const x = i % cols;
    const y = (i - x) / cols;
    const cx = x * CELL + CELL / 2;
    const cy = y * CELL + CELL / 2;
    if (lane[i] & 1) {
      let left = 0;
      let right = boardW;
      for (const rc of rects) {
        if (cy < rc.t || cy >= rc.b) continue;
        if (rc.r <= cx) left = Math.max(left, rc.r);
        else if (rc.l >= cx) right = Math.min(right, rc.l);
      }
      if (right - left <= narrow) px[i] = (left + right) / 2;
    }
    if (lane[i] & 2) {
      let top = 0;
      let bottom = boardH;
      for (const rc of rects) {
        if (cx < rc.l || cx >= rc.r) continue;
        if (rc.b <= cy) top = Math.max(top, rc.b);
        else if (rc.t >= cy) bottom = Math.min(bottom, rc.t);
      }
      if (bottom - top <= narrow) py[i] = (top + bottom) / 2;
    }
  }
  // Fill crossings from the nearest measured cell along the same lane.
  const fill = (arr: Float32Array, bit: number, lineLen: number, lineCount: number, at: (line: number, k: number) => number) => {
    for (let line = 0; line < lineCount; line++) {
      let last = NaN;
      const pending: number[] = [];
      for (let k = 0; k < lineLen; k++) {
        const i = at(line, k);
        if (!(lane[i] & bit)) {
          last = NaN;
          pending.length = 0;
          continue;
        }
        if (Number.isNaN(arr[i])) {
          if (!Number.isNaN(last)) arr[i] = last;
          else pending.push(i);
        } else {
          last = arr[i];
          for (const p of pending) arr[p] = last;
          pending.length = 0;
        }
      }
    }
  };
  fill(px, 1, rows, cols, (col, k) => k * cols + col);
  fill(py, 2, cols, rows, (row, k) => row * cols + k);
  // Anything still unmeasured (shouldn't happen) falls back to its grid cell.
  for (let i = 0; i < n; i++) {
    if (!lane[i]) continue;
    const x = i % cols;
    if (Number.isNaN(px[i])) px[i] = x * CELL + CELL / 2;
    if (Number.isNaN(py[i])) py[i] = ((i - x) / cols) * CELL + CELL / 2;
  }
  return { px, py };
}

type FoodView = { id: number; x: number; y: number; icon: number };

export default function SnakeLayer({
  children,
  className = "",
  enabled = true,
  foodIcons = [],
  look = "binary",
}: {
  children: ReactNode;
  className?: string;
  enabled?: boolean;
  /** Icons the snake eats; a random one per dot. Empty = plain pixel dots. */
  foodIcons?: IconType[];
  /** "binary" = body drawn as a stream of 0/1 digits; "solid" = one thick pixel line. */
  look?: "binary" | "solid";
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [foodView, setFoodView] = useState<FoodView[]>([]);
  const iconCount = foodIcons.length;

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!enabled || !wrap || !canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cols = 0;
    let rows = 0;
    let free: Uint8Array = new Uint8Array(0); // nonzero = lane cell (bits: 1 vertical, 2 horizontal)
    let centerX: Float32Array = new Float32Array(0); // exact gap-center position per lane cell (board px)
    let centerY: Float32Array = new Float32Array(0);
    let snake: number[] = []; // cell indices, head first
    let bits: string[] = []; // "0"/"1" per segment, parallel to `snake` (binary look)
    const randomBit = () => (Math.random() < 0.5 ? "0" : "1");
    let foods: number[] = [];
    let foodIcon: number[] = []; // icon index per dot, parallel to `foods`
    let foodId: number[] = []; // stable key per dot, parallel to `foods`
    let nextId = 0;
    let pendingGrowth = 0;
    let snakeColor = "#0e413b";
    let foodColor = "#2f8a57";
    let onScreen = true;

    const randomFrom = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];

    function openCells(): number[] {
      const out: number[] = [];
      for (let i = 0; i < free.length; i++) if (free[i]) out.push(i);
      return out;
    }

    function neighbors(i: number): number[] {
      const x = i % cols;
      const y = (i - x) / cols;
      const out: number[] = [];
      if (x > 0 && free[i - 1]) out.push(i - 1);
      if (x < cols - 1 && free[i + 1]) out.push(i + 1);
      if (y > 0 && free[i - cols]) out.push(i - cols);
      if (y < rows - 1 && free[i + cols]) out.push(i + cols);
      return out;
    }

    function addFood(candidates?: number[]) {
      const taken = new Set([...snake, ...foods]);
      const pool = (candidates ?? openCells()).filter((c) => !taken.has(c));
      if (!pool.length) return;
      foods.push(randomFrom(pool));
      foodIcon.push(iconCount ? Math.floor(Math.random() * iconCount) : -1);
      foodId.push(nextId++);
    }

    function removeFood(index: number) {
      foods.splice(index, 1);
      foodIcon.splice(index, 1);
      foodId.splice(index, 1);
    }

    // Publish dot positions (px, relative to the wrapped area) for the icon
    // overlay. Only called when dots change, not every tick.
    function syncFoodView() {
      if (!iconCount) return;
      setFoodView(
        foods.map((cell, i) => ({
          id: foodId[i],
          x: centerX[cell] - OUTER_PAD,
          y: centerY[cell] - OUTER_PAD,
          icon: foodIcon[i],
        }))
      );
    }

    function reset() {
      const open = openCells();
      snake = open.length ? [randomFrom(open)] : [];
      bits = snake.map(randomBit);
      pendingGrowth = START_LENGTH - 1;
      foods = [];
      foodIcon = [];
      foodId = [];
      for (let n = 0; n < FOOD_COUNT; n++) addFood(open);
      syncFoodView();
    }

    // Measure the cards and rebuild the board (on mount and whenever the
    // wrapped area resizes).
    function rebuild() {
      const box = wrap!.getBoundingClientRect();
      // Whole cells, rounded up so the outer lane on the right/bottom is never
      // cut short by a partial cell.
      cols = Math.max(0, Math.ceil((box.width + OUTER_PAD * 2) / CELL));
      rows = Math.max(0, Math.ceil((box.height + OUTER_PAD * 2) / CELL));
      const boardW = cols * CELL;
      const boardH = rows * CELL;
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = Math.round(boardW * dpr);
      canvas!.height = Math.round(boardH * dpr);
      canvas!.style.width = `${boardW}px`;
      canvas!.style.height = `${boardH}px`;
      canvas!.style.left = `${-OUTER_PAD}px`;
      canvas!.style.top = `${-OUTER_PAD}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      free = new Uint8Array(cols * rows).fill(1);
      const headingRows: { left: number; right: number; r0: number }[] = [];
      const edges: Rect[] = []; // true (unpadded) edges, for centering
      wrap!.querySelectorAll<HTMLElement>("[data-snake-obstacle]").forEach((el) => {
        const r = el.getBoundingClientRect();
        const fullRow = el.dataset.snakeObstacle === "row";
        edges.push({
          l: fullRow ? OUTER_PAD : r.left - box.left + OUTER_PAD,
          r: fullRow ? box.width + OUTER_PAD : r.right - box.left + OUTER_PAD,
          t: r.top - box.top + OUTER_PAD,
          b: r.bottom - box.top + OUTER_PAD,
        });
        const left = fullRow ? OUTER_PAD - EDGE_MARGIN : r.left - box.left + OUTER_PAD - EDGE_MARGIN;
        const right = fullRow ? box.width + OUTER_PAD + EDGE_MARGIN : r.right - box.left + OUTER_PAD + EDGE_MARGIN;
        const top = r.top - box.top + OUTER_PAD - EDGE_MARGIN;
        const bottom = r.bottom - box.top + OUTER_PAD + EDGE_MARGIN;
        const c0 = Math.max(0, Math.floor(left / CELL));
        const c1 = Math.min(cols - 1, Math.ceil(right / CELL));
        const r0 = Math.max(0, Math.floor(top / CELL));
        const r1 = Math.min(rows - 1, Math.ceil(bottom / CELL));
        // First row the heading actually blocks (center test, below).
        if (fullRow) headingRows.push({ left, right, r0: Math.max(0, Math.ceil((top - CELL / 2) / CELL)) });
        for (let y = r0; y <= r1; y++) {
          for (let x = c0; x <= c1; x++) {
            // Block a cell if any part of it touches the (padded) card.
            const cx0 = x * CELL;
            const cy0 = y * CELL;
            // Cards block any cell they touch. Headings block a row only where
            // the cell's center is on the heading, so the thin gap between a
            // heading and the cards below always keeps a lane, wherever the
            // 6px grid happens to fall.
            const hitsRows = fullRow
              ? cy0 + CELL / 2 >= top && cy0 + CELL / 2 < bottom
              : cy0 + CELL > top && cy0 < bottom;
            if (cx0 + CELL > left && cx0 < right && hitsRows) free[y * cols + x] = 0;
          }
        }
      });
      // Headings also claim the open space above them, so no lane runs over a
      // heading (the outer lane's columns stay open and get pruned as dead ends).
      // Only columns the heading actually covers — not the outer lane beside it.
      for (const { left, right, r0 } of headingRows) {
        for (let x = 0; x < cols; x++) {
          if (x * CELL + CELL <= left || x * CELL >= right) continue;
          for (let y = r0 - 1; y >= 0 && free[y * cols + x]; y--) free[y * cols + x] = 0;
        }
      }

      free = toCenterLines(free, cols, rows);
      ({ px: centerX, py: centerY } = laneCenters(free, cols, rows, edges, boardW, boardH));

      const styles = getComputedStyle(wrap!);
      snakeColor = styles.getPropertyValue("--accent").trim() || snakeColor;
      foodColor = styles.getPropertyValue("--emphasis").trim() || snakeColor;
      reset();
      draw();
    }

    function step() {
      if (!snake.length) return;
      const head = snake[0];
      // The tail moves out of the way this tick, so it isn't an obstacle.
      const body = new Set(snake.slice(0, Math.max(1, snake.length - (pendingGrowth > 0 ? 0 : 1))));
      const foodSet = new Set(foods);

      // BFS from the head to the nearest dot through open, non-body cells.
      const prev = new Int32Array(cols * rows).fill(-1);
      prev[head] = head;
      const queue = [head];
      const reached: number[] = [];
      let target = -1;
      for (let qi = 0; qi < queue.length; qi++) {
        const cur = queue[qi];
        if (cur !== head && foodSet.has(cur)) {
          target = cur;
          break;
        }
        for (const nb of neighbors(cur)) {
          if (prev[nb] !== -1 || body.has(nb)) continue;
          prev[nb] = cur;
          queue.push(nb);
          reached.push(nb);
        }
      }

      let next: number | undefined;
      if (target !== -1) {
        let cur = target;
        while (prev[cur] !== head) cur = prev[cur];
        next = cur;
      } else {
        // No dot reachable from here: move a dot somewhere reachable, and
        // wander one step meanwhile.
        if (reached.length && foods.length) {
          removeFood(0);
          addFood(reached);
          syncFoodView();
        }
        const options = neighbors(head).filter((nb) => !body.has(nb));
        next = options.length ? randomFrom(options) : undefined;
      }

      if (next === undefined) {
        // Boxed in: turn around (tail becomes head) rather than vanish; only
        // start over if even that has nowhere to go.
        snake.reverse();
        bits.reverse();
        if (!neighbors(snake[0]).some((nb) => !snake.includes(nb))) reset();
        return;
      }

      snake.unshift(next);
      bits.unshift(randomBit()); // a fresh bit enters at the head; existing bits flow back
      const eaten = foods.indexOf(next);
      if (eaten !== -1) {
        removeFood(eaten);
        addFood();
        syncFoodView();
        pendingGrowth += GROW_PER_DOT;
      }
      if (pendingGrowth > 0 && snake.length <= MAX_LENGTH) pendingGrowth--;
      else {
        snake.pop();
        bits.pop();
      }
    }

    function drawDot(i: number, size: number) {
      ctx!.fillRect(centerX[i] - size / 2, centerY[i] - size / 2, size, size);
    }

    function draw() {
      ctx!.clearRect(0, 0, cols * CELL, rows * CELL);
      if (!iconCount) {
        ctx!.fillStyle = foodColor;
        for (const f of foods) drawDot(f, CELL - 2);
      }
      if (!snake.length) return;
      if (look === "binary") {
        // A stream of 0/1 digits, one per segment at its gap-centered point.
        // The head is in the brighter emphasis color; the body fades toward
        // the tail.
        ctx!.font = `700 ${CELL + 2}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        for (let k = snake.length - 1; k >= 0; k--) {
          ctx!.globalAlpha = k === 0 ? 1 : 1 - (k / snake.length) * 0.6;
          ctx!.fillStyle = k === 0 ? foodColor : snakeColor;
          ctx!.fillText(bits[k] ?? "0", centerX[snake[k]], centerY[snake[k]] + 0.5);
        }
        ctx!.globalAlpha = 1;
        return;
      }
      // One thick, square-capped line through the gap-centered points: reads
      // as a pixel snake, and stays continuous at corners where neighbouring
      // cells sit a few px off the grid spacing.
      ctx!.strokeStyle = snakeColor;
      ctx!.fillStyle = snakeColor;
      if (snake.length === 1) {
        drawDot(snake[0], CELL - 1);
        return;
      }
      ctx!.lineWidth = CELL - 1;
      ctx!.lineCap = "square";
      ctx!.lineJoin = "miter";
      ctx!.beginPath();
      ctx!.moveTo(centerX[snake[0]], centerY[snake[0]]);
      for (let k = 1; k < snake.length; k++) ctx!.lineTo(centerX[snake[k]], centerY[snake[k]]);
      ctx!.stroke();
    }

    let frame = 0;
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(rebuild);
    });
    resizeObserver.observe(wrap);

    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    visibility.observe(wrap);

    rebuild();
    const timer = window.setInterval(() => {
      if (!onScreen || document.hidden) return;
      step();
      draw();
    }, TICK_MS);

    return () => {
      window.clearInterval(timer);
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibility.disconnect();
    };
  }, [enabled, iconCount, look]);

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      {children}
      {enabled && <canvas ref={canvasRef} className="pointer-events-none absolute left-0 top-0" aria-hidden="true" />}
      {enabled &&
        foodView.map((f) => {
          const Icon = foodIcons[f.icon];
          return Icon ? (
            <span
              key={f.id}
              aria-hidden="true"
              className="snake-food pointer-events-none absolute flex h-3 w-3 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-[var(--emphasis)]"
              style={{ left: f.x, top: f.y }}
            >
              <Icon className="h-3 w-3" />
            </span>
          ) : null;
        })}
    </div>
  );
}
