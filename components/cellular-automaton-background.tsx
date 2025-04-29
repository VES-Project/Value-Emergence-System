"use client"

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import seedrandom from 'seedrandom';

// Define color type more specifically if possible, or keep as string for now

// --- RGBA <-> HSL Color Conversion Helpers ---

interface HSLColor {
  h: number; // Hue (0-360)
  s: number; // Saturation (0-100)
  l: number; // Lightness (0-100)
  a: number; // Alpha (0-1)
}

// Converts an RGBA color string to HSL object
const rgbaToHsl = (rgba: string): HSLColor | null => {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\[\d\.\]]+))?\)/);
  if (!match) {
      return null;
  }

  const r = parseInt(match[1], 10) / 255;
  const g = parseInt(match[2], 10) / 255;
  const b = parseInt(match[3], 10) / 255;
  const a = match[4] !== undefined ? parseFloat(match[4]) : 1;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
      a: a
  };
};

// Converts an HSL color object back to RGBA string
const hslToRgba = (hsl: HSLColor): string => {
  const { h, s, l, a } = hsl;
  let r: number, g: number, b: number;

  const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
  };

  if (s === 0) {
    r = g = b = l / 100; // achromatic
  } else {
    const hNorm = h / 360;
    const sNorm = s / 100;
    const lNorm = l / 100;
    const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
    const p = 2 * lNorm - q;
    r = hue2rgb(p, q, hNorm + 1 / 3);
    g = hue2rgb(p, q, hNorm);
    b = hue2rgb(p, q, hNorm - 1 / 3);
  }

  const rInt = Math.round(r * 255);
  const gInt = Math.round(g * 255);
  const bInt = Math.round(b * 255);

  return `rgba(${rInt}, ${gInt}, ${bInt}, ${a})`;
};


// --- ECA Helpers ---
const RULE_TABLE_SIZE = 8;

// Initialize passive rule table 'd_s' from a number (0-255)
const initializePassiveRuleTable = (ruleNumber: number): number[] => {
    if (ruleNumber < 0 || ruleNumber > 255) {
        ruleNumber = 0;
    }
    return ruleNumber.toString(2).padStart(RULE_TABLE_SIZE, '0').split('').map(Number).reverse();
};

// Calculate 3-bit pattern (Left, Center, Right)
const calculatePattern1D = (left: number, center: number, right: number): number => {
    return (left << 2) | (center << 1) | right;
};

// Fisher-Yates Shuffle (Needed again for AT-ECA)
const shuffleArray = <T,>(array: T[], rng: () => number): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};


// --- React Component ---
interface CellularAutomatonBackgroundProps {
  initialWidth?: number;
  cellSize?: number;
  initialStateSeed?: number; // Seed for PRNG (update order and potentially initial state)
  ruleNum?: number; // Passive rule number (0-255)
  updateInterval?: number;
  opacity?: number;
}

