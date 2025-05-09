import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import BaseCanvas from "./BaseCanvas";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

// Create a Web Worker for computation
const createWorker = () => {
  const workerCode = `
    const RULES = {
      conway: (isAlive, neighbors) => 
        (isAlive && (neighbors === 2 || neighbors === 3)) || (!isAlive && neighbors === 3),
      highLife: (isAlive, neighbors) =>
        (isAlive && (neighbors === 2 || neighbors === 3)) || (!isAlive && (neighbors === 3 || neighbors === 6)),
      dayAndNight: (isAlive, neighbors) =>
        (isAlive && (neighbors === 3 || neighbors === 4 || neighbors === 6 || neighbors === 7 || neighbors === 8)) ||
        (!isAlive && (neighbors === 3 || neighbors === 6 || neighbors === 7 || neighbors === 8)),
      seeds: (isAlive, neighbors) =>
        !isAlive && neighbors === 2
    };

    function countNeighbors(grid, row, col, numRows, numCols) {
      let count = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;
          const newRow = (row + i + numRows) % numRows;
          const newCol = (col + j + numCols) % numCols;
          count += grid[newRow * numCols + newCol];
        }
      }
      return count;
    }

    function updateGrid(grid, numRows, numCols, rule) {
      const newGrid = new Uint8Array(grid.length);
      const ruleFn = RULES[rule];
      
      for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
          const idx = row * numCols + col;
          const neighbors = countNeighbors(grid, row, col, numRows, numCols);
          const isAlive = grid[idx] === 1;
          newGrid[idx] = ruleFn(isAlive, neighbors) ? 1 : 0;
        }
      }
      
      return newGrid;
    }

    self.onmessage = function(e) {
      const { grid, numRows, numCols, rule } = e.data;
      const newGrid = updateGrid(grid, numRows, numCols, rule);
      self.postMessage(newGrid);
    };
  `;

  const blob = new Blob([workerCode], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
};

// Rule descriptions
const RULE_DESCRIPTIONS = {
  conway: "Conway's Game of Life:\n• Any live cell with 2 or 3 neighbors survives\n• Any dead cell with exactly 3 neighbors becomes alive\n• All other cells die or stay dead",
  highLife: "High Life:\n• Similar to Conway's Game of Life\n• Additional rule: dead cells with 6 neighbors become alive\n• Creates more complex patterns and replicators",
  dayAndNight: "Day & Night:\n• Symmetrical rules for birth and survival\n• Cells survive with 3,4,6,7,8 neighbors\n• Dead cells become alive with 3,6,7,8 neighbors\n• Creates interesting symmetrical patterns",
  seeds: "Seeds:\n• Simple rule: cells only live for one generation\n• Dead cells with exactly 2 neighbors become alive\n• All live cells die in the next generation\n• Creates explosive growth patterns"
};

// Pattern descriptions
const PATTERN_DESCRIPTIONS = {
  glider: "A small pattern that moves diagonally across the grid, creating a repeating cycle every 4 generations.",
  blinker: "A simple oscillator that alternates between horizontal and vertical states every 2 generations.",
  block: "A still life pattern that remains unchanged across generations.",
  beehive: "A still life pattern that resembles a hexagonal structure.",
  gliderGun: "A complex pattern that continuously generates gliders, first discovered by Bill Gosper in 1970."
};

// Preset patterns as TypedArrays for better performance
const PATTERNS = {
  glider: new Uint8Array([
    0, 1, 0,
    0, 0, 1,
    1, 1, 1
  ]),
  blinker: new Uint8Array([
    1,
    1,
    1
  ]),
  block: new Uint8Array([
    1, 1,
    1, 1
  ]),
  beehive: new Uint8Array([
    0, 1, 1, 0,
    1, 0, 0, 1,
    0, 1, 1, 0
  ]),
  gliderGun: new Uint8Array([
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
    0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
    1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    1,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
  ])
};

const PATTERN_SIZES = {
  glider: { rows: 3, cols: 3 },
  blinker: { rows: 3, cols: 1 },
  block: { rows: 2, cols: 2 },
  beehive: { rows: 3, cols: 4 },
  gliderGun: { rows: 9, cols: 36 }
};

export default function CellularAutomataCanvas({ isRunning, tickRate }) {
  const numRows = 100;
  const numCols = 100;
  const [selectedRule, setSelectedRule] = useState('conway');
  const [selectedPattern, setSelectedPattern] = useState('random');
  const ruleHoverRef = useRef(null);
  const patternHoverRef = useRef(null);
  const workerRef = useRef(null);
  const gridRef = useRef(null);
  
  // Initialize grid with random cells using Uint8Array for better performance
  const [grid, setGrid] = useState(() => {
    const newGrid = new Uint8Array(numRows * numCols);
    for (let i = 0; i < newGrid.length; i++) {
      newGrid[i] = Math.random() < 0.2 ? 1 : 0;
    }
    return newGrid;
  });

  // Keep gridRef in sync with grid state
  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  // Initialize Web Worker
  useEffect(() => {
    workerRef.current = createWorker();
    workerRef.current.onmessage = (e) => {
      setGrid(e.data);
    };

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  // Apply selected pattern
  const applyPattern = useCallback((patternName) => {
    if (patternName === 'random') {
      const newGrid = new Uint8Array(numRows * numCols);
      for (let i = 0; i < newGrid.length; i++) {
        newGrid[i] = Math.random() < 0.2 ? 1 : 0;
      }
      setGrid(newGrid);
      return;
    }

    const pattern = PATTERNS[patternName];
    const { rows: patternRows, cols: patternCols } = PATTERN_SIZES[patternName];
    const newGrid = new Uint8Array(numRows * numCols);
    const startRow = Math.floor((numRows - patternRows) / 2);
    const startCol = Math.floor((numCols - patternCols) / 2);

    for (let i = 0; i < patternRows; i++) {
      for (let j = 0; j < patternCols; j++) {
        const row = startRow + i;
        const col = startCol + j;
        if (row >= 0 && row < numRows && col >= 0 && col < numCols) {
          newGrid[row * numCols + col] = pattern[i * patternCols + j];
        }
      }
    }
    setGrid(newGrid);
  }, [numRows, numCols]);

  useEffect(() => {
    applyPattern(selectedPattern);
  }, [selectedPattern, applyPattern]);

  // Handle cell clicks
  const handleCellClick = useCallback((row, col) => {
    setGrid(prevGrid => {
      const newGrid = new Uint8Array(prevGrid);
      const idx = row * numCols + col;
      newGrid[idx] = 1 - newGrid[idx]; // Toggle cell state
      return newGrid;
    });
  }, [numCols]);

  // Update grid using Web Worker
  useEffect(() => {
    let animationFrameId;
    let lastUpdate = 0;
    const intervalTime = 1000 / tickRate;

    const update = (timestamp) => {
      if (isRunning) {
        if (timestamp - lastUpdate >= intervalTime) {
          if (workerRef.current && gridRef.current) {
            // Create a copy of the current grid to send to the worker
            const gridCopy = new Uint8Array(gridRef.current);
            workerRef.current.postMessage({
              grid: gridCopy,
              numRows,
              numCols,
              rule: selectedRule
            });
          }
          lastUpdate = timestamp;
        }
        animationFrameId = requestAnimationFrame(update);
      }
    };

    if (isRunning) {
      animationFrameId = requestAnimationFrame(update);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isRunning, tickRate, numRows, numCols, selectedRule]);

  // Convert Uint8Array to 2D array for rendering
  const gridForRender = useMemo(() => {
    const result = Array(numRows).fill(null).map(() => Array(numCols).fill(0));
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        result[i][j] = grid[i * numCols + j];
      }
    }
    return result;
  }, [grid, numRows, numCols]);

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <HoverCard>
          <HoverCardTrigger asChild>
            <select
              value={selectedRule}
              onChange={(e) => setSelectedRule(e.target.value)}
              onMouseDown={() => ruleHoverRef.current?.close()}
              className="bg-[#5C5470]/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-mono text-[#FAF0E6] shadow-lg"
              ref={ruleHoverRef}
            >
              <option value="conway">Conway's Game of Life</option>
              <option value="highLife">High Life</option>
              <option value="dayAndNight">Day & Night</option>
              <option value="seeds">Seeds</option>
            </select>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 bg-[#5C5470] text-[#FAF0E6] border-[#B9B4C7]">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">{selectedRule === 'conway' ? "Conway's Game of Life" : 
                selectedRule === 'highLife' ? "High Life" :
                selectedRule === 'dayAndNight' ? "Day & Night" : "Seeds"}</h4>
              <p className="text-sm whitespace-pre-line">{RULE_DESCRIPTIONS[selectedRule]}</p>
            </div>
          </HoverCardContent>
        </HoverCard>

        <HoverCard>
          <HoverCardTrigger asChild>
            <select
              value={selectedPattern}
              onChange={(e) => setSelectedPattern(e.target.value)}
              onMouseDown={() => patternHoverRef.current?.close()}
              className="bg-[#5C5470]/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-mono text-[#FAF0E6] shadow-lg"
              ref={patternHoverRef}
            >
              <option value="random">Random</option>
              {Object.keys(PATTERNS).map((pattern) => (
                <option key={pattern} value={pattern}>{pattern}</option>
              ))}
            </select>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 bg-[#5C5470] text-[#FAF0E6] border-[#B9B4C7]">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">{selectedPattern === 'random' ? 'Random Pattern' : selectedPattern}</h4>
              <p className="text-sm">{selectedPattern === 'random' ? 
                'Randomly places cells with 20% probability' : 
                PATTERN_DESCRIPTIONS[selectedPattern]}</p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      <BaseCanvas
        isRunning={isRunning}
        tickRate={tickRate}
        grid={gridForRender}
        setGrid={setGrid}
        onCellClick={handleCellClick}
        hideStepCounter={true}
      >
      </BaseCanvas>
    </div>
  );
} 