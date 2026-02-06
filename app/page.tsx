"use client"

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { PositionSelector } from '@/components/PositionSelector';
import { ScenarioSelector } from '@/components/ScenarioSelector';
import { HandMatrix } from '@/components/HandMatrix';
import { AiAnalysis } from '@/components/AiAnalysis';
import { SettingsModal } from '@/components/SettingsModal';
import { TrainerTable } from '@/components/TrainerTable';
import { POS_ORDER, POSITION_NAMES, RANKS, SUITS } from '@/lib/poker-data';
import { getHandAction } from '@/lib/poker-utils';
import { fetchWithRetry } from '@/lib/utils';

const App = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const [view, setView] = useState('reference');
  const [position, setPosition] = useState('BTN');
  const [situation, setSituation] = useState('RFI');
  const [selectedHandForAi, setSelectedHandForAi] = useState<string | null>(null);

  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [analysisLevel, setAnalysisLevel] = useState('beginner');
  const [model, setModel] = useState("google/gemini-3-flash-preview");
  const [language, setLanguage] = useState("english");

  const [isInitialized, setIsInitialized] = useState(false);
  // Sync settings from session only once on initial load
  useEffect(() => {
    if (status === 'authenticated' && session?.user && !isInitialized) {
      if (session.user.analysisLevel) setAnalysisLevel(session.user.analysisLevel);
      if (session.user.selectedModel) setModel(session.user.selectedModel);
      if (session.user.language) setLanguage(session.user.language);
      setIsInitialized(true);
    }
  }, [status, session, isInitialized]);

  const handleSaveSettings = async (newModel: string, newLevel: string, newLanguage: string) => {
    setIsSettingsOpen(false);
    // Optimistically update local state
    setModel(newModel);
    setAnalysisLevel(newLevel);
    setLanguage(newLanguage);
    
    try {
      const response = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedModel: newModel,
          analysisLevel: newLevel,
          language: newLanguage,
        }),
      });
      
      if (response.ok) {
        // Refresh session data client-side
        const newSession = {
          ...session,
          user: {
            ...session?.user,
            selectedModel: newModel,
            analysisLevel: newLevel,
            language: newLanguage,
          }
        };
        await update(newSession);
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
    }
  };

  const [aiLoading, setAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");

  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [feedback, setFeedback] = useState<any>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const getAiExplanation = async (handValue: string, actionValue: string, contextPos?: string, contextSit?: string, contextLimperPos?: string) => {
    const effectivePos = contextPos || position;
    const effectiveSit = contextSit || situation;
    setSelectedHandForAi(handValue);

    setAiLoading(true);
    setAiExplanation("");

    try {
      const response = await fetchWithRetry("/api/ai-analysis", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
          'X-Title': 'GTO Trainer'
        },
        body: JSON.stringify({
          hand: handValue,
          positionName: POSITION_NAMES[effectivePos],
          situationLabel: effectiveSit,
          actionLabel: actionValue,
          analysisLevel: analysisLevel,
          model: model,
          language: language
        })
      });
      const result = await response.json();
      if (result.error) {
        setAiExplanation(result.error);
        setAiLoading(false);
        return;
      }
      setAiExplanation(result.choices?.[0]?.message?.content || "No analysis available.");
    } catch (err) {
      console.error("AI Error:", err);
      setAiExplanation("Coach is unavailable right now.");
    }
    setAiLoading(false);
  };

  const generateQuestion = () => {
    const randPos = POS_ORDER[Math.floor(Math.random() * POS_ORDER.length)];
    let sitPool = ['RFI', 'FACING', 'LIMPERS'];
    if (randPos === 'UTG') sitPool = ['RFI'];
    else if (randPos === 'BB') sitPool = ['FACING', 'LIMPERS'];
    const randSit = sitPool[Math.floor(Math.random() * sitPool.length)];
    let limperPos = null;
    if (randSit === 'LIMPERS') limperPos = POS_ORDER.slice(0, POS_ORDER.indexOf(randPos))[0] || 'UTG';

    const r1idx = Math.floor(Math.random() * RANKS.length), r2idx = Math.floor(Math.random() * RANKS.length);
    const suit1 = SUITS[Math.floor(Math.random() * SUITS.length)], suit2 = SUITS[(SUITS.indexOf(suit1) + 1) % 4];
    const r1 = RANKS[r1idx], r2 = RANKS[r2idx];
    const handString = r1idx === r2idx ? r1 + r2 : (r1idx < r2idx ? r1 + r2 : r2 + r1) + (Math.random() > 0.5 ? 's' : 'o');

    setCurrentQuestion({ pos: randPos, sit: randSit, limperPos, hand: handString, cards: [{ rank: r1, suit: suit1 }, { rank: r2, suit: suit2 }], correctAction: getHandAction(handString, randPos, randSit) });
    setFeedback(null);
  };

  const handleAction = (action: string) => {
    if (feedback) return;
    const playerAction = (action === 'raise' && currentQuestion.sit === 'FACING') ? '3bet' : action;
    const isCorrect = playerAction === currentQuestion.correctAction;
    setScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
    setFeedback({ isCorrect, correctAction: currentQuestion.correctAction });
  };

  useEffect(() => { if (view === 'game') generateQuestion(); }, [view]);

  // Show loading while checking auth
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Don't render if unauthenticated (will redirect)
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">

        <Header view={view} setView={setView} onOpenSettings={() => setIsSettingsOpen(true)} />

        {view === 'reference' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
              <PositionSelector position={position} setPosition={setPosition} />
              <ScenarioSelector situation={situation} setSituation={setSituation} />
            </div>

            <div className="lg:col-span-8 space-y-6">
              <HandMatrix
                position={position}
                situation={situation}
                onHandSelect={(hand, action) => getAiExplanation(hand, action)}
              />
              <AiAnalysis
                selectedHand={selectedHandForAi}
                position={position}
                situation={situation}
                aiLoading={aiLoading}
                aiExplanation={aiExplanation}
              />
            </div>
          </div>
        ) : (
          <TrainerTable
            currentQuestion={currentQuestion}
            feedback={feedback}
            score={score}
            onAction={handleAction}
            onNextHand={generateQuestion}
            onAskAi={() => {
              const { hand, correctAction, pos, sit, limperPos } = currentQuestion;
              // Move back to reference view to show explanation
              setSituation(sit);
              setPosition(pos);
              setView('reference');
              getAiExplanation(hand, correctAction, pos, sit, limperPos);
            }}
          />
        )}
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
        initialModel={model}
        initialAnalysisLevel={analysisLevel}
        initialLanguage={language}
      />
    </div>
  );
};

export default App;