export const CellularAutomatonBackground: React.FC<CellularAutomatonBackgroundProps> = ({
  initialWidth = 800,
  cellSize = 10,
  initialStateSeed = Date.now(),
  ruleNum = 30,
  updateInterval = 100,
  opacity = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [resolvedBaseColor, setResolvedBaseColor] = useState<string | null>(null); // NEW state for resolved color

  // --- State Refs (Reverted to Single Row + Workspace) ---
  const currentStepGridRef = useRef<number[][]>([]); // Cell states c[i] at time t
  const nextStepGridRef = useRef<number[][]>([]);    // Workspace for cell states at t+1
  const pastStepGridsRef = useRef<number[][][]>([]); // Store past N steps for trails
  const passiveRuleRef = useRef<number[]>([]);      // Passive rule φP
  const activeRulesRef = useRef<number[][]>([]);   // Active rules φA for each cell [cellIndex][rulePattern] (Keeps only the latest rules)
  const stepCountRef = useRef<number>(0);
  const stepPrngRef = useRef<() => number>(() => 0.5); // PRNG for update order

  // --- Calculated Dimensions and Base Color ---
  const cellsWide = useMemo(() => {
      const canvas = canvasRef.current;
      const width = canvas && canvas.offsetWidth > 0 ? canvas.offsetWidth : initialWidth;
      return Math.ceil(width / cellSize);
  }, [initialWidth, cellSize]);
  const cellsHigh = 1; // ★★★ Force height to 1 row ★★★
  const totalCells = useMemo(() => cellsWide * cellsHigh, [cellsWide, cellsHigh]); // Will be equal to cellsWide

  // --- Initialization Functions (Moved Up) ---
  const initializeGridAndRules = useCallback(() => {
    const currentCellsWide = Math.ceil((canvasRef.current?.offsetWidth || initialWidth) / cellSize);
    if (!isClient || currentCellsWide <= 0 || passiveRuleRef.current.length === 0) return;

    const initialGrid: number[][] = [Array(currentCellsWide).fill(0)];
    const centerX = Math.floor(currentCellsWide / 2);
    if (initialGrid[0]?.[centerX] !== undefined) {
      initialGrid[0][centerX] = 1;
    }
    currentStepGridRef.current = initialGrid;
    nextStepGridRef.current = initialGrid.map(row => [...row]); // Initialize workspace

    activeRulesRef.current = Array.from({ length: currentCellsWide }, () => [
      ...passiveRuleRef.current,
    ]);

    stepCountRef.current = 0;
  }, [isClient, cellSize, initialWidth, passiveRuleRef, canvasRef]);

  // --- Drawing Function (Moved Up) ---
  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !isClient || canvas.width <= 0 || canvas.height <= 0) return;

    // ★ Use current step grid for main drawing, past steps for trails
    const currentGrid = currentStepGridRef.current;
    const pastGrids = pastStepGridsRef.current;
    const trailSteps = 2; // Number of trail steps to show
    const trailOpacityStep = 0.3; // Opacity decrease per trail step

    const reflectionOpacityFactor = 0.9; // MODIFIED: Increased opacity further
    const reflectionHeightMultiplier = 4; // MODIFIED: Increased reflection height

    // Check validity
    if (!currentGrid || currentGrid.length === 0 || !currentGrid[0]) {
        return;
    }
    const currentRow = currentGrid[0]; // Get the single current row

    // Get canvas dimensions for drawing - height comes from prop
    const currentWidth = canvas.width;
    const currentHeight = canvas.height;

    ctx.clearRect(0, 0, currentWidth, currentHeight);

    // ★ Calculate Y position for the original row, trails, and reflection
    const totalStripHeight = cellSize * (1 + trailSteps + reflectionHeightMultiplier); // Original + Trails + Reflection height
    const baseDrawY = currentHeight / 2 - (totalStripHeight / 2); // Y position of the top-most element (first trail)
    const originalDrawY = baseDrawY + trailSteps * cellSize; // Y of the current row
    const reflectedDrawY = originalDrawY + cellSize; // Y of the reflection start

    // Use resolvedBaseColor if available, otherwise provide a fallback
    const currentBaseColor = resolvedBaseColor || `rgba(128, 128, 128, ${opacity})`;

    // --- Calculate base reflection colors (used if cell-specific calculation fails) ---
    let baseReflectionDrawColor = currentBaseColor; // Use resolved color or fallback
    let baseTransparentReflectionDrawColor = 'rgba(0,0,0,0)';
    let baseReflectionFillStyle: string | CanvasGradient = baseReflectionDrawColor;
    const calculatedBaseColorHsl = rgbaToHsl(currentBaseColor); // Calculate HSL for base color once
    if (calculatedBaseColorHsl) { // Check if conversion was successful
        const reflectionAlpha = calculatedBaseColorHsl.a * reflectionOpacityFactor;
        // Use the calculated HSL object
        baseReflectionDrawColor = hslToRgba({ ...calculatedBaseColorHsl, a: reflectionAlpha });
        baseTransparentReflectionDrawColor = hslToRgba({ ...calculatedBaseColorHsl, a: 0 });
        // MODIFIED: Use reflection height multiplier for gradient length
        const gradient = ctx.createLinearGradient(0, reflectedDrawY, 0, reflectedDrawY + cellSize * reflectionHeightMultiplier);
        gradient.addColorStop(0, baseReflectionDrawColor);
        gradient.addColorStop(1, baseTransparentReflectionDrawColor);
        baseReflectionFillStyle = gradient;
    }

    // --- Draw past steps (trails) first ---
    const currentCellsWide = Math.ceil(currentWidth / cellSize); // Recalculate here just in case
    for (let step = 0; step < Math.min(trailSteps, pastGrids.length); step++) {
        const grid = pastGrids[pastGrids.length - 1 - step]; // Get grid from N steps ago
        if (!grid || grid.length === 0 || !grid[0] || grid[0].length !== currentCellsWide) continue; // Skip if invalid

        const trailRow = grid[0]; // ★ Changed variable name from currentRow
        const trailDrawY = baseDrawY + step * cellSize; // Draw trails above the main row
        const trailOpacity = opacity * (1 - (step + 1) * trailOpacityStep); // Decrease opacity for older trails

        if (trailOpacity <= 0) continue; // Don't draw fully transparent trails

        for (let x = 0; x < currentCellsWide; x++) {
            if (trailRow[x] === 1) { // ★ Use trailRow
                const drawX = x * cellSize;
                let trailColor = currentBaseColor; // Start with base color
                const baseHsl = calculatedBaseColorHsl; // Reuse base HSL

                // --- Calculate trail cell color (simplified: use base or complementary blend based on *past* rule) ---
                // Note: We don't have the exact active rule from that past step easily.
                // We can either store past rules too, or use a simplified approach.
                // Simplified: Let's just use the base color with adjusted opacity for now.
                // A more complex approach might blend based on the *current* rule for that cell,
                // or require storing historical rule states.
                if (baseHsl) {
                    trailColor = hslToRgba({ ...baseHsl, a: trailOpacity });
                } else {
                    // Fallback if HSL conversion failed initially
                    const fallbackMatch = currentBaseColor.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*[\\d.]+)?\\)/);
                    if(fallbackMatch) {
                        trailColor = `rgba(${fallbackMatch[1]}, ${fallbackMatch[2]}, ${fallbackMatch[3]}, ${trailOpacity})`;
                    } else {
                        trailColor = `rgba(128, 128, 128, ${trailOpacity})`; // Absolute fallback
                    }
                }
                // --- End of trail cell color calculation ---

                ctx.fillStyle = trailColor;
                ctx.fillRect(drawX, trailDrawY, cellSize, cellSize);
            }
        }
    }

    // --- Draw the single current row ---
    if (!currentRow || currentRow.length !== currentCellsWide) {
    } else {
        for (let x = 0; x < currentCellsWide; x++) { // Use calculated cellsWide for loop
            if (currentRow[x] === 1) {
                const drawX = x * cellSize;

                // --- Calculate cell-specific color: Gradient between base and complementary color ---
                const activeRule = activeRulesRef.current[x];
                let cellColor = currentBaseColor; // Default color (resolved or fallback)
                const baseHsl = calculatedBaseColorHsl; // Use the already converted HSL (Color A)

                if (activeRule && baseHsl) { // Ensure rule and base HSL exist
                    try {
                        // Convert rule table to number (0-255)
                        const ruleNumber = activeRule.reduce((acc, bit, index) => acc + (bit << index), 0);
                        // Map number to blend factor (0.0 to 1.0)
                        const blendFactor = ruleNumber / 255;

                        // Calculate complementary color (Color B)
                        const complementaryHue = (baseHsl.h + 180) % 360;
                        const colorB_Hsl: HSLColor = { ...baseHsl, h: complementaryHue }; // Keep S, L, A same as base

                        // Interpolate HSL values (linear interpolation for S, L, A)
                        // Hue interpolation (handle shortest path across 0/360)
                        let h1 = baseHsl.h;
                        let h2 = colorB_Hsl.h;
                        let dh = h2 - h1;
                        if (Math.abs(dh) > 180) {
                             // Go the other way around the circle
                            if (h1 < h2) h1 += 360;
                            else h2 += 360;
                            dh = h2 - h1; // Recalculate difference
                        }
                        const interpolatedH = (h1 + dh * blendFactor) % 360;

                        // Lower similarity (more "chaotic" rule) leads to higher saturation
                        // Higher similarity (closer to passive rule) leads to lower saturation (closer to base)
                        const minSaturation = 85; // Minimum saturation (when rules match perfectly) ★★★ 70 から 85 に変更 ★★★
                        const maxSaturation = 100; // Maximum saturation (when rules are completely different)
                        const interpolatedSaturation = minSaturation + (1 - blendFactor) * (maxSaturation - minSaturation);

                        const interpolatedL = baseHsl.l; // Keep Lightness same as base for now
                        const interpolatedA = baseHsl.a; // Keep Alpha same as base (opacity prop)

                        const interpolatedHsl: HSLColor = {
                            h: Math.round(interpolatedH),
                            s: Math.round(interpolatedSaturation),
                            l: Math.round(interpolatedL),
                            a: interpolatedA,
                        };

                        cellColor = hslToRgba(interpolatedHsl);

                    } catch {
                        cellColor = "black"; // Fallback color
                    }
                }
                // --- End of cell-specific color calculation ---

                // Draw original cell (glow removed)
                ctx.fillStyle = cellColor; // Always use the calculated cell color
                ctx.fillRect(drawX, originalDrawY, cellSize, cellSize);

                // --- Calculate cell-specific reflection ---
                let reflectionFillStyle: string | CanvasGradient = baseReflectionFillStyle; // Fallback to base reflection
                const cellColorHsl = rgbaToHsl(cellColor); // Convert the *final* cell color (could be default)
                if (cellColorHsl) {
                     const reflectionAlpha = cellColorHsl.a * reflectionOpacityFactor;
                     const reflectionCellDrawColor = hslToRgba({ ...cellColorHsl, a: reflectionAlpha });
                     const transparentReflectionCellDrawColor = hslToRgba({ ...cellColorHsl, a: 0 });
                     // MODIFIED: Use reflection height multiplier for gradient length
                     const gradient = ctx.createLinearGradient(0, reflectedDrawY, 0, reflectedDrawY + cellSize * reflectionHeightMultiplier);
                     gradient.addColorStop(0, reflectionCellDrawColor);
                     gradient.addColorStop(1, transparentReflectionCellDrawColor);
                     reflectionFillStyle = gradient;
                }
                // --- End of cell-specific reflection calculation ---

                // Draw reflected cell (no glow)
                ctx.fillStyle = reflectionFillStyle; // Use cell-specific or base reflection
                // MODIFIED: Use reflection height multiplier for drawing height
                ctx.fillRect(drawX, reflectedDrawY, cellSize, cellSize * reflectionHeightMultiplier); // Reflection below original
            }
        }
    } // End of current row drawing block
  }, [isClient, resolvedBaseColor, cellSize, currentStepGridRef, pastStepGridsRef, opacity, activeRulesRef]); // ★ Add pastStepGridsRef dependency

  // --- Initialization Effects ---
  // Init PRNG, Passive Rule, and Trigger Grid Init
  useEffect(() => {
    const seedString = typeof initialStateSeed === 'number' ? initialStateSeed.toString() : undefined;
    stepPrngRef.current = seedrandom(seedString || Date.now().toString());
    passiveRuleRef.current = initializePassiveRuleTable(ruleNum);
    stepCountRef.current = 0; // Reset steps on rule change
    // Trigger grid re-initialization if needed
    // NOTE: Avoid calling initializeGridAndRules directly if it causes loops
    if (isClient && cellsWide > 0 && cellsHigh > 0) { 
    }
  }, [initialStateSeed, ruleNum, isClient, cellsWide, cellsHigh]); // Keep these dependencies

  // Effect to initialize grid/rules and perform initial draw when ready
  useEffect(() => {
    // Trigger initialization only after client mount and canvas size is set
    const canvas = canvasRef.current;
    if (isClient && canvas && canvas.width > 0 && canvas.height > 0) {
         initializeGridAndRules();
         // Initial draw after initialization
         requestAnimationFrame(drawGrid);
    }
}, [isClient, initializeGridAndRules, drawGrid]); // Removed canvasSizeSet dependency

  // NEW: Effect to resolve CSS variable color on client
  useEffect(() => {
    if (isClient) {
      // Wrap in requestAnimationFrame to ensure styles are computed
      requestAnimationFrame(() => {
        try {
          // Get the CSS variable value (e.g., " 173 58% 39% ")
          const hslString = getComputedStyle(document.documentElement).getPropertyValue('--automaton-base').trim();

          // Parse the HSL string (e.g., "173 58% 39%")
          const match = hslString.match(/(\d+)\s+([\d.]+)%\s+([\d.]+)%/);
          if (match) {
            const h = parseInt(match[1], 10);
            const s = parseFloat(match[2]);
            const l = parseFloat(match[3]);

            // Create HSL object and apply opacity
            const hslColor: HSLColor = { h, s, l, a: opacity };
            const rgbaColor = hslToRgba(hslColor);
            setResolvedBaseColor(rgbaColor);
          } else {
              setResolvedBaseColor(`rgba(128, 128, 128, ${opacity})`); // Fallback grey
          }
        } catch {
            setResolvedBaseColor(`rgba(128, 128, 128, ${opacity})`); // Fallback grey
        }
      });
    }
  }, [isClient, opacity]);

  // --- AT-ECA Update Logic (Reverted to Single Row Update) ---
  const runAtEcaStep = useCallback(() => {
    if (!isClient || totalCells <= 0 || passiveRuleRef.current.length === 0 || activeRulesRef.current.length !== cellsWide) {
        if (isClient && cellsWide > 0 && passiveRuleRef.current.length > 0 && activeRulesRef.current.length !== cellsWide) {
            initializeGridAndRules();
        }
        return;
    }

    const currentStep = stepCountRef.current;
    const gridOld = currentStepGridRef.current;
    const gridNew = nextStepGridRef.current; // Use the workspace
    const passiveRule = passiveRuleRef.current; // φP
    const activeRules = activeRulesRef.current; // φA for all cells (latest set)

    // Check validity of the current row
    if (!gridOld?.[0] || !gridNew?.[0] || gridOld[0].length !== cellsWide || gridNew[0].length !== cellsWide) {
        initializeGridAndRules(); // Attempt to re-initialize
        return;
    }

    // Initialize gridNew with current values for this step's calculations
    for (let x = 0; x < cellsWide; x++) {
        if (gridOld[0]?.[x] !== undefined) {
             gridNew[0][x] = gridOld[0][x];
        } else {
            return;
        }
    }

    // 1. Generate Update Order (order) and track updated status
    const updateOrder = shuffleArray(Array.from({ length: cellsWide }, (_, i) => i), stepPrngRef.current);
    const updated = Array(cellsWide).fill(false); // Tracks updated status within this step

    // 2. Sequential Update Loop following `updateOrder` (Only y=0)
    for (const x of updateOrder) { // x is the index of the cell to update

      // Get Neighbor Indices (Periodic Boundary)
      const L = (x - 1 + cellsWide) % cellsWide;
      const R = (x + 1) % cellsWide;

      // Neighbor Update Status
      const leftDone = updated[L];
      const rightDone = updated[R];

      // Get OLD neighbor values (from gridOld - state at beginning of step t)
      const leftValOld = gridOld[0]?.[L] ?? 0;
      const selfValOld = gridOld[0]?.[x] ?? 0;
      const rightValOld = gridOld[0]?.[R] ?? 0;
      const oldPattern = calculatePattern1D(leftValOld, selfValOld, rightValOld);

      let cNew: number; // The new state for cell x
      const activeRule_i = activeRules[x]; // Get the active rule table for this specific cell x

      if (!activeRule_i) {
          return; // Cannot proceed without the rule table
      }

      // --- Apply Rule based on Case ---
      if (!leftDone && !rightDone) {
        // Case-1: Both neighbors not updated yet. Use cell x's Active Rule φA[x].
        const pattern = oldPattern;
        cNew = activeRule_i[pattern] ?? 0;

      } else {
        // Case-2 or Case-3: At least one neighbor updated. Use Passive Rule φP.
        // Read updated neighbors from the workspace (gridNew), others from gridOld
        const leftVal = leftDone ? (gridNew[0]?.[L] ?? 0) : leftValOld;
        const rightVal = rightDone ? (gridNew[0]?.[R] ?? 0) : rightValOld;
        const pattern = calculatePattern1D(leftVal, selfValOld, rightVal);
        cNew = passiveRule[pattern] ?? 0;

        // **Tuning**: Modify cell x's active rule φA[x].
        const tuneIndex = (leftDone && rightDone) ? oldPattern : 0;
        if (tuneIndex >= 0 && tuneIndex < RULE_TABLE_SIZE) {
             activeRule_i[tuneIndex] = cNew;
        } else {
        }
      }

      // --- Update State in the Workspace (gridNew) ---
      gridNew[0][x] = cNew;

      // Mark cell x as updated for this step
      updated[x] = true;
    }

    // --- Step Finalization ---
    currentStepGridRef.current = gridNew.map(row => [...row]);
    nextStepGridRef.current = gridNew.map(row => [...row]); // Prepare workspace for next step
    // activeRulesRef was modified in-place for each cell during the loop.

    // ★ Add current grid state to the history for trails
    pastStepGridsRef.current.push(gridNew.map(row => [...row]));
    // Keep only the last N steps (N = trailSteps = 2)
    const trailSteps = 2; // Make sure this matches the draw function value
    if (pastStepGridsRef.current.length > trailSteps) {
        pastStepGridsRef.current.shift(); // Remove the oldest step
    }

    stepCountRef.current = currentStep + 1;

  }, [isClient, totalCells, cellsWide, stepPrngRef, initializeGridAndRules, passiveRuleRef, activeRulesRef]);


  // --- Animation Loop ---
  useEffect(() => {
      // Start animation only when client, canvas size is set, and initialized
      const canvas = canvasRef.current;
      if (!isClient || !canvas || canvas.width <= 0 || canvas.height <= 0) { return; }

      let isActive = true;
      let animationFrameIdCurrent: number | null = null;
      const lastUpdateTime = { current: performance.now() }; // Use ref for mutable time

      const animationStep = (timestamp: number) => {
          if (!isActive) return;

          // Ensure enough time has passed
          if (timestamp - lastUpdateTime.current >= updateInterval) {
             try {
                 runAtEcaStep();
                 lastUpdateTime.current = timestamp; // Update time *after* successful step
                 requestAnimationFrame(drawGrid); // Request draw *after* state update
             } catch {
                 isActive = false; // Stop animation on error
             }
          }

          // Request next frame if still active
          if (isActive) {
              animationFrameIdCurrent = requestAnimationFrame(animationStep);
          }
      };

      // Start the animation
      animationFrameIdCurrent = requestAnimationFrame(animationStep);

      // Cleanup function
      return () => {
          isActive = false;
          if (animationFrameIdCurrent) {
              cancelAnimationFrame(animationFrameIdCurrent);
          }
      };
  }, [isClient, updateInterval, runAtEcaStep, drawGrid]); // Removed canvasSizeSet dependency


  // --- Client Mount & Resize Listener ---
  useEffect(() => { setIsClient(true); }, []); // Mount effect
  // Effect to set canvas size and observe resize
  useEffect(() => {
    if (!isClient) return;

    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) {
        return;
    }

    let observer: ResizeObserver | null = null;

    const updateCanvasSize = () => {
        const newWidth = parent.offsetWidth;
        const newHeight = parent.offsetHeight;
        if (newWidth > 0 && newHeight > 0) {
            if (canvas.width !== newWidth || canvas.height !== newHeight) {
                canvas.width = newWidth;
                canvas.height = newHeight;
                requestAnimationFrame(drawGrid); // Draw immediately after resize/update
            }
        } else {
        }
    };

    updateCanvasSize();

    observer = new ResizeObserver(updateCanvasSize);
    observer.observe(parent);

    // Cleanup function
    return () => {
        if (observer) {
            observer.disconnect();
        }
    };
  }, [isClient, drawGrid]); // Removed fixedHeight dependency

  return (
    <canvas
      ref={canvasRef}
      width={cellsWide * cellSize} // Set initial canvas width based on calculation
      height={cellsHigh * cellSize * (1 + 2 + 4)} // ★ Adjust initial height calculation based on trails and reflection
      className="block mx-auto" // Added block and mx-auto for centering
    />
  );
}; 