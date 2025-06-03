import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';

interface Player {
  name: string;
  picks: string[];
}

interface Lineup {
  team: string;
  players: string[];
}

const exampleLineups: Lineup[] = [
  {
    team: 'KC',
    players: [
      "Jonathan India (R) 2B",
      "Bobby Witt Jr. (R) SS",
      "Maikel Garcia (R) 3B",
      "Vinnie Pasquantino (L) 1B",
      "Salvador Perez (R) C",
      "Jac Caglianone (L) DH",
      "Nick Loftin (R) LF",
      "Drew Waters (S) RF",
      "Kyle Isbel (L) CF"
    ]
  },
  {
    team: 'STL',
    players: [
      "Lars Nootbaar (L) LF",
      "Masyn Winn (R) SS",
      "Brendan Donovan (L) 2B",
      "Willson Contreras (R) 1B",
      "Iván Herrera (R) C",
      "Nolan Arenado (R) 3B",
      "Alec Burleson (L) RF",
      "Nolan Gorman (L) DH",
      "Victor Scott II (L) CF"
    ]
  }
];

export default function SnakeDraft() {
  const [players, setPlayers] = useState<string[]>(['', '', '', '']);
  const [draftOrder, setDraftOrder] = useState<string[]>([]);
  const [stage, setStage] = useState<'setup' | 'draft' | 'complete'>('setup');
  const [turnIndex, setTurnIndex] = useState(0);
  const [drafts, setDrafts] = useState<Record<string, string[]>>({});
  const [selected, setSelected] = useState<Record<string, string[]>>({
    KC: [],
    STL: []
  });
  const [isShuffling, setIsShuffling] = useState(false);

  const shufflePlayers = () => {
    setIsShuffling(true);
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    setTimeout(() => {
      setDraftOrder(shuffled);
      setDrafts(Object.fromEntries(shuffled.map(p => [p, []])));
      setStage('draft');
      setIsShuffling(false);
    }, 2000);
  };

  const handlePick = (team: string, playerName: string) => {
    const currentPlayer = draftOrder[turnIndex];
    const currentDraft = drafts[currentPlayer];
    if (currentDraft.length < 2) {
      const updatedDrafts = { ...drafts, [currentPlayer]: [...currentDraft, playerName] };
      setDrafts(updatedDrafts);
      setSelected({ ...selected, [team]: [...selected[team], playerName] });
      nextTurn();
    }
  };

  const nextTurn = () => {
    const totalPicks = draftOrder.length * 2;
    const picksMade = Object.values(drafts).flat().length;
    if (picksMade >= totalPicks) {
      setStage('complete');
      return;
    }
    const round = Math.floor(picksMade / draftOrder.length);
    const indexInRound = picksMade % draftOrder.length;
    const nextIndex = round % 2 === 0 ? indexInRound : draftOrder.length - 1 - indexInRound;
    setTurnIndex(nextIndex);
  };

  if (stage === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white p-8">
        <div className="max-w-lg mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center font-pixel">MLB Snake Draft</h1>
          <div className="space-y-4">
            {players.map((p, i) => (
              <input
                key={i}
                className="retro-input w-full"
                placeholder={`Player ${i + 1} Name`}
                value={players[i]}
                onChange={e => {
                  const newPlayers = [...players];
                  newPlayers[i] = e.target.value;
                  setPlayers(newPlayers);
                }}
              />
            ))}
          </div>
          <Button
            className="retro-button w-full mt-6"
            onClick={shufflePlayers}
            disabled={players.some(p => p.trim() === '') || isShuffling}
          >
            {isShuffling ? 'Shuffling...' : 'Start Draft'}
          </Button>
        </div>
      </div>
    );
  }

  if (stage === 'draft') {
    const currentPlayer = draftOrder[turnIndex];
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center font-pixel">Snake Draft</h1>
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-blue-400 font-pixel">Current Turn:</h2>
            <motion.div
              key={currentPlayer}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl font-bold mt-2 font-pixel animate-glow"
            >
              {currentPlayer}
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {exampleLineups.map((lineup) => (
              <div key={lineup.team} className="retro-card">
                <h2 className="text-2xl font-bold mb-4 text-center font-pixel">{lineup.team} Lineup</h2>
                <div className="space-y-2">
                  {lineup.players.map(player => (
                    <button
                      key={player}
                      disabled={selected[lineup.team].includes(player)}
                      onClick={() => handlePick(lineup.team, player)}
                      className={`w-full p-3 text-left rounded transition-all ${
                        selected[lineup.team].includes(player)
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-700 hover:bg-blue-600'
                      }`}
                    >
                      {player}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6 text-center font-pixel">Teams</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {draftOrder.map(player => (
                <motion.div
                  key={player}
                  className={`retro-card ${
                    player === currentPlayer ? 'animate-glow' : ''
                  }`}
                  animate={{
                    scale: player === currentPlayer ? [1, 1.05, 1] : 1,
                  }}
                  transition={{
                    duration: 1,
                    repeat: player === currentPlayer ? Infinity : 0,
                  }}
                >
                  <h4 className="font-bold text-lg mb-2 font-pixel">{player}</h4>
                  <ul className="space-y-1">
                    {(drafts[player] || []).map(pick => (
                      <li key={pick} className="text-sm text-blue-200">{pick}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center font-pixel">Draft Complete!</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {draftOrder.map(player => (
              <div key={player} className="retro-card">
                <h2 className="text-2xl font-bold mb-4 font-pixel">{player}'s Team</h2>
                <ul className="space-y-2">
                  {drafts[player].map(pick => (
                    <li key={pick} className="text-lg">{pick}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button
              className="retro-button"
              onClick={() => window.location.reload()}
            >
              Start New Draft
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
} 