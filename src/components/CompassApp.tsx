"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import compassData from "@/data/compass_2026.json";
import type { AppPhase, CompassData, CompassResult, Question, Responses } from "@/lib/types";
import { computeScores, getQuizQuestions } from "@/lib/scoring";
import AmbientBackground from "@/components/AmbientBackground";
import NavHeader from "@/components/NavHeader";
import WelcomeScreen from "@/components/WelcomeScreen";
import QuestionCard from "@/components/QuestionCard";

const data = compassData as CompassData;
const ResultsView = dynamic(() => import("@/components/ResultsView"), {
  ssr: false,
});

export default function CompassApp() {
  const [phase, setPhase] = useState<AppPhase>("welcome");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Responses>({});
  const [result, setResult] = useState<CompassResult | null>(null);

  const goHome = useCallback(() => {
    setPhase("welcome");
    setQuestions([]);
    setCurrentIndex(0);
    setResponses({});
    setResult(null);
  }, []);

  const startQuiz = useCallback(() => {
    setQuestions(getQuizQuestions(data));
    setCurrentIndex(0);
    setResponses({});
    setResult(null);
    setPhase("quiz");
  }, []);

  const handleAnswer = useCallback(
    (value: number) => {
      const q = questions[currentIndex];
      setResponses((current) => ({ ...current, [q.id]: value }));
    },
    [questions, currentIndex]
  );

  const handleBack = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    const q = questions[currentIndex];
    if (!q || responses[q.id] === undefined) return;

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      return;
    }

    setResult(computeScores(data, responses, questions));
    setPhase("results");
  }, [questions, currentIndex, responses]);

  const currentQuestion = questions[currentIndex];
  const currentAxis =
    currentQuestion &&
    data.axes.find((a) => a.id === currentQuestion.axis_id);

  return (
    <div className="relative min-h-screen">
      <AmbientBackground />
      <NavHeader onHome={goHome} phase={phase} />

      <main className="relative z-10 mx-auto min-h-screen max-w-6xl px-4 pt-24 pb-20 sm:px-6">
        <AnimatePresence mode="wait">
          {phase === "welcome" && (
            <WelcomeScreen
              key="welcome"
              onStart={startQuiz}
              axisCount={data.axes.length}
            />
          )}

          {phase === "quiz" && currentQuestion && currentAxis && (
            <div className="flex min-h-[calc(100vh-9rem)] items-center justify-center">
              <QuestionCard
                question={currentQuestion}
                axis={currentAxis}
                index={currentIndex}
                total={questions.length}
                value={responses[currentQuestion.id]}
                onAnswer={handleAnswer}
                onBack={handleBack}
                onNext={handleNext}
                onHome={goHome}
                canGoBack={currentIndex > 0}
                canGoNext={responses[currentQuestion.id] !== undefined}
                isLast={currentIndex === questions.length - 1}
              />
            </div>
          )}

          {phase === "results" && result && (
            <ResultsView
              key="results"
              result={result}
              axes={data.axes}
              onRetake={startQuiz}
              onHome={goHome}
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 border-t border-border/50 py-5 text-center">
        <p className="mc-footer-text">
          OptiPol · Not affiliated with politicalcompass.org
        </p>
      </footer>
    </div>
  );
}
