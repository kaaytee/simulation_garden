import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Flower } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Simulation from "./components/Simulation";
import { ToastContainer } from "./components/ui/toast";
import { useSimulation } from "./lib/hooks/useSimulation";
import { RULE_DESCRIPTIONS, SIMULATION_OPTIONS } from "./lib/constants";
import LandingPage from "./components/LandingPage";
import { useNavigate } from "react-router-dom";
function SimulationPage() {
  const {
    option,
    isRunning,
    tickRate,
    resetKey,
    toasts,
    addToast,
    removeToast,
    handleOptionChange,
    handleStartStop,
    handleReset,
    handleTickRateChange,
    handleSpeedAdjustment
  } = useSimulation();

  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center min-h-svh bg-gradient-to-br from-[#352F44] via-[#2A2438] to-[#352F44] p-2 sm:p-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <header className="w-full max-w-[1200px] mb-4 sm:mb-6">
        <div className="flex flex-col items-center justify-center bg-gradient-to-r from-[#5C5470] to-[#6B5B95] rounded-lg px-4 sm:px-6 py-3 sm:py-4 shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center justify-between w-full gap-3">
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-3">
                <Flower className="w-8 h-8 text-[#FAF0E6]" />
                <h1 className="text-xl sm:text-2xl font-bold text-[#FAF0E6] tracking-wide">Simulation Garden</h1>
              </div>
              <div className="h-1 w-24 sm:w-32 bg-[#B9B4C7] rounded-full mt-2"></div>
            </div>
            <Button 
              onClick={() => navigate('/')}
              className="bg-[#B9B4C7] hover:bg-[#B9B4C7] text-sm font-semibold text-black rounded-lg px-4 sm:px-6 py-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Back
            </Button>
          </div>
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
              max={option === "classic" ? "5" : undefined}
              value={tickRate}
              onChange={handleTickRateChange}
              className="w-16 sm:w-20 text-[#FAF0E6] text-center rounded-md text-sm bg-[#352F44]/50 border border-[#B9B4C7]/30 focus:outline-none focus:border-[#B9B4C7] focus:ring-1 focus:ring-[#B9B4C7] transition-all duration-300"
            />
          </div>
        </div>
        {option === "classic" && (
          <div className="flex gap-2">
            <Button
              onClick={() => handleSpeedAdjustment(-1)}
              className="bg-[#B9B4C7] hover:bg-[#B9B4C7] text-lg font-bold text-black rounded-lg px-3 py-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              -
            </Button>
            <Button
              onClick={() => handleSpeedAdjustment(1)}
              className="bg-[#B9B4C7] hover:bg-[#B9B4C7] text-lg font-bold text-black rounded-lg px-3 py-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              +
            </Button>
          </div>
        )}
        {option.startsWith("ants/") && (
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
        <div className="bg-gradient-to-br from-[#5C5470] to-[#6B5B95] flex flex-row sm:flex-col gap-2 sm:gap-5 p-3 sm:p-4 w-full sm:w-1/4 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl">
          {SIMULATION_OPTIONS.map((category) => (
            <div key={category.category} className="flex flex-col gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-[#FAF0E6] px-2">{category.category}</h3>
              {category.items.map((item) => {
                const isSelected = option === item.id;
                const buttonStyle = isSelected 
                  ? "bg-[#FAF0E6] hover:bg-[#FAF0E6] shadow-md" 
                  : "bg-[#B9B4C7] hover:bg-[#B9B4C7] hover:shadow-md";
                const textStyle = "text-base sm:text-lg font-semibold text-black transition-all duration-300";

                if (item.id.startsWith('classic/') || item.id.startsWith('ants/')) {
                  const ruleName = item.id.split('/')[1];
                  return (
                    <HoverCard key={item.id}>
                      <HoverCardTrigger asChild>
                        <Button
                          onClick={() => handleOptionChange(item.id)}
                          className={`${buttonStyle} ${textStyle} rounded-lg py-2 px-4 w-full text-center transform hover:-translate-y-0.5`}
                        >
                          {item.name}
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-[calc(100vw-2rem)] sm:w-80 bg-[#5C5470] text-[#FAF0E6] border-[#B9B4C7]">
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">{item.name}</h4>
                          <p className="text-sm whitespace-pre-line">{RULE_DESCRIPTIONS[ruleName]}</p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  );
                }

                return (
                  <Button
                    key={item.id}
                    onClick={() => handleOptionChange(item.id)}
                    className={`${buttonStyle} ${textStyle} rounded-lg py-2 px-4 w-full text-center transform hover:-translate-y-0.5`}
                  >
                    {item.name}
                  </Button>
                );
              })}
            </div>
          ))}
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/simulation" element={<SimulationPage />} />
      </Routes>
    </Router>
  );
}

export default App;