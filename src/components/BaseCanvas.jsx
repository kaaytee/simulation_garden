import { useState, useEffect, useCallback, useMemo } from "react";

export default function BaseCanvas({ 
  isRunning, 
  tickRate, 
  grid, 
  setGrid, 
  stepCount, 
  setStepCount,
  children 
}) {
  const gridSize = 25;
  const numRows = 100;
  const numCols = 100;
  
  // Zoom and drag state
  const [zoom, setZoom] = useState(1);
  const [dragStart, setDragStart] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Memoize grid cells to prevent unnecessary re-renders
  const gridCells = useMemo(() => 
    grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <div
          key={`${rowIndex}-${colIndex}`}
          className={`border border-[#B9B4C7]/20 outline-2 w-[${gridSize}px] h-[${gridSize}px] transition-colors duration-300 ${
            cell === 1 ? 'bg-[#352F44] shadow-inner' : 'bg-[#FAF0E6]'
          }`}
        />
      ))
    ), [grid, gridSize]);

  // Calculate max offset based on grid size and zoom
  const getMaxOffset = useCallback(() => {
    const totalWidth = numCols * gridSize;
    const totalHeight = numRows * gridSize;
    const scaledWidth = totalWidth * zoom;
    const scaledHeight = totalHeight * zoom;
    
    const maxX = Math.abs(scaledWidth - totalWidth) / 2;
    const maxY = Math.abs(scaledHeight - totalHeight) / 2;
    
    return { maxX, maxY };
  }, [numCols, numRows, gridSize, zoom]);

  // Handle zoom with mouse wheel
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prevZoom => {
      const newZoom = Math.max(0.5, Math.min(2, prevZoom + delta));
      const { maxX, maxY } = getMaxOffset();
      setOffset(prev => ({
        x: Math.min(maxX, Math.max(-maxX, prev.x)),
        y: Math.min(maxY, Math.max(-maxY, prev.y))
      }));
      return newZoom;
    });
  }, [getMaxOffset]);

  // Handle drag start
  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.grid-container')) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  }, [offset]);

  // Handle drag movement
  const handleMouseMove = useCallback((e) => {
    if (isDragging && dragStart) {
      requestAnimationFrame(() => {
        const { maxX, maxY } = getMaxOffset();
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        
        setOffset({
          x: Math.min(maxX, Math.max(-maxX, newX)),
          y: Math.min(maxY, Math.max(-maxY, newY))
        });
      });
    }
  }, [isDragging, dragStart, getMaxOffset]);

  // Handle drag end
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  // Add event listeners for drag
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className="h-full w-full overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 bg-[#5C5470]/90 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-mono shadow-lg transition-all duration-300 text-[#FAF0E6] hover:shadow-xl">
        Steps: {stepCount}
      </div>
      <div 
        className="absolute inset-0"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
      >
        <div 
          className="relative grid grid-container cursor-grab active:cursor-grabbing will-change-transform"
          style={{
            gridTemplateColumns: `repeat(${numCols}, ${gridSize}px)`,
            gridTemplateRows: `repeat(${numRows}, ${gridSize}px)`,
            transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${zoom})`,
            transformOrigin: 'center',
            position: 'absolute',
            left: '50%',
            top: '50%',
            translate: '-50% -50%'
          }}
        >
          {gridCells}
          {children}
        </div>
      </div>
    </div>
  );
} 