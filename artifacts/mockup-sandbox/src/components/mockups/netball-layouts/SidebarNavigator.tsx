import './_group.css';
import { useState } from 'react';

const POSITIONS = [
  { code:'GS', name:'Goal Shooter',  fireHex:'#cc3333', iceHex:'#663399', tagline:'top scorer',        matchup:'GK', role:'GS works inside the shooting circle to score goals. Holds space and converts every shot.', zoneCaption:'Attacking goal third only — including the shooting circle.', matchupDesc:'GS fights for space; GK fights to take it away.' },
  { code:'GA', name:'Goal Attack',   fireHex:'#ef6d22', iceHex:'#0052b3', tagline:'creator & scorer',  matchup:'GD', role:'GA links midcourt to the circle — one of two players who can shoot for goal.', zoneCaption:'Centre third and attacking goal third — including the shooting circle.', matchupDesc:'GA needs separation to feed or shoot; GD works to deny every pass.' },
  { code:'WA', name:'Wing Attack',   fireHex:'#ffaa00', iceHex:'#009999', tagline:'the playmaker',     matchup:'WD', role:'WA delivers the ball into the circle and wins the centre pass — but cannot enter the shooting circle.', zoneCaption:'Centre third and attacking goal third — NOT the shooting circle.', matchupDesc:'WA breaks free at the centre pass; WD denies that first touch.' },
  { code:'C',  name:'Centre',        fireHex:'#009933', iceHex:'#009933', tagline:'engine of the team',matchup:'C',  role:'C covers the whole court, links attack and defence, and takes every centre pass.', zoneCaption:'All three thirds — NOT either shooting circle.', matchupDesc:'Both Centres race to control the midcourt. Most physically demanding matchup.' },
  { code:'WD', name:'Wing Defence',  fireHex:'#009999', iceHex:'#ffaa00', tagline:'pressure player',   matchup:'WA', role:'WD shadows WA and intercepts passes before they reach the circle.', zoneCaption:'Centre third and defensive goal third — NOT the shooting circle.', matchupDesc:'WD denies WA clean ball through positioning and timing.' },
  { code:'GD', name:'Goal Defence',  fireHex:'#0052b3', iceHex:'#ef6d22', tagline:'defensive partner', matchup:'GA', role:'GD follows GA from midcourt to the circle, contesting every pass and shot.', zoneCaption:'Centre third and defensive goal third — including the shooting circle.', matchupDesc:'GD stays goal-side and forces the turnover on every GA lead.' },
  { code:'GK', name:'Goal Keeper',   fireHex:'#663399', iceHex:'#cc3333', tagline:'last line of defence',matchup:'GS', role:'GK protects the goal, contesting every shot and rebound inside the circle.', zoneCaption:'Defensive goal third only — including the shooting circle.', matchupDesc:'GK makes space disappear for GS and contests every single shot.' },
];

type Team = 'Fire' | 'Ice';

function Bib({ code, hex }: { code: string; hex: string }) {
  return (
    <div style={{
      width: 36, height: 44, borderRadius: 8, background: hex,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 12,
      color: '#fff', flexShrink: 0,
      boxShadow: `0 0 0 1px ${hex}60`,
    }}>
      {code}
    </div>
  );
}

