// Mock leaderboard data for the demo.
// In the live-event version of the sim this would be driven by Redis.
// For the demo, we use a static roster with the player's own team injected.

export function getMockLeaderboard(playerTeamName = "Your Team", playerScore = 287) {
  const staticRoster = [
    { rank: 1, team: "Stellar Horizons", detail: "Table 14", score: 312 },
    { rank: 2, team: "Peak Performance", detail: "Table 07", score: 298 },
    { rank: 3, team: playerTeamName.toUpperCase(), detail: "Your team", score: playerScore, isYou: true },
    { rank: 4, team: "Breakthrough Partners", detail: "Table 11", score: 271 },
    { rank: 5, team: "Momentum Works", detail: "Table 03", score: 253 },
    { rank: 6, team: "Pinnacle Strategy", detail: "Table 19", score: 241 },
    { rank: 7, team: "Apex Advisors", detail: "Table 08", score: 228 },
    { rank: 8, team: "Summit Sellers", detail: "Table 25", score: 211 },
    { rank: 9, team: "Catalyst Group", detail: "Table 02", score: 195 },
    { rank: 10, team: "True North", detail: "Table 17", score: 168 },
  ];

  // Re-sort by score in case player score changes their rank
  const sorted = [...staticRoster].sort((a, b) => b.score - a.score);
  return sorted.map((row, i) => ({ ...row, rank: i + 1 }));
}
