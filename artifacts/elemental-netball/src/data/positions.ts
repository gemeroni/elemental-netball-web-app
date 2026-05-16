export type Team = "Fire" | "Ice";

export interface Position {
  id: string;
  code: string;
  name: string;
  fireHex: string;
  iceHex: string;
  fireColorName: string;
  iceColorName: string;
  tagline: string;
  role: string;
  zones: string;
  zoneCaption: string;
  matchup: string;
  matchupDescription: string;
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
    tagline: "the team's top scorer",
    role: "Lead strongly into space, hold position inside the goal circle, and use sharp footwork to outwit the defender and convert shots at goal.",
    zones: "Attacking Goal Third only — including inside the goal circle.",
    zoneCaption: "GS can play in the attacking Goal Third only, including inside the goal circle.",
    matchup: "GK",
    matchupDescription:
      "GS works to get into the goal circle, hold space, and convert. GK is the last barrier — contesting every lead into the circle, pressuring every shot, and fighting for the rebound. GS wins by getting free inside the circle; GK wins by taking that space away.",
  },
  {
    id: "ga",
    code: "GA",
    name: "Goal Attack",
    fireHex: "#ef6d22",
    iceHex: "#0052b3",
    fireColorName: "Orange",
    iceColorName: "Blue",
    tagline: "creator and scorer",
    role: "Link the midcourt with the goal circle, team up with GS, connect C and WA to the attack, and chase every rebound off the post.",
    zones: "Centre Third and attacking Goal Third — including inside the goal circle.",
    zoneCaption: "GA can play in the Centre Third and attacking Goal Third, including inside the goal circle.",
    matchup: "GD",
    matchupDescription:
      "GA is both a creator and a shooter — linking midcourt to the goal circle and teaming up with GS. GD tracks GA everywhere, looking to intercept every entry pass and pressure any shot GA attempts. GA wins by creating separation; GD wins by staying goal-side and tight.",
  },
  {
    id: "wa",
    code: "WA",
    name: "Wing Attack",
    fireHex: "#ffaa00",
    iceHex: "#009999",
    fireColorName: "Yellow",
    iceColorName: "Teal",
    tagline: "the playmaker",
    role: "Receive the Centre Pass, create space, and deliver the ball into the goal circle for GS and GA.",
    zones: "Centre Third and attacking Goal Third — cannot enter the goal circle.",
    zoneCaption: "WA can play in the Centre Third and attacking Goal Third, but cannot enter the goal circle.",
    matchup: "WD",
    matchupDescription:
      "WA's most important moment is the Centre Pass — they need to break free and give C a clean outlet. WD works to deny that first pass, shadow WA through the centre, and slow the attack. Whoever wins this matchup at each Centre Pass sets the tone for the whole possession.",
  },
  {
    id: "c",
    code: "C",
    name: "Centre",
    fireHex: "#009933",
    iceHex: "#009933",
    fireColorName: "Green",
    iceColorName: "Green",
    tagline: "the engine of the team",
    role: "Link attack and defence across the court. C is the only position that can enter all thirds — attacking when their team has the ball, defending when they don't.",
    zones: "All thirds of the court — except for goal circles.",
    zoneCaption: "C can play in all three thirds — the full length of the court. Cannot enter either goal circle.",
    matchup: "C",
    matchupDescription:
      "The C battle is the midcourt engine room. Both Centres compete for space, intercepts, and momentum. The C with the ball delivers the Centre Pass and drives the attack; the opposing C pressures, shadows, and tries to force a turnover. Centre attacks AND defends — it is the most demanding role on court.",
  },
  {
    id: "wd",
    code: "WD",
    name: "Wing Defence",
    fireHex: "#009999",
    iceHex: "#ffaa00",
    fireColorName: "Teal",
    iceColorName: "Yellow",
    tagline: "the pressure player",
    role: "Shadow WA, shut down their attacking moves, and slow the ball before it reaches the shooters.",
    zones: "Centre Third and defensive Goal Third — cannot enter the goal circle.",
    zoneCaption: "WD can play in the Centre Third and defensive Goal Third, but cannot enter the goal circle.",
    matchup: "WA",
    matchupDescription:
      "WD shadows WA through the centre, working to deny space and disrupt the Centre Pass. WA uses sharp leads and quick changes of direction to get free. WD wins by staying tight and forcing hesitation; WA wins by finding that half-step of separation at the right moment.",
  },
  {
    id: "gd",
    code: "GD",
    name: "Goal Defence",
    fireHex: "#0052b3",
    iceHex: "#ef6d22",
    fireColorName: "Blue",
    iceColorName: "Orange",
    tagline: "the defensive partner",
    role: "Stick with GA, block entry into the goal circle, challenge every shot at goal, and compete for every rebound.",
    zones: "Centre Third and defensive Goal Third — including inside the goal circle.",
    zoneCaption: "GD can play in the Centre Third and defensive Goal Third, including inside the goal circle.",
    matchup: "GA",
    matchupDescription:
      "GD sticks with GA from the transverse line to the goal circle, contesting every entry pass and challenging every shot. GA uses pace and clever angles to create separation. GD wins by staying goal-side; GA wins by finding that gap at exactly the right moment.",
  },
  {
    id: "gk",
    code: "GK",
    name: "Goal Keeper",
    fireHex: "#663399",
    iceHex: "#cc3333",
    fireColorName: "Purple",
    iceColorName: "Red",
    tagline: "the last line of defence",
    role: "Stop both shooters from scoring by contesting space, challenging every shot, and fighting for every rebound. Often the tallest player on the team.",
    zones: "Defensive Goal Third only — including inside the goal circle.",
    zoneCaption: "GK can play in the defensive Goal Third only, including inside the goal circle.",
    matchup: "GS",
    matchupDescription:
      "GK is the last barrier — their only job is to stop GS from scoring. Contest every lead into the goal circle, pressure every shot without obstructing, and win every rebound. GS wins if they get clear space inside the circle; GK wins by making sure they never do.",
  },
];

export const getPositionByCode = (code: string) =>
  POSITIONS.find((p) => p.code === code);

export const getBibFilename = (code: string, team: Team) => {
  const pos = getPositionByCode(code);
  if (!pos) return "";
  const colorName = team === "Fire" ? pos.fireColorName : pos.iceColorName;
  return `${colorName}_${code}_${team}.svg`;
};