function ZoneBar({ hex }: { hex: string }) {
  return (
    <div style={{ width: '100%', height: 80, borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column', border: `1px solid ${hex}30` }}>
      <div style={{ flex: 1, background: hex, opacity: 0.85 }} />
      <div style={{ flex: 1, background: '#1a1a22' }} />
      <div style={{ flex: 1, background: '#1a1a22' }} />
    </div>
  );
}

export function SidebarNavigator() {
  const [activeCode, setActiveCode] = useState('C');
  const [team, setTeam] = useState<Team>('Fire');

  const pos = POSITIONS.find(p => p.code === activeCode)!;
  const opponent = POSITIONS.find(p => p.code === pos.matchup)!;
  const hex = team === 'Fire' ? pos.fireHex : pos.iceHex;
  const oppHex = team === 'Fire' ? opponent.iceHex : opponent.fireHex;

  return (
    <div className="netball-root" style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>

      {/* ── Header ── */}
      <div style={{ background: '#111', borderBottom: '1px solid #222', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 15, letterSpacing: 1, textTransform: 'uppercase', color: '#fff' }}>
            Elemental <span style={{ color: '#22c55e' }}>Netball</span>
          </div>
          <div style={{ fontSize: 9, color: '#666', textTransform: 'uppercase', letterSpacing: 2, marginTop: 1 }}>Positions</div>
        </div>
        <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid #333' }}>
          {(['Fire', 'Ice'] as Team[]).map(t => (
            <button key={t} onClick={() => setTeam(t)} style={{
              padding: '6px 14px', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1,
              background: team === t ? (t === 'Fire' ? '#E53935' : '#1E88E5') : 'transparent',
              color: team === t ? '#fff' : '#666', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            }}>
              {t === 'Fire' ? '🔥' : '🧊'} {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body: sidebar + content ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left sidebar — position list */}
        <div style={{ width: 72, background: '#0a0a0f', borderRight: '1px solid #1e1e2a', display: 'flex', flexDirection: 'column', padding: '8px 0', gap: 4, overflowY: 'auto', flexShrink: 0 }}>
          {POSITIONS.map(p => {
            const isActive = p.code === activeCode;
            const pHex = team === 'Fire' ? p.fireHex : p.iceHex;
            return (
              <button key={p.code} onClick={() => setActiveCode(p.code)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: '10px 0', background: isActive ? `${pHex}18` : 'transparent',
                border: 'none', borderLeft: isActive ? `3px solid ${pHex}` : '3px solid transparent',
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
                <div style={{
                  width: 36, height: 44, borderRadius: 8, background: isActive ? pHex : '#1e1e2a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 11, color: isActive ? '#fff' : '#555',
                }}>
                  {p.code}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right content panel */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

          {/* Position title */}
          <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid #1e1e2a', background: `linear-gradient(135deg, ${hex}15, transparent 60%)` }}>
            <div style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 3, color: hex, marginBottom: 2 }}>{pos.code}</div>
            <div style={{ fontSize: 20, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5, color: '#fff', lineHeight: 1.1 }}>{pos.name}</div>
            <div style={{ fontSize: 11, color: '#666', fontStyle: 'italic', marginTop: 2 }}>{pos.tagline}</div>
          </div>

          {/* VS matchup strip */}
          <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e1e2a', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Bib code={pos.code} hex={hex} />
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ flex: 1, height: 1, background: `${hex}40` }} />
              <span style={{ fontSize: 9, fontWeight: 900, color: '#555', textTransform: 'uppercase', letterSpacing: 2 }}>vs</span>
              <div style={{ flex: 1, height: 1, background: `${oppHex}40` }} />
            </div>
            <Bib code={opponent.code} hex={oppHex} />
          </div>

          {/* Zone diagram */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e1e2a' }}>
            <div style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, color: '#555', marginBottom: 8 }}>Zone</div>
            <ZoneBar hex={hex} />
            <p style={{ fontSize: 11, color: `${hex}cc`, marginTop: 8, lineHeight: 1.5, textAlign: 'center' }}>{pos.zoneCaption}</p>
          </div>

          {/* Details */}
          <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ background: '#141418', borderRadius: 12, border: '1px solid #1e1e2a', padding: '12px 14px' }}>
              <div style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, color: '#555', marginBottom: 6 }}>Role</div>
              <p style={{ fontSize: 13, lineHeight: 1.55, color: '#ccc' }}>{pos.role}</p>
            </div>
            <div style={{ background: '#141418', borderRadius: 12, border: `1px solid ${hex}35`, borderLeft: `4px solid ${hex}`, padding: '12px 14px', background: `${hex}10` as any }}>
              <div style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, color: hex, marginBottom: 6 }}>vs {opponent.name}</div>
              <p style={{ fontSize: 13, lineHeight: 1.55, color: '#ccc' }}>{pos.matchupDesc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
