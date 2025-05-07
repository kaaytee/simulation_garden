import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";
import Canvas from "./components/Canvas";

function App() {
  const [option, setOption] = useState("langton's ants");
  const [options, setOptions] = useState(["langton's ants", "cellular automata", "turmites"]);
  const [isRunning, setIsRunning] = useState(false);
  const [tickRate, setTickRate] = useState(60); // Ticks per second

  const handleOptionChange = useCallback((newOption) => {
    setOption(newOption);
    setIsRunning(false); // Stop simulation when option changes
  }, [setOption, setIsRunning]);

  const handleStartStop = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, [setIsRunning]);

  const handleTickRateChange = useCallback((event) => {
    const newRate = parseInt(event.target.value, 10);
    if (!isNaN(newRate) && newRate > 0) {
      setTickRate(newRate);
    }
  }, [setTickRate]);

  return (
    <div className="flex flex-col items-center min-h-svh bg-[#352F44] p-6">
      <header>
        <h1 className="text-[15px] font-semibold text-[#FAF0E6] mb-[10px]">Simulation Garden</h1>
      </header>
      <div className="flex justify-center mb-4 text-[#FAF0E6]">
        <Button onClick={handleStartStop} className="bg-[#5C5470] hover:bg-[#B9B4C7] text-[12px] font-semibold text-black rounded-md mr-2">
          {isRunning ? "Stop" : "Start"}
        </Button>
        <div className="flex items-center">
          <label htmlFor="tickRate" className="text-[12px] font-semibold mr-2">Speed:</label>
          <input
            id="tickRate"
            type="number"
            value={tickRate}
            onChange={handleTickRateChange}
            className="w-20 text-black text-center rounded-md text-[12px]"
          />
          <span className="ml-1 text-[12px]">Hz</span>
        </div>
      </div>
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
                onClick={() => handleOptionChange(e)}
                className={`${buttonStyle} ${textStyle} ${hoverStyle}`}
              >
                {e}
              </Button>
            );
          })}
        </div>
        <Canvas selectedOption={option} isRunning={isRunning} tickRate={tickRate} />
      </div>
    </div>
  );
}

export default App;