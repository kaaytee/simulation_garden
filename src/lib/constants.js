const SIMULATION_OPTIONS = [
  {
    category: "Classic Rules",
    items: [
      { id: "classic/conway", name: "Conway's Game of Life" },
      { id: "classic/highLife", name: "High Life" },
      { id: "classic/dayAndNight", name: "Day & Night" },
      { id: "classic/seeds", name: "Seeds" },
      { id: "classic/briansBrain", name: "Brian's Brain" }
    ]
  },
  {
    category: "Ants",
    items: [
      { id: "ants/langton", name: "Langton's Ant" },
      { id: "ants/turmites", name: "Turmites" }
    ]
  }
];

const RULE_DESCRIPTIONS = {
  conway: "Conway's Game of Life:\n• Any live cell with 2 or 3 neighbors survives\n• Any dead cell with exactly 3 neighbors becomes alive\n• All other cells die or stay dead",
  highLife: "High Life:\n• Similar to Conway's Game of Life\n• Additional rule: dead cells with 6 neighbors become alive\n• Creates more complex patterns and replicators",
  dayAndNight: "Day & Night:\n• Symmetrical rules for birth and survival\n• Cells survive with 3,4,6,7,8 neighbors\n• Dead cells become alive with 3,6,7,8 neighbors\n• Creates interesting symmetrical patterns",
  seeds: "Seeds:\n• Simple rule: cells only live for one generation\n• Dead cells with exactly 2 neighbors become alive\n• All live cells die in the next generation\n• Creates explosive growth patterns",
  briansBrain: "Brian's Brain:\n• Three states: off (0), on (1), dying (2)\n• Off cells turn on if they have exactly 2 neighbors\n• On cells always go to dying state\n• Dying cells always turn off\n• Creates interesting oscillating patterns",
  langton: "Langton's Ant:\n• A simple ant that follows these rules:\n• On a white square, turn 90° right, flip the color, move forward\n• On a black square, turn 90° left, flip the color, move forward\n• Creates complex emergent patterns",
  turmites: "Turmites:\n• Generalized version of Langton's Ant\n• Multiple ants with different rules\n• Creates more complex emergent patterns"
};

export { SIMULATION_OPTIONS, RULE_DESCRIPTIONS }; 