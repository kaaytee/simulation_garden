import { useState, useEffect, useCallback } from "react";
import BaseCanvas from "./BaseCanvas";

export default function AntsCanvas({ isRunning, tickRate }) {
  const numRows = 100;
  const numCols = 100;
  const [grid, setGrid] = useState(() => Array(numRows).fill(null).map(() => Array(numCols).fill(0)));
  const [antPosition, setAntPosition] = useState({ row: Math.floor(numRows / 2), col: Math.floor(numCols / 2) });
  const [antOrientation, setAntOrientation] = useState(0);
  const [stepCount, setStepCount] = useState(0);

  const updateAntAndGrid = useCallback(() => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]);
      const { row: currentRow, col: currentCol } = antPosition;
      const currentOrientation = antOrientation;

      if (currentRow >= 0 && currentRow < numRows && currentCol >= 0 && currentCol < numCols) {
        const currentColor = newGrid[currentRow][currentCol];
        newGrid[currentRow][currentCol] = 1 - currentColor;

        const nextOrientation = currentColor === 0 
          ? (currentOrientation + 3) % 4  // Turn LEFT on white
          : (currentOrientation + 1) % 4; // Turn RIGHT on black

        let nextRow = currentRow;
        let nextCol = currentCol;
        switch (nextOrientation) {
          case 0: // Up
            nextRow = Math.max(nextRow - 1, 0);
            break;
          case 1: // Right
            nextCol = Math.min(nextCol + 1, numCols - 1);
            break;
          case 2: // Down
            nextRow = Math.min(nextRow + 1, numRows - 1);
            break;
          case 3: // Left
            nextCol = Math.max(nextCol - 1, 0);
            break;
          default:
            break;
        }

        setAntPosition({ row: nextRow, col: nextCol });
        setAntOrientation(nextOrientation);
        setStepCount(prev => prev + 1);
      }
      return newGrid;
    });
  }, [antOrientation, antPosition, numCols, numRows]);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      const intervalTime = 1000 / tickRate;
      intervalId = setInterval(updateAntAndGrid, intervalTime);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, tickRate, updateAntAndGrid]);

  return (
    <BaseCanvas
      isRunning={isRunning}
      tickRate={tickRate}
      grid={grid}
      setGrid={setGrid}
      stepCount={stepCount}
      setStepCount={setStepCount}
    >
      <div
        className="absolute rounded-full bg-red-500 will-change-transform transition-transform duration-300 shadow-lg"
        style={{
          width: '12.5px',
          height: '12.5px',
          left: `${antPosition.col * 25 + 6.25}px`,
          top: `${antPosition.row * 25 + 8.33}px`,
          transform: `rotate(${antOrientation * 90}deg)`,
          boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
        }}
      />
    </BaseCanvas>
  );
}