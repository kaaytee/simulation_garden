import { useRef, useEffect } from "react";

export default function Canvas () {
  
  const canvasRef = useRef(null);
  const gridSize = 20; // Size of each cell in pixels
  const numRows = 20;
  const numCols = 30;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const width = numCols * gridSize;
      const height = numRows * gridSize;
      canvas.width = width;
      canvas.height = height;

      const drawGrid = () => {
        if (!ctx) return; 

        ctx.strokeStyle = '#000000'; 
        ctx.lineWidth = 2;

        // Draw vertical lines
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
      };

      drawGrid();
      console.log("Canvas element with grid:", canvas);
    }
  }, [gridSize, numRows, numCols]); 
  return (
    <>
      <canvas
        ref={canvasRef}
        className="bg-[#FAF0E6] w-4/5 rounded-2xl"
        style={{ minHeight: '400px' }}
      />
    </>
  )
}