import AntsCanvas from "./AntsCanvas"
import CellularAutomataCanvas from "./CellularAutomataCanvas"
import TurmitesCanvas from "./TurmitesCanvas"

export default function Simulation({option, isRunning, tickRate}) {
  if (option === "langton's ants") {
    return <AntsCanvas selectedOption={option} isRunning={isRunning} tickRate={tickRate} />
  } else if (option === "cellular automata") {
    return <CellularAutomataCanvas selectedOption={option} isRunning={isRunning} tickRate={tickRate} />
  } else if (option === "turmites") {
    return <TurmitesCanvas selectedOption={option} isRunning={isRunning} tickRate={tickRate} />
  } else {
    return <div>No simulation selected</div>
  }
}