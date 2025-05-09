import { useState, useEffect, useCallback } from "react";
import BaseCanvas from "./BaseCanvas";

export default function TurmitesCanvas({ isRunning, tickRate }) {
  const numRows = 100;
  const numCols = 100;
  const [grid, setGrid] = useState(() => Array(numRows).fill(null).map(() => Array(numCols).fill(0)));
  const [stepCount, setStepCount] = useState(0);

  const updateTurmiteAndGrid = useCallback(() => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]);
      // TODO: Implement turmite rules
      setStepCount(prev => prev + 1);
      return newGrid;
    });
  }, []);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      const intervalTime = 1000 / tickRate;
      intervalId = setInterval(updateTurmiteAndGrid, intervalTime);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, tickRate, updateTurmiteAndGrid]);

  return (
    <BaseCanvas
      isRunning={isRunning}
      tickRate={tickRate}
      grid={grid}
      setGrid={setGrid}
      stepCount={stepCount}
      setStepCount={setStepCount}
    >
    </BaseCanvas>
  );
} 