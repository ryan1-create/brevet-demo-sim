"use client";

import { useState } from "react";
import Welcome from "@/components/Welcome";
import ScenarioBrief from "@/components/ScenarioBrief";
import ChallengeCanvas from "@/components/ChallengeCanvas";
import ScoringReveal from "@/components/ScoringReveal";
import { getScenario } from "@/lib/scenarios";

const MOCK_STARTING_SCORE = 287;

export default function Home() {
  const [stage, setStage] = useState("welcome"); // welcome | brief | challenge | scoring
  const [industryId, setIndustryId] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [submission, setSubmission] = useState("");
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(MOCK_STARTING_SCORE);

  const scenario = industryId ? getScenario(industryId, "legacy-displacement") : null;

  const handleStart = ({ industryId: id, teamName: name }) => {
    setIndustryId(id);
    setTeamName(name);
    setStage("brief");
  };

  const handleBeginChallenge = () => setStage("challenge");

  const handleSubmit = (submissionString) => {
    setSubmission(submissionString);
    setStage("scoring");
  };

  const handleContinueFromScoring = () => {
    // For the single-round demo, go back to welcome.
    // In a multi-round version, this advances to the next round's brief.
    resetToWelcome();
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
    setScore(MOCK_STARTING_SCORE);
  };

  return (
    <main>
      {stage === "welcome" && <Welcome onStart={handleStart} />}

      {stage === "brief" && scenario && (
        <ScenarioBrief
          scenario={scenario}
          teamName={teamName}
          currentRound={currentRound}
          score={score}
          onBegin={handleBeginChallenge}
        />
      )}

      {stage === "challenge" && scenario && (
        <ChallengeCanvas
          scenario={scenario}
          teamName={teamName}
          currentRound={currentRound}
          score={score}
          onSubmit={handleSubmit}
        />
      )}

      {stage === "scoring" && scenario && (
        <ScoringReveal
          scenario={scenario}
          submission={submission}
          onContinue={handleContinueFromScoring}
          onRestart={handleRestart}
        />
      )}
    </main>
  );
}
