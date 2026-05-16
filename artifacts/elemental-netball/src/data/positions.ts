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
    role: "GS works inside the shooting circle alongside GA to score goals for their team. GS holds space, creates leads to receive the ball, and converts every shot opportunity to help their team win.",
    zones: "Attacking goal third only — including the shooting circle.",
    zoneCaption: "GS stays in the attacking goal third only. They can enter the shooting circle to shoot.",
    note: "GS and GA are the only two players allowed to shoot for goal — and only from inside the shooting circle.",
    matchup: "GK",
    matchupDescription:
      "GS fights for space inside the circle; GK fights to take it away. GS wins by getting free and converting every chance; GK wins by contesting every shot and claiming the rebound.",
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
    role: "GA works with C and WA to bring the ball from midcourt into the goal circle. Inside the circle, GA and GS work together to shoot goals for their team, making GA one of only two players on the court who can score.",
    zones: "Centre third and attacking goal third — including the shooting circle.",
    zoneCaption: "GA can play in the centre third and the attacking goal third. They can enter the shooting circle.",
    note: "GA is one of only two players who can shoot for goal. They cover more ground than GS — from the centre all the way to the circle.",
    matchup: "GD",
    matchupDescription:
      "GA needs separation to feed the ball or shoot; GD works to deny every pass into the circle and challenge every shot. Whoever controls this matchup controls the attack.",
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
    role: "WA works with C to move the ball into the attacking half and deliver it into the shooting circle for GA and GS to score. WA wins the centre pass at the start of each quarter and drives the team's attack — but cannot enter the shooting circle.",
    zones: "Centre third and attacking goal third — NOT the shooting circle.",
    zoneCaption: "WA can play in the centre third and the attacking goal third, but cannot enter the shooting circle.",
    note: "WA cannot shoot for goal — their job is to set up the shooters. Winning the centre pass is their most important moment.",
    matchup: "WD",
    matchupDescription:
      "WA tries to break free at the centre pass; WD tries to deny that first touch. Whoever wins this moment sets the tone for the whole possession.",
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
    role: "C takes every centre pass and covers the whole court to support both attack and defence. C links the defensive and attacking halves of the team, driving the ball forward when attacking and working hard to win it back when defending.",
    zones: "All three thirds of the court — NOT either shooting circle.",
    zoneCaption: "Centre is the only position that can play in all three thirds. They cannot enter either shooting circle.",
    note: "Centre does the most running of any player on court. They start every quarter of possession with the centre pass.",
    matchup: "C",
    matchupDescription:
      "Both Centres race to control the midcourt. The Centre with the ball drives the attack; the opposing Centre pressures and tries to force a turnover. This is the most physically demanding matchup on the court.",
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
    role: "WD shadows WA through the centre third and defensive half, working to intercept passes and prevent clean ball from reaching the shooting circle. WD cannot enter the shooting circle, so their job is to apply pressure early and cut off the attack before it builds.",
    zones: "Centre third and defensive goal third — NOT the shooting circle.",
    zoneCaption: "WD can play in the centre third and the defensive goal third, but cannot enter the shooting circle.",
    note: "WD cannot enter the shooting circle. Their job is to intercept passes — especially at the centre pass.",
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
    role: "GD follows GA from the transverse line all the way back to the goal circle, contesting every pass and blocking entries into the shooting area. GD can enter the shooting circle to challenge shots and help GK protect the goal.",
    zones: "Centre third and defensive goal third — including the shooting circle.",
    zoneCaption: "GD can play in the centre third and the defensive goal third. They can enter the shooting circle.",
    note: "GD covers the most ground of any defender — from the transverse line all the way back to the shooting circle.",
    matchup: "GA",
    matchupDescription:
      "GD follows GA from the transverse line to the circle, contesting every pass and pressuring every shot. GA uses pace and clever angles to get free; GD works to stay goal-side and force the turnover.",
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
    role: "GK is the last line of defence, marking GS and protecting the goal from both GS and GA inside the shooting circle. GK contests every shot, competes for every rebound, and works with GD to make scoring as difficult as possible for the opposing shooters.",
    zones: "Defensive goal third only — including the shooting circle.",
    zoneCaption: "GK stays in the defensive goal third only. They can enter the shooting circle to defend.",
    note: "GK primarily marks GS but must also cover GA when they enter the circle — two shooters, one keeper.",
    matchup: "GS",
    matchupDescription:
      "GK is the last barrier between GS and the goal. GS wins by finding space inside the circle and converting every chance; GK wins by making that space disappear and contesting every single shot.",
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
