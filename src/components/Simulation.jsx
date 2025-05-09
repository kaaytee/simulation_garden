import AntsCanvas from "./AntsCanvas"
import CellularAutomataCanvas from "./CellularAutomataCanvas"
import TurmitesCanvas from "./TurmitesCanvas"

export default function Simulation({option, isRunning, tickRate}) {
  if (option === "classic") {
    return <CellularAutomataCanvas isRunning={isRunning} tickRate={tickRate} />
  } else if (option === "ants/langton") {
    return <AntsCanvas selectedOption={option} isRunning={isRunning} tickRate={tickRate} />
  } else if (option === "ants/turmites") {
    return <TurmitesCanvas selectedOption={option} isRunning={isRunning} tickRate={tickRate} />
  } else {
    return <div>No simulation selected</div>
  }
}