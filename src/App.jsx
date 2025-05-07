import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import Canvas from "./components/Canvas";
function App() {
  const [option, setOption] = useState("langton's ants");
  const [options, setOptionss] = useState(["langton's ants", "cellular automata", "turmites"]);


  return (
    <div className="flex flex-col items-center min-h-svh bg-[#352F44] p-6">
      <header>
        <h1 className="text-[15px] font-semibold text-[#FAF0E6] mb-[10px]">Simulation Garden</h1>
      </header>
      <div className="flex flex-grow p-2 gap-3 w-full max-w-[1200px]">
        <div className="bg-[#5C5470] flex flex-col gap-3 p-3 w-1/5 rounded-2xl">
          {options.map((e) => {
            const isSelected = option === e;
            const buttonStyle = isSelected ? "bg-[#FAF0E6]" : "bg-[#B9B4C7]";
            const textStyle = "text-[12px] font-semibold text-black";
            const hoverStyle = `hover:${buttonStyle}`;

            return (
              <Button
                key={e}
                onClick={() => setOption(e)}
                className={`${buttonStyle} ${textStyle} ${hoverStyle}`}
              >
                {e}
              </Button>
            );
          })}
        </div>
        <Canvas></Canvas>

      </div>
    </div>
  );
}

export default App;