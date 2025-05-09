import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";
import Simulation from "./components/Simulation";
import { ToastContainer } from "./components/ui/toast";
import { Flower } from "lucide-react";

function App() {
  const [option, setOption] = useState("langton's ants");
  const [options, setOptions] = useState(["langton's ants", "cellular automata", "turmites"]);
  const [isRunning, setIsRunning] = useState(false);
  const [tickRate, setTickRate] = useState(1); 
  const [resetKey, setResetKey] = useState(0);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const handleOptionChange = useCallback((newOption) => {
    setOption(newOption);
    setIsRunning(false);
  }, [setOption, setIsRunning]);

  const handleStartStop = useCallback(() => {
    setIsRunning((prev) => {
      const newState = !prev;
      addToast(newState ? "Simulation started" : "Simulation paused", newState ? "success" : "info");
      return newState;
    });
  }, [setIsRunning, addToast]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setResetKey(prev => prev + 1);
    addToast("Simulation reset", "info");
  }, [addToast]);

  const handleTickRateChange = useCallback((event) => {
    const newRate = parseInt(event.target.value, 10);
    if (!isNaN(newRate)) {
      // capped between 1 and 5 for cellular automata
      if (option === "cellular automata") {
        setTickRate(Math.max(1, Math.min(5, newRate)));
      } else {
        //  langton's Ants, allow higher speeds
        setTickRate(Math.max(1, newRate));
      }
    }
  }, [setTickRate, option]);

  const handleSpeedAdjustment = useCallback((adjustment) => {
    setTickRate(prev => Math.max(1, prev + adjustment));
  }, []);

  return (
    <div className="flex flex-col items-center min-h-svh bg-gradient-to-br from-[#352F44] via-[#2A2438] to-[#352F44] p-2 sm:p-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <header className="w-full max-w-[1200px] mb-4 sm:mb-6">
        <div className="flex flex-col items-center justify-center items-start bg-gradient-to-r from-[#5C5470] to-[#6B5B95] rounded-lg px-4 sm:px-6 py-3 sm:py-4 shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center gap-3">
            <Flower className="w-8 h-8 text-[#FAF0E6]" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#FAF0E6] mb-2 sm:mb-3 tracking-wide">Simulation Garden</h1>
          </div>
          <div className="h-1 w-24 sm:w-32 bg-[#B9B4C7] rounded-full"></div>
        </div>
      </header>
      
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-4 sm:mb-6 text-[#FAF0E6] bg-gradient-to-r from-[#5C5470] to-[#6B5B95] rounded-lg px-4 sm:px-6 py-3 sm:py-4 shadow-lg transition-all duration-300 hover:shadow-xl w-full sm:w-2/5 max-w-[1200px]">
        <Button 
          onClick={handleStartStop} 
          className="bg-[#B9B4C7] hover:bg-[#B9B4C7] text-sm font-semibold text-black rounded-lg px-4 sm:px-6 py-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {isRunning ? "Stop" : "Start"}
        </Button>
        <Button 
          onClick={handleReset}
          className="bg-[#B9B4C7] hover:bg-[#B9B4C7] text-sm font-semibold text-black rounded-lg px-4 sm:px-6 py-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Reset
        </Button>
        <div className="flex items-center bg-[#B9B4C7] rounded-lg px-3 sm:px-4 py-2 shadow-lg transition-all duration-300 hover:shadow-xl">
          <label htmlFor="tickRate" className="text-sm font-semibold mr-2 sm:mr-3 text-black">Speed</label>
          <div className="relative">
            <input
              id="tickRate"
              type="number"
              min="1"
              max={option === "cellular automata" ? "5" : undefined}
              value={tickRate}
              onChange={handleTickRateChange}
              className="w-16 sm:w-20 text-[#FAF0E6] text-center rounded-md text-sm bg-[#352F44]/50 border border-[#B9B4C7]/30 focus:outline-none focus:border-[#B9B4C7] focus:ring-1 focus:ring-[#B9B4C7] transition-all duration-300"
            />
          </div>
        </div>
        {option === "langton's ants" && (
          <div className="flex gap-2">
            <Button
              onClick={() => handleSpeedAdjustment(-100)}
              className="bg-[#B9B4C7] hover:bg-[#B9B4C7] text-sm font-semibold text-black rounded-lg px-2 py-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              -100
            </Button>
            <Button
              onClick={() => handleSpeedAdjustment(-10)}
              className="bg-[#B9B4C7] hover:bg-[#B9B4C7] text-sm font-semibold text-black rounded-lg px-2 py-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              -10
            </Button>
            <Button
              onClick={() => handleSpeedAdjustment(10)}
              className="bg-[#B9B4C7] hover:bg-[#B9B4C7] text-sm font-semibold text-black rounded-lg px-2 py-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              +10
            </Button>
            <Button
              onClick={() => handleSpeedAdjustment(100)}
              className="bg-[#B9B4C7] hover:bg-[#B9B4C7] text-sm font-semibold text-black rounded-lg px-2 py-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              +100
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row flex-grow p-2 gap-4 sm:gap-6 w-full max-w-[1200px]">
        <div className="bg-gradient-to-br from-[#5C5470] to-[#6B5B95] flex flex-row sm:flex-col gap-2 sm:gap-5 p-3 sm:p-4 w-full sm:w-1/5 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl">
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
                className={`${buttonStyle} ${textStyle} rounded-lg h-1/10 py-2 flex-1 sm:flex-none transform hover:-translate-y-0.5`}
              >
                {e}
              </Button>
            );
          })}
        </div>
        <div className="w-full sm:w-4/5 h-[calc(100vh-300px)] sm:h-[calc(100vh-200px)] overflow-auto rounded-2xl shadow-xl bg-gradient-to-br from-[#5C5470] to-[#6B5B95] p-3 sm:p-4 transition-all duration-300 hover:shadow-2xl">
          <Simulation 
            key={resetKey}
            option={option} 
            isRunning={isRunning} 
            tickRate={tickRate} 
          />  
        </div>
      </div>
    </div>
  );
}

export default App;