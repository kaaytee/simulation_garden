import { useRef, useEffect, useState, useCallback } from "react";

export default function Canvas({ selectedOption }) {
  const canvasRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const scaleFactor = 1.1;
  const gridSize = 25;
  const numRows = 100;
  const numCols = 100;
  const minZoomLevel = 1;
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [grid, setGrid] = useState(() => Array(numRows).fill(null).map(() => Array(numCols).fill(0))); 
  const [antPosition, setAntPosition] = useState({ row: Math.floor(numRows / 2), col: Math.floor(numCols / 2) });
  const [antOrientation, setAntOrientation] = useState(0); 
  const [isRunning, setIsRunning] = useState(false);
  const animationFrameId = useRef(null);

  const drawGrid = useCallback((ctx, currentGrid) => {
    const width = numCols * gridSize;
    const height = numRows * gridSize;

    ctx.clearRect(0, 0, width, height);
    ctx.setTransform(zoomLevel, 0, 0, zoomLevel, offsetX, offsetY);

    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        ctx.fillStyle = currentGrid[r][c] === 1 ? '#000000' : '#FAF0E6';
        ctx.fillRect(c * gridSize, r * gridSize, gridSize, gridSize);
      }
    }

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 0.5 / zoomLevel; 
    for (let i = 0; i <= numCols; i++) {
      const x = i * gridSize;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let i = 0; i <= numRows; i++) {
      const y = i * gridSize;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const antX = antPosition.col * gridSize + gridSize / 2;
    const antY = antPosition.row * gridSize + gridSize / 2;
    const antSize = gridSize / 3;
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(antX, antY, antSize, 0, 2 * Math.PI);
    ctx.fill();
  }, [antPosition, gridSize, numCols, numRows, offsetX, offsetY, zoomLevel]);

  const updateAntAndGrid = useCallback(() => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]);
      let { row: currentRow, col: currentCol } = antPosition;
      let currentOrientation = antOrientation;

      if (currentRow >= 0 && currentRow < numRows && currentCol >= 0 && currentCol < numCols) {
        const currentColor = newGrid[currentRow][currentCol];
        newGrid[currentRow][currentCol] = 1 - currentColor; 


        let nextOrientation;
        if (currentColor === 0) { 
          nextOrientation = (currentOrientation + 1) % 4;
        } else { 
          nextOrientation = (currentOrientation + 3) % 4;
        }
        setAntOrientation(nextOrientation);

        let nextRow = currentRow;
        let nextCol = currentCol;
        switch (nextOrientation) {
          case 0: // Right
            nextCol++;
            break;
          case 1: // Down
            nextRow++;
            break;
          case 2: // Left
            nextCol--;
            break;
          case 3: // Up
            nextRow--;
            break;
          default:
            break;
        }
        setAntPosition({ row: nextRow, col: nextCol });
      }
      return newGrid;
    });
  }, [antOrientation, antPosition, numCols, numRows]);

  const gameLoop = useCallback(() => {
    updateAntAndGrid();
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      drawGrid(ctx, grid);
    }
  }, [updateAntAndGrid, drawGrid, grid, isRunning]);

  useEffect(() => {
    if (selectedOption === "langton's ants" && !isRunning) {
      setIsRunning(true);
    } else if (selectedOption !== "langton's ants" && isRunning) {
      setIsRunning(false);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      setGrid(() => Array(numRows).fill(null).map(() => Array(numCols).fill(0)));
      setAntPosition({ row: Math.floor(numRows / 2), col: Math.floor(numCols / 2) });
      setAntOrientation(0);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    if (isRunning && selectedOption === "langton's ants") {
      animationFrameId.current = requestAnimationFrame(gameLoop);
    } else if (!isRunning && animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }

  }, [selectedOption, isRunning, gameLoop, numRows, numCols]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const width = numCols * gridSize;
      const height = numRows * gridSize;
      canvas.width = width;
      canvas.height = height;
      drawGrid(ctx, grid); 

      const handleWheel = (event) => {
        event.preventDefault();
        const scaleAmount = event.deltaY > 0 ? 1 / scaleFactor : scaleFactor;
        const newZoomLevel = zoomLevel * scaleAmount;

        if (newZoomLevel < minZoomLevel && event.deltaY > 0) {
          return;
        }

        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const focalX = (mouseX - offsetX) / zoomLevel;
        const focalY = (mouseY - offsetY) / zoomLevel;

        setZoomLevel(newZoomLevel);
        setOffsetX(offsetX - focalX * (scaleAmount - 1));
        setOffsetY(offsetY - focalY * (scaleAmount - 1));
      };

      const handleMouseDown = (event) => {
        setIsDragging(true);
        const rect = canvas.getBoundingClientRect();
        setDragStart({ x: event.clientX - rect.left - offsetX, y: event.clientY - rect.top - offsetY });
        canvas.style.cursor = 'grabbing';
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        canvas.style.cursor = 'grab';
      };

      const handleMouseMove = (event) => {
        if (!isDragging) return;
        const rect = canvas.getBoundingClientRect();
        const newOffsetX = event.clientX - rect.left - dragStart.x;
        const newOffsetY = event.clientY - rect.top - dragStart.y;
        setOffsetX(newOffsetX);
        setOffsetY(newOffsetY);
      };

      canvas.addEventListener('wheel', handleWheel, { passive: false });
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('mouseout', handleMouseUp);
      canvas.addEventListener('mousemove', handleMouseMove);

      return () => {
        canvas.removeEventListener('wheel', handleWheel);
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('mouseout', handleMouseUp);
        canvas.removeEventListener('mousemove', handleMouseMove);
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
      };
    }
  }, [zoomLevel, gridSize, numRows, numCols, scaleFactor, minZoomLevel, isDragging, dragStart, offsetX, offsetY, drawGrid, grid]);

  return (
    <canvas
      ref={canvasRef}
      className="bg-[#FAF0E6] w-4/5 rounded-2xl cursor-grab"
      style={{ minHeight: '500px' }}
    />
  );
}