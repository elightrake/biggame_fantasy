'use client';

import { useState } from 'react';

const LINEUPS = {
  NYM: [
    "Francisco Lindor (S) SS",
    "Starling Marte (R) DH",
    "Juan Soto (L) RF",
    "Pete Alonso (R) 1B",
    "Brandon Nimmo (L) LF",
    "Tyrone Taylor (R) CF",
    "Ronny Mauricio (S) 3B",
    "Francisco Alvarez (R) C",
    "Jeff McNeil (L) 2B"
  ],
  LAD: [
    "Shohei Ohtani (L) DH",
    "Mookie Betts (R) SS",
    "Freddie Freeman (L) 1B",
    "Teoscar Hernández (R) RF",
    "Will Smith (R) C",
    "Max Muncy (L) 3B",
    "Andy Pages (R) CF",
    "Michael Conforto (L) LF",
    "Hyeseong Kim (L) 2B"
  ]
};

export default function Home() {
  const [players, setPlayers] = useState(['', '', '', '']);
  const [draftOrder, setDraftOrder] = useState<string[]>([]);
  const [stage, setStage] = useState<'setup' | 'draft' | 'complete'>('setup');
  const [currentPick, setCurrentPick] = useState(0);
  const [drafts, setDrafts] = useState<Record<string, string[]>>({});
  const [selected, setSelected] = useState<Record<string, string[]>>({
    KC: [],
    STL: []
  });
  const [tempSelection, setTempSelection] = useState<{team: string, player: string} | null>(null);
  const [lastPick, setLastPick] = useState<{player: string, drafter: string} | null>(null);

  const startDraft = () => {
    if (players.some(p => !p.trim())) return;
    const order = [...players].sort(() => Math.random() - 0.5);
    setDraftOrder(order);
    setDrafts(Object.fromEntries(order.map(p => [p, []])));
    setStage('draft');
  };

  const handlePlayerSelect = (team: string, player: string) => {
    if (!selected[team] || selected[team].includes(player)) return;
    setTempSelection({ team, player });
  };

  const confirmDraft = () => {
    if (!tempSelection) return;
    
    const { team, player } = tempSelection;
    const currentPlayer = draftOrder[currentPick];
    const currentDraft = drafts[currentPlayer];
    
    // Add the pick to the current player's draft
    setDrafts(prev => ({
      ...prev,
      [currentPlayer]: [...prev[currentPlayer], player]
    }));
    setSelected(prev => ({
      ...prev,
      [team]: [...prev[team], player]
    }));
    
    // Calculate next pick based on snake draft
    const totalPicks = Object.values(drafts).flat().length + 1;
    const round = Math.floor(totalPicks / draftOrder.length);
    const positionInRound = totalPicks % draftOrder.length;
    
    // If we've completed a round, reverse the order
    const nextPick = round % 2 === 0 
      ? positionInRound 
      : draftOrder.length - 1 - positionInRound;
    
    setLastPick({ player, drafter: currentPlayer });
    setCurrentPick(nextPick);
    setTempSelection(null);

    // Check if draft is complete (8 total picks)
    if (totalPicks === 8) {
      setStage('complete');
    }
  };

  const cancelSelection = () => {
    setTempSelection(null);
  };

  if (stage === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">The Big Game Draft!</h1>
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <h2 className="text-2xl mb-4">Enter Participant Names!</h2>
            {players.map((p, i) => (
              <input
                key={i}
                className="w-full p-3 mb-4 bg-white/5 border-2 border-blue-400 rounded text-white placeholder-blue-200"
                placeholder={`Player ${i + 1} Name`}
                value={p}
                onChange={e => {
                  const newPlayers = [...players];
                  newPlayers[i] = e.target.value;
                  setPlayers(newPlayers);
                }}
              />
            ))}
            <button
              className="w-full p-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors disabled:bg-gray-500"
              onClick={startDraft}
              disabled={players.some(p => !p.trim())}
            >
              Start Draft
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Draft Complete!</h1>
          
          <div className="bg-white/10 p-8 rounded-lg backdrop-blur-sm mb-8">
            <h2 className="text-3xl font-bold text-center mb-8">Final Teams</h2>
            <div className="grid grid-cols-2 gap-8">
              {draftOrder.map(player => (
                <div key={player} className="bg-white/5 p-6 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4 text-center">{player}'s Team</h3>
                  <ul className="space-y-3">
                    {(drafts[player] || []).map(pick => {
                      const [team] = pick.split(' ');
                      return (
                        <li key={pick} className="flex items-center gap-3 p-3 bg-white/5 rounded">
                          <span className="text-2xl">{team === 'KC' ? '👑' : '🐦'}</span>
                          <span>{pick}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <div className="bg-green-500/20 border-2 border-green-500 rounded-lg p-8 mb-8">
              <h2 className="text-3xl font-bold mb-4">GOOD LUCK AT THE BIG GAME!</h2>
              <p className="text-xl">May the best team win! 🎮</p>
            </div>
            <button
              className="w-full p-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors"
              onClick={() => window.location.reload()}
            >
              Start New Draft
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentPlayer = draftOrder[currentPick];
  const currentDraft = drafts[currentPlayer] || [];
  const totalPicks = Object.values(drafts).flat().length;
  const round = Math.floor(totalPicks / draftOrder.length) + 1;
  const isSnakeRound = round % 2 === 0;
  const pickNumber = totalPicks + 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">MLB Snake Draft</h1>
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-blue-400 mb-2">
              {currentPlayer} is on the clock!
            </h2>
            <p className="text-xl mb-2">Round {round} ({isSnakeRound ? 'Snake' : 'Normal'})</p>
            <p className="text-lg">Pick #{pickNumber}</p>
          </div>
        </div>

        {/* Last Pick Alert */}
        {lastPick && (
          <div className="mb-8 p-4 bg-green-500/20 border-2 border-green-500 rounded-lg text-center">
            <p className="text-xl">
              <span className="font-bold">{lastPick.player}</span> selected by{' '}
              <span className="font-bold">{lastPick.drafter}</span>!
            </p>
          </div>
        )}

        {/* Selection Status */}
        {tempSelection ? (
          <div className="mb-8 p-6 bg-yellow-500/20 border-2 border-yellow-500 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4">DRAFT PLAYER?</h3>
            <p className="text-xl mb-4">
              {tempSelection.player} ({tempSelection.team})
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors"
                onClick={confirmDraft}
              >
                Confirm Draft
              </button>
              <button
                className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors"
                onClick={cancelSelection}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-8 p-6 bg-blue-500/20 border-2 border-blue-500 rounded-lg text-center">
            <h3 className="text-2xl font-bold">SELECT YOUR PLAYER!</h3>
          </div>
        )}

        {/* Lineup Selection */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {Object.entries(LINEUPS).map(([team, players]) => (
            <div key={team} className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-4 text-center">{team} Lineup</h3>
              <div className="space-y-2">
                {players.map(player => (
                  <button
                    key={player}
                    onClick={() => handlePlayerSelect(team, player)}
                    disabled={selected[team].includes(player)}
                    className={`w-full p-3 text-left rounded-lg transition-colors ${
                      selected[team].includes(player)
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : tempSelection?.player === player
                        ? 'bg-yellow-500/20 border-2 border-yellow-500'
                        : 'bg-blue-500/20 hover:bg-blue-500/30 border-2 border-blue-500'
                    }`}
                  >
                    {player}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Teams Section */}
        <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Teams</h2>
          <div className="grid grid-cols-2 gap-6">
            {draftOrder.map(player => (
              <div 
                key={player} 
                className={`p-4 rounded-lg ${
                  player === currentPlayer 
                    ? 'bg-blue-500/20 border-2 border-blue-500' 
                    : 'bg-white/5'
                }`}
              >
                <h3 className="text-xl font-bold mb-3">{player}</h3>
                <ul className="space-y-2">
                  {(drafts[player] || []).map(pick => (
                    <li key={pick} className="p-2 bg-white/5 rounded">{pick}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <button
          className="w-full mt-8 p-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors"
          onClick={() => window.location.reload()}
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
