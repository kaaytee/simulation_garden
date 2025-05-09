import { Button } from "@/components/ui/button";
import { Flower } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#352F44] via-[#2A2438] to-[#352F44] flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center gap-3">
            <Flower className="w-12 h-12 text-[#FAF0E6]" />
            <h1 className="text-4xl sm:text-5xl font-bold text-[#FAF0E6] tracking-wide">Simulation Garden</h1>
          </div>
          <div className="h-1 w-32 sm:w-48 bg-[#B9B4C7] rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="bg-gradient-to-r from-[#5C5470] to-[#6B5B95] rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="space-y-6 text-[#FAF0E6]">
            <p className="text-lg sm:text-xl text-center leading-relaxed">
              Welcome to Simulation Garden, an interactive playground for exploring cellular automata and emergent patterns.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              <div className="bg-[#352F44]/50 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-semibold mb-3">Cellular Automata</h3>
                <p className="text-sm sm:text-base">
                  Explore classic cellular automata like Conway's Game of Life and discover how simple rules can create complex, beautiful patterns.
                </p>
              </div>
              
              <div className="bg-[#352F44]/50 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-semibold mb-3">Ant Simulations</h3>
                <p className="text-sm sm:text-base">
                  Watch as simple ant-like agents create intricate patterns through their movement and interaction with the environment.
                </p>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <Link to="/simulation">
                <Button
                  className="bg-[#B9B4C7] hover:bg-[#B9B4C7]/90 text-black text-lg font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[#B9B4C7] text-sm">
          <p>Explore the beauty of emergent patterns and cellular automata</p>
        </div>
      </div>
    </div>
  );
} 