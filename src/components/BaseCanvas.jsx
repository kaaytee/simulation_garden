import { useState, useEffect, useCallback, useMemo } from "react";

export default function BaseCanvas({ 
  isRunning, 
  tickRate, 
  grid, 
  setGrid, 
  stepCount, 
  setStepCount,
  onCellClick,
  hideStepCounter = false,
  children 
}) {
  const gridSize = 20;
  const numRows = 100;
  const numCols = 100;
  
  const [zoom, setZoom] = useState(1);
  const [dragStart, setDragStart] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const gridCells = useMemo(() => 
    grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <div
          key={`${rowIndex}-${colIndex}`}
          className={`border border-[#B9B4C7]/20 outline-2 w-[${gridSize}px] h-[${gridSize}px] transition-colors duration-300 ${
            cell === 1 ? 'bg-[#352F44] shadow-inner' : 'bg-[#FAF0E6]'
          }`}
          onClick={(e) => {
            if (!isDragging && onCellClick) {
              e.stopPropagation();
              onCellClick(rowIndex, colIndex);
            }
          }}
        />
      ))
    ), [grid, gridSize, isDragging, onCellClick]);

  const getMaxOffset = useCallback(() => {
    const totalWidth = numCols * gridSize;
    const totalHeight = numRows * gridSize;
    const scaledWidth = totalWidth * zoom;
    const scaledHeight = totalHeight * zoom;
    
    const maxX = Math.abs(scaledWidth - totalWidth) / 2;
    const maxY = Math.abs(scaledHeight - totalHeight) / 2;
    
    return { maxX, maxY };
  }, [numCols, numRows, gridSize, zoom]);

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

  const handleTouchStart = useCallback((e) => {
    if (e.target.closest('.grid-container')) {
      e.preventDefault();
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
    }
  }, [offset]);

  const handleTouchMove = useCallback((e) => {
    if (isDragging && dragStart) {
      e.preventDefault();
      const touch = e.touches[0];
      const { maxX, maxY } = getMaxOffset();
      const newX = touch.clientX - dragStart.x;
      const newY = touch.clientY - dragStart.y;
      
      setOffset({
        x: Math.min(maxX, Math.max(-maxX, newX)),
        y: Math.min(maxY, Math.max(-maxY, newY))
      });
    }
  }, [isDragging, dragStart, getMaxOffset]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.grid-container')) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  }, [offset]);

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

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div className="h-full w-full overflow-hidden relative">
      {!hideStepCounter && (
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 bg-[#5C5470]/90 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-mono shadow-lg transition-all duration-300 text-[#FAF0E6] hover:shadow-xl">
          Steps: {stepCount}
        </div>
      )}
      <div 
        className="absolute inset-0 touch-none"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
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