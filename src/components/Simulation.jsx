import { lazy, Suspense } from 'react';
import React from 'react';

const AntsCanvas = lazy(() => import("./AntsCanvas"));
const CellularAutomataCanvas = lazy(() => import("./CellularAutomataCanvas"));
const TurmitesCanvas = lazy(() => import("./TurmitesCanvas"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FAF0E6]"></div>
  </div>
);

const Simulation = React.memo(({ option, isRunning, tickRate }) => {
  if (option.startsWith("classic/")) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <CellularAutomataCanvas 
          selectedRule={option.split('/')[1]} 
          isRunning={isRunning} 
          tickRate={tickRate} 
        />
      </Suspense>
    );
  } else if (option === "ants/langton") {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <AntsCanvas 
          selectedOption={option} 
          isRunning={isRunning} 
          tickRate={tickRate} 
        />
      </Suspense>
    );
  } else if (option === "ants/turmites") {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <TurmitesCanvas 
          selectedOption={option} 
          isRunning={isRunning} 
          tickRate={tickRate} 
        />
      </Suspense>
    );
  } else {
    return <div>No simulation selected</div>;
  }
});

Simulation.displayName = 'Simulation';

export default Simulation;