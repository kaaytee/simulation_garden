import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";
import Simulation from "./components/Simulation";

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
      // Limit maximum speed to 1000 
      setTickRate(Math.min(newRate, 1000));
    }
  }, [setTickRate]);

  return (
    <div className="flex flex-col items-center min-h-svh bg-[#352F44] p-6">
      <header className="w-full max-w-[1200px] mb-6">
        <h1 className="text-2xl font-bold text-[#FAF0E6] mb-2 tracking-wide">Simulation Garden</h1>
        <div className="h-1 w-20 bg-[#B9B4C7] rounded-full"></div>
      </header>
      
      <div className="flex justify-center mb-6 text-[#FAF0E6] w-full max-w-[1200px]">
        <Button 
          onClick={handleStartStop} 
          className="bg-[#5C5470] hover:bg-[#B9B4C7] text-sm font-semibold text-[#FAF0E6] rounded-lg mr-4 px-6 py-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {isRunning ? "Stop" : "Start"}
        </Button>
        <div className="flex items-center bg-[#5C5470] rounded-lg px-4 py-2 shadow-lg transition-all duration-300 hover:shadow-xl">
          <label htmlFor="tickRate" className="text-sm font-semibold mr-3">Speed</label>
          <div className="relative">
            <input
              id="tickRate"
              type="number"
              value={tickRate}
              onChange={handleTickRateChange}
              className="w-20 text-[#FAF0E6] text-center rounded-md text-sm bg-[#352F44]/50 border border-[#B9B4C7]/30 focus:outline-none focus:border-[#B9B4C7] focus:ring-1 focus:ring-[#B9B4C7] transition-all duration-300 "
            />
          </div>
        </div>
      </div>

      <div className="flex flex-grow p-2 gap-6 w-full max-w-[1200px]">
        <div className="bg-[#5C5470] flex flex-col gap-3 p-4 w-1/5 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl">
          {options.map((e) => {
            const isSelected = option === e;
            const buttonStyle = isSelected 
              ? "bg-[#FAF0E6] hover:bg-[#B9B4C7] shadow-md" 
              : "bg-[#B9B4C7] hover:bg-[#B9B4C7] hover:shadow-md";
            const textStyle = "text-sm font-semibold text-black transition-all duration-300";

            return (
              <Button
                key={e}
                onClick={() => handleOptionChange(e)}
                className={`${buttonStyle} ${textStyle} rounded-lg py-2 transform hover:-translate-y-0.5`}
              >
                {e}
              </Button>
            );
          })}
        </div>
        <div className="w-4/5 h-[calc(100vh-200px)] overflow-auto rounded-2xl shadow-xl bg-[#5C5470] p-4 transition-all duration-300 hover:shadow-2xl">
          {/* <Canvas selectedOption={option} isRunning={isRunning} tickRate={tickRate} /> */}
          <Simulation option={option} isRunning={isRunning} tickRate={tickRate} />  
        </div>
      </div>
    </div>
  );
}

export default App;