"use client";

import { useState } from "react";
import Welcome from "@/components/Welcome";
import ScenarioBrief from "@/components/ScenarioBrief";
import ChallengeCanvas from "@/components/ChallengeCanvas";
import ScoringReveal from "@/components/ScoringReveal";
import { getScenario, getMotionForRound, MOTION_ORDER } from "@/lib/scenarios";

export default function Home() {
  const [stage, setStage] = useState("welcome"); // welcome | brief | challenge | scoring | final
  const [industryId, setIndustryId] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [submission, setSubmission] = useState("");
  const [currentRound, setCurrentRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [roundScores, setRoundScores] = useState([]); // [{round, score, scenario}]

  const currentMotionId = getMotionForRound(currentRound);
  const scenario = industryId ? getScenario(industryId, currentMotionId) : null;

  const handleStart = ({ industryId: id, teamName: name }) => {
    setIndustryId(id);
    setTeamName(name);
    setCurrentRound(1);
    setTotalScore(0);
    setRoundScores([]);
    setStage("brief");
  };

  const handleBeginChallenge = () => setStage("challenge");

  const handleSubmit = (submissionString) => {
    setSubmission(submissionString);
    setStage("scoring");
  };

  const handleContinueFromScoring = (roundScore) => {
    // Track this round's score and accumulate total
    const newTotalScore = totalScore + (roundScore || 0);
    setTotalScore(newTotalScore);
    setRoundScores((prev) => [
      ...prev,
      { round: currentRound, score: roundScore || 0, motion: currentMotionId },
    ]);

    // Advance to next round, or show final verdict after R4
    if (currentRound < MOTION_ORDER.length) {
      setCurrentRound(currentRound + 1);
      setSubmission("");
      setStage("brief");
    } else {
      // All 4 rounds complete — for now, restart. Final verdict screen coming.
      alert(
        `All four rounds complete.\n\nTotal score: ${newTotalScore} / 400\n\nThank you for playing the Brevet Sales Simulation.`
      );
      resetToWelcome();
    }
  };

  const handleRestart = () => {
    resetToWelcome();
  };

  const resetToWelcome = () => {
    setStage("welcome");
    setIndustryId(null);
    setTeamName("");
    setSubmission("");
    setCurrentRound(1);
    setTotalScore(0);
    setRoundScores([]);
  };

  return (
    <main>
      {stage === "welcome" && <Welcome onStart={handleStart} />}

      {stage === "brief" && scenario && (
        <ScenarioBrief
          scenario={scenario}
          teamName={teamName}
          currentRound={currentRound}
          score={totalScore}
          onBegin={handleBeginChallenge}
        />
      )}

      {stage === "challenge" && scenario && (
        <ChallengeCanvas
          scenario={scenario}
          teamName={teamName}
          currentRound={currentRound}
          score={totalScore}
          onSubmit={handleSubmit}
        />
      )}

      {stage === "scoring" && scenario && (
        <ScoringReveal
          scenario={scenario}
          submission={submission}
          onContinue={handleContinueFromScoring}
          onRestart={handleRestart}
          currentRound={currentRound}
          isLastRound={currentRound >= MOTION_ORDER.length}
        />
      )}
    </main>
  );
}
