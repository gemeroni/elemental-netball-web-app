export type Team = "Fire" | "Ice";

export interface Position {
  id: string;
  code: string;
  name: string;
  fireHex: string;
  iceHex: string;
  fireColorName: string;
  iceColorName: string;
  role: string;
  zones: string;
  matchup: string;
}

export const POSITIONS: Position[] = [
  {
    id: "gs",
    code: "GS",
    name: "Goal Shooter",
    fireHex: "#cc3333",
    iceHex: "#663399",
    fireColorName: "Red",
    iceColorName: "Purple",
    role: "Scores goals from inside the shooting circle.",
    zones: "Goal Third (attacking) + Shooting Circle (attacking)",
    matchup: "GK"
  },
  {
    id: "ga",
    code: "GA",
    name: "Goal Attack",
    fireHex: "#ef6d22",
    iceHex: "#0052b3",
    fireColorName: "Orange",
    iceColorName: "Blue",
    role: "Feeds the shooter and helps score goals.",
    zones: "Goal Third (attacking) + Centre Third + Shooting Circle (attacking)",
    matchup: "GD"
  },
  {
    id: "wa",
    code: "WA",
    name: "Wing Attack",
    fireHex: "#ffaa00",
    iceHex: "#009999",
    fireColorName: "Yellow",
    iceColorName: "Teal",
    role: "Sets up shots by feeding the ball into the circle.",
    zones: "Centre Third + Goal Third (attacking, no circle)",
    matchup: "WD"
  },
  {
    id: "c",
    code: "C",
    name: "Centre",
    fireHex: "#009933",
    iceHex: "#009933",
    fireColorName: "Green",
    iceColorName: "Green",
    role: "Links attack and defence across the whole court.",
    zones: "All thirds, no shooting circles",
    matchup: "C"
  },
  {
    id: "wd",
    code: "WD",
    name: "Wing Defence",
    fireHex: "#009999",
    iceHex: "#ffaa00",
    fireColorName: "Teal",
    iceColorName: "Yellow",
    role: "Stops the Wing Attack from feeding the ball in.",
    zones: "Centre Third + Goal Third (defending, no circle)",
    matchup: "WA"
  },
  {
    id: "gd",
    code: "GD",
    name: "Goal Defence",
    fireHex: "#0052b3",
    iceHex: "#ef6d22",
    fireColorName: "Blue",
    iceColorName: "Orange",
    role: "Marks the Goal Attack and blocks shots.",
    zones: "Goal Third (defending) + Centre Third + Shooting Circle (defending)",
    matchup: "GA"
  },
  {
    id: "gk",
    code: "GK",
    name: "Goal Keeper",
    fireHex: "#663399",
    iceHex: "#cc3333",
    fireColorName: "Purple",
    iceColorName: "Red",
    role: "Defends the goal post and intercepts shots.",
    zones: "Goal Third (defending) + Shooting Circle (defending)",
    matchup: "GS"
  }
];

export const getPositionByCode = (code: string) => POSITIONS.find(p => p.code === code);
export const getBibFilename = (code: string, team: Team) => {
  const pos = getPositionByCode(code);
  if (!pos) return "";
  const colorName = team === "Fire" ? pos.fireColorName : pos.iceColorName;
  return `${colorName}_${code}_${team}.svg`;
};
