import React, { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface RuleScenario {
  id: number;
  title: string;
  description: string;
  answers: string[];
  correctIndex: number;
  explanation: string;
}

const RULES: RuleScenario[] = [
  {
    id: 1,
    title: "Footwork",
    description: "A player catches the ball and takes 3 steps. What happens?",
    answers: ["Turnover to the other team", "Play on — that's fine", "Free pass to the same team"],
    correctIndex: 0,
    explanation: "In netball you can only pivot on your landing foot — you can't take extra steps!"
  },
  {
    id: 2,
    title: "Held Ball",
    description: "A player holds the ball for 5 seconds without passing. What happens?",
    answers: ["Nothing — take your time", "Turnover to the other team", "The match is paused"],
    correctIndex: 1,
    explanation: "The rules say you must pass or shoot within 3 seconds of catching the ball."
  },
  {
    id: 3,
    title: "Obstruction",
    description: "A defender stands 50cm away from the ball carrier. What happens?",
    answers: ["That's fine — defenders can get close", "Foul called — must stand 90cm away", "Penalty shot awarded"],
    correctIndex: 1,
    explanation: "All defenders must give the ball carrier at least 90cm of space."
  },
  {
    id: 4,
    title: "Offside",
    description: "The Goal Keeper runs into the Centre Third. What happens?",
    answers: ["That's allowed — anyone can go anywhere", "Offside called — turnover", "Yellow card given"],
    correctIndex: 1,
    explanation: "Each position is only allowed in certain zones. The GK cannot enter the Centre Third."
  },
  {
    id: 5,
    title: "Contact",
    description: "A defender accidentally bumps into the shooter. What happens?",
    answers: ["Play on — it was an accident", "Penalty pass to the attacking team", "The player is sent off"],
    correctIndex: 1,
    explanation: "Any physical contact is penalised in netball, even if it was accidental."
  }
];

interface TheRulesSectionProps {
  onBack: () => void;
}

export const TheRulesSection: React.FC<TheRulesSectionProps> = ({ onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const currentRule = RULES[currentIndex];

  const handleNext = () => {
    if (currentIndex < RULES.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
      setSelectedAnswer(null);
    }
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 })
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden" data-testid="section-rules">
      <div className="flex items-center p-4 border-b border-border bg-background z-20">
        <Button variant="ghost" size="icon" onClick={onBack} data-testid="btn-back">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-2xl font-bold ml-2 uppercase tracking-tight text-white">The Rules</h2>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center justify-center relative w-full max-w-md mx-auto">
        <div className="w-full relative h-[400px]">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0"
            >
              <div className="bg-card w-full h-full rounded-2xl border border-border shadow-2xl p-6 flex flex-col">
                <div className="mb-6 border-b border-border pb-4">
                  <h3 className="text-xl font-black uppercase text-primary mb-2">{currentRule.title}</h3>
                  <p className="text-card-foreground font-medium text-lg leading-tight">{currentRule.description}</p>
                </div>

                <div className="flex-1 space-y-3">
                  {currentRule.answers.map((answer, i) => {
                    const isSelected = selectedAnswer === i;
                    const isCorrect = i === currentRule.correctIndex;
                    const showFeedback = selectedAnswer !== null;

                    let bgClass = "bg-background hover:bg-muted";
                    let borderClass = "border-border";
                    
                    if (showFeedback) {
                      if (isCorrect) {
                        bgClass = "bg-primary/20";
                        borderClass = "border-primary";
                      } else if (isSelected && !isCorrect) {
                        bgClass = "bg-destructive/20";
                        borderClass = "border-destructive";
                      } else {
                        bgClass = "bg-background opacity-50";
                      }
                    }

                    return (
                      <button
                        key={i}
                        disabled={showFeedback}
                        onClick={() => setSelectedAnswer(i)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${bgClass} ${borderClass}`}
                        data-testid={`answer-${i}`}
                      >
                        <span className="font-bold">{answer}</span>
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {selectedAnswer !== null && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 p-4 rounded-xl bg-background border border-border text-sm font-medium"
                    >
                      <span className={selectedAnswer === currentRule.correctIndex ? "text-primary font-bold block mb-1" : "text-destructive font-bold block mb-1"}>
                        {selectedAnswer === currentRule.correctIndex ? "Correct!" : "Not quite."}
                      </span>
                      {currentRule.explanation}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation & Progress */}
        <div className="w-full mt-8 flex items-center justify-between">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handlePrev} 
            disabled={currentIndex === 0}
            className="rounded-full"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <div className="flex gap-2">
            {RULES.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? "bg-primary w-6" : "bg-muted-foreground"}`} 
              />
            ))}
          </div>

          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleNext} 
            disabled={currentIndex === RULES.length - 1 || selectedAnswer === null}
            className="rounded-full"
            data-testid="btn-next"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {currentIndex === RULES.length - 1 && selectedAnswer !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Button size="lg" onClick={onBack} className="font-bold uppercase tracking-wider">
              Finish Section
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
