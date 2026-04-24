"use client";

import { useState } from "react";
import Welcome from "@/components/Welcome";
import ScenarioBrief from "@/components/ScenarioBrief";
import ChallengeCanvas from "@/components/ChallengeCanvas";
import ScoringReveal from "@/components/ScoringReveal";
import RoundTransition from "@/components/RoundTransition";
import FinalVerdict from "@/components/FinalVerdict";
import { getScenario, getMotionForRound, MOTION_ORDER, MOTIONS } from "@/lib/scenarios";

const motionById = (id) => Object.values(MOTIONS).find((m) => m.id === id);

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

  const handleRoundChange = (roundNumber) => {
    // Jump to any round's brief view. Used during live demos so the presenter
    // can navigate freely instead of playing linearly.
    if (!industryId) return;
    if (roundNumber < 1 || roundNumber > MOTION_ORDER.length) return;
    setCurrentRound(roundNumber);
    setSubmission("");
    setStage("brief");
  };

  const handleSubmit = (submissionString) => {
    setSubmission(submissionString);
    setStage("scoring");
  };

  const handleContinueFromScoring = (roundScore) => {
    // Track this round's score and accumulate total
    const newTotalScore = totalScore + (roundScore || 0);
    const updatedRoundScores = [
      ...roundScores,
      { round: currentRound, score: roundScore || 0, motion: currentMotionId },
    ];
    setTotalScore(newTotalScore);
    setRoundScores(updatedRoundScores);

    // Between-round transition, or final verdict after R4
    if (currentRound < MOTION_ORDER.length) {
      setStage("transition");
    } else {
      setStage("final");
    }
  };

  const handleTransitionAdvance = () => {
    setCurrentRound(currentRound + 1);
    setSubmission("");
    setStage("brief");
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
          onRoundChange={handleRoundChange}
        />
      )}

      {stage === "challenge" && scenario && (
        <ChallengeCanvas
          scenario={scenario}
          teamName={teamName}
          currentRound={currentRound}
          score={totalScore}
          onSubmit={handleSubmit}
          onRoundChange={handleRoundChange}
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

      {stage === "transition" && (
        <RoundTransition
          completedRound={currentRound}
          completedMotion={motionById(currentMotionId)}
          completedRoundScore={roundScores[roundScores.length - 1]?.score || 0}
          totalScore={totalScore}
          nextRound={currentRound + 1}
          nextMotion={motionById(getMotionForRound(currentRound + 1))}
          onAdvance={handleTransitionAdvance}
        />
      )}

      {stage === "final" && (
        <FinalVerdict
          teamName={teamName}
          totalScore={totalScore}
          roundScores={roundScores}
          onRestart={handleRestart}
        />
      )}
    </main>
  );
}
