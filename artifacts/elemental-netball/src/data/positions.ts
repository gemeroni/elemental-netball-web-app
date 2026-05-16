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
  note: string;
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
    role: "Score goals. Work inside the shooting circle with GA, hold your space, and convert every shot you get.",
    zones: "Attacking goal third only — including the shooting circle.",
    zoneCaption: "GS stays in the attacking goal third only. They can enter the shooting circle to shoot.",
    note: "GS and GA are the only two players allowed to shoot for goal — and only from inside the shooting circle.",
    matchup: "GK",
    matchupDescription:
      "GS fights for space inside the circle; GK fights to take it away. GS wins by getting free and converting; GK wins by contesting every shot and claiming the rebound.",
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
    role: "Feed the ball into the circle AND shoot. Link the midcourt to GS, and take your shot when you're inside the circle.",
    zones: "Centre third and attacking goal third — including the shooting circle.",
    zoneCaption: "GA can play in the centre third and the attacking goal third. They can enter the shooting circle.",
    note: "GA is one of only two players who can shoot. They cover more ground than GS — from centre to the circle.",
    matchup: "GD",
    matchupDescription:
      "GA needs separation to feed or shoot; GD works to deny every pass into the circle and challenge every shot. Whoever controls this matchup controls the attack.",
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
    role: "Feed shooting chances to GA and GS. Win the Centre Pass and deliver the ball into the circle — without entering it.",
    zones: "Centre third and attacking goal third — NOT the shooting circle.",
    zoneCaption: "WA can play in the centre third and the attacking goal third, but cannot enter the shooting circle.",
    note: "WA cannot shoot — they set up the shooters. Winning the Centre Pass is their most important moment.",
    matchup: "WD",
    matchupDescription:
      "WA tries to break free at the Centre Pass; WD tries to deny that first touch. Whoever wins this moment sets the tone for the whole possession.",
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
    role: "Take every Centre Pass and run the full court — attacking when your team has the ball, defending when they don't.",
    zones: "All three thirds of the court — NOT either shooting circle.",
    zoneCaption: "Centre is the only position that can play in all three thirds. They cannot enter either shooting circle.",
    note: "Centre does the most running of any player on court. They start every quarter of possession with the Centre Pass.",
    matchup: "C",
    matchupDescription:
      "Both Centres race to control the midcourt. The Centre with the ball drives the attack; the opposing Centre pressures and tries to force a turnover. The most physically demanding matchup on the court.",
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
    role: "Stop WA from feeding the circle. Make interceptions, shadow WA through the centre, and slow the attack before it starts.",
    zones: "Centre third and defensive goal third — NOT the shooting circle.",
    zoneCaption: "WD can play in the centre third and the defensive goal third, but cannot enter the shooting circle.",
    note: "WD cannot enter the shooting circle. Their job is to intercept — especially at the Centre Pass.",
    matchup: "WA",
    matchupDescription:
      "WD shadows WA through every pass. WA uses sharp leads to get free; WD uses positioning and timing to cut them off. This contest decides whether the attack gets clean ball.",
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
    role: "Reduce the effectiveness of GA. Win the ball in the centre, block entries into the circle, and challenge every shot.",
    zones: "Centre third and defensive goal third — including the shooting circle.",
    zoneCaption: "GD can play in the centre third and the defensive goal third. They can enter the shooting circle.",
    note: "GD covers the most ground of any defender — from the transverse line all the way back to the circle.",
    matchup: "GA",
    matchupDescription:
      "GD follows GA from the transverse line to the post, contesting every pass and pressuring every shot. GA uses pace and clever angles to get free; GD works to stay goal-side and force the turnover.",
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
    role: "Prevent GS from scoring. Contest every shot, compete for every rebound, and protect the post with GD.",
    zones: "Defensive goal third only — including the shooting circle.",
    zoneCaption: "GK stays in the defensive goal third only. They can enter the shooting circle to defend.",
    note: "GK primarily marks GS but must also cover GA when they enter the circle — two shooters, one keeper.",
    matchup: "GS",
    matchupDescription:
      "GK is the last barrier between GS and the net. GS wins by finding space inside the circle and converting; GK wins by making that space disappear and contesting every single shot.",
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
