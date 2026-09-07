"use client"

import { useState } from 'react';
import { User, CheckCircle2, XCircle, MinusCircle, Loader2, Layers } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { POS_ORDER, TABLE_SLOTS, POSITION_NAMES } from '@/lib/poker-data';
import { formatBB } from '@/lib/poker-utils';
import { cn } from '@/lib/utils';
import type { Card as PlayingCardType, PostflopAction, PostflopScenario, PostflopVerdict } from '@/types/poker';

interface PostflopTableProps {
  scenario: PostflopScenario | null;
  verdict: PostflopVerdict | null;
  aiLoading: boolean;
  heroActionLabel: string | null;
  score: { correct: number; total: number };
  onDecide: (actionType: PostflopAction, label: string, toBB?: number) => void;
  onNextHand: () => void;
}

const suitColor = (suit: string) => (suit === '♥' || suit === '♦') ? 'text-rose-500' : 'text-slate-900';

const PlayingCard = ({ card, small }: { card: PlayingCardType; small?: boolean }) => (
  <div className={cn(
    "bg-white rounded-xl shadow-xl border-2 border-slate-200 flex flex-col justify-between p-2 flex-shrink-0",
    small ? "w-12 h-16" : "w-16 h-24"
  )}>
    <div className={cn("font-black", small ? "text-[10px]" : "text-sm", suitColor(card.suit))}>{card.rank}</div>
    <div className={cn("self-center", small ? "text-xl" : "text-3xl", suitColor(card.suit))}>{card.suit}</div>
  </div>
);

const VERDICT_STYLE: Record<string, { color: string; icon: typeof CheckCircle2; label: string }> = {
  GOOD: { color: 'text-emerald-500', icon: CheckCircle2, label: 'GOOD DECISION' },
  OK: { color: 'text-amber-500', icon: MinusCircle, label: 'CLOSE / OK' },
  MISTAKE: { color: 'text-rose-500', icon: XCircle, label: 'MISTAKE' },
};

export const PostflopTable = ({
  scenario,
  verdict,
  aiLoading,
  heroActionLabel,
  score,
  onDecide,
  onNextHand,
}: PostflopTableProps) => {
  const [pendingType, setPendingType] = useState<'bet' | 'raise' | null>(null);

  if (!scenario) return null;

  const decided = !!heroActionLabel;
  const targetIdx = POS_ORDER.indexOf(scenario.heroPos);
  const seats = [scenario.heroPos, ...scenario.villainPositions];

  const handlePrimary = (action: PostflopAction) => {
    if (action === 'bet' || action === 'raise') {
      setPendingType(action);
      return;
    }
    const label = action === 'fold' ? 'Fold' : action === 'check' ? 'Check' : `Call ${formatBB(scenario.betToCallBB)}`;
    onDecide(action, label);
  };

  const handleSize = (toBB: number, sizeLabel: string) => {
    if (!pendingType) return;
    onDecide(pendingType, `${pendingType === 'bet' ? 'Bet' : 'Raise'} to ${formatBB(toBB)} (${sizeLabel})`, toBB);
    setPendingType(null);
  };

  const vStyle = verdict?.verdict ? VERDICT_STYLE[verdict.verdict] : null;
  const VerdictIcon = vStyle?.icon ?? MinusCircle;

  return (
    <div className="flex flex-col items-center py-4 space-y-6 w-full">
      <div className="relative w-full max-w-4xl aspect-[2/1] bg-emerald-950 rounded-[250px] border-[16px] border-slate-900 shadow-2xl flex items-center justify-center mt-12 mb-8">
        <div className="absolute inset-4 border border-emerald-800/20 rounded-[230px]" />

        <Card className="absolute -top-16 left-1/2 -translate-x-1/2 px-6 py-2 rounded-2xl shadow-2xl flex items-center gap-6 z-50">
          <div className="text-center">
            <span className="text-[8px] uppercase font-black text-muted-foreground block tracking-tighter">Accuracy</span>
            <span className="text-xl font-black text-emerald-600">{score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <span className="text-[8px] uppercase font-black text-muted-foreground block tracking-tighter">Hands Played</span>
            <span className="text-xl font-black text-foreground">{score.total}</span>
          </div>
        </Card>

        {seats.map((pos) => {
          const slotIdx = (POS_ORDER.indexOf(pos) - targetIdx + 6) % 6;
          const slot = TABLE_SLOTS[slotIdx];
          const isHero = pos === scenario.heroPos;
          return (
            <div key={pos} style={{ top: slot.top, left: slot.left }} className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className={cn(
                "w-24 p-2 rounded-3xl border-2 flex flex-col items-center transition-all",
                isHero ? "bg-primary border-white scale-125 shadow-2xl z-40" : "bg-slate-900/90 border-slate-700 z-10"
              )}>
                <div className={cn("p-1.5 rounded-full mb-1", isHero ? "bg-primary-foreground/20" : "bg-slate-800")}>
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-tighter">{pos}</span>
              </div>
            </div>
          );
        })}

        <div className="z-40 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 bg-black/40 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Layers className="w-3 h-3" /> {scenario.street} &middot; Pot {formatBB(scenario.potBB)}
          </div>
          <div className="flex gap-2 bg-emerald-900/40 p-3 rounded-2xl">
            {scenario.board.map((c, i) => <PlayingCard key={i} card={c} small />)}
          </div>
          <div className="flex gap-2 mt-1">
            {scenario.heroCards.map((c, i) => <PlayingCard key={i} card={c} />)}
          </div>
        </div>
      </div>

      {!decided && (
        <div className="w-full max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="p-5 rounded-2xl space-y-2">
            <div className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Action so far</div>
            <div className="space-y-1">
              {scenario.actionHistory.map((line, i) => (
                <div key={i} className="text-xs font-medium text-muted-foreground">&bull; {line}</div>
              ))}
            </div>
          </Card>

          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black uppercase tracking-tighter">
              Action on <span className="text-primary">{POSITION_NAMES[scenario.heroPos]}</span>
            </h3>
            <div className="flex justify-center gap-2 flex-wrap">
              <Badge variant="secondary" className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                Effective Stack: {formatBB(scenario.effectiveStackBB)}
              </Badge>
              {scenario.facingBet && (
                <Badge variant="outline" className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Facing {formatBB(scenario.betToCallBB)}
                </Badge>
              )}
            </div>
          </div>

          {!pendingType ? (
            <div className={cn("grid gap-4", scenario.legalActions.length === 3 ? "grid-cols-3" : "grid-cols-2")}>
              {scenario.legalActions.includes('fold') && (
                <Button onClick={() => handlePrimary('fold')} variant="secondary" className="py-8 rounded-[2.5rem] font-black uppercase tracking-widest shadow-lg">Fold</Button>
              )}
              {scenario.legalActions.includes('check') && (
                <Button onClick={() => handlePrimary('check')} variant="secondary" className="py-8 rounded-[2.5rem] font-black uppercase tracking-widest shadow-lg">Check</Button>
              )}
              {scenario.legalActions.includes('call') && (
                <Button onClick={() => handlePrimary('call')} className="py-8 bg-blue-600 hover:bg-blue-700 rounded-[2.5rem] font-black uppercase tracking-widest text-white shadow-xl shadow-blue-500/30">
                  Call {formatBB(scenario.betToCallBB)}
                </Button>
              )}
              {scenario.legalActions.includes('bet') && (
                <Button onClick={() => handlePrimary('bet')} className="py-8 bg-orange-600 hover:bg-orange-700 rounded-[2.5rem] font-black uppercase tracking-widest text-white shadow-xl shadow-orange-500/30">Bet</Button>
              )}
              {scenario.legalActions.includes('raise') && (
                <Button onClick={() => handlePrimary('raise')} className="py-8 bg-orange-600 hover:bg-orange-700 rounded-[2.5rem] font-black uppercase tracking-widest text-white shadow-xl shadow-orange-500/30">Raise</Button>
              )}
            </div>
          ) : (
            <div className="space-y-3 animate-in zoom-in-95 duration-200">
              <div className="grid grid-cols-2 gap-3">
                {scenario.betSizeOptions.map((opt) => (
                  <Button
                    key={opt.label}
                    onClick={() => handleSize(opt.toBB, opt.label)}
                    className="py-6 rounded-2xl font-black uppercase tracking-widest text-xs bg-orange-600 hover:bg-orange-700 text-white h-auto flex-col gap-0.5"
                  >
                    <span>{opt.label}</span>
                    <span className="text-[10px] opacity-80 font-medium normal-case">{formatBB(opt.toBB)}</span>
                  </Button>
                ))}
              </div>
              <Button onClick={() => setPendingType(null)} variant="ghost" className="w-full text-xs font-bold uppercase">
                Back
              </Button>
            </div>
          )}
        </div>
      )}

      {decided && (
        <Card className="bg-background/95 backdrop-blur-md p-8 rounded-[2.5rem] shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-300">
          {aiLoading ? (
            <div className="flex flex-col items-center justify-center h-32 gap-4 animate-pulse">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Coach is reviewing your decision...</span>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className={cn("text-2xl font-black flex items-center justify-center gap-3", vStyle?.color ?? 'text-muted-foreground')}>
                  <VerdictIcon className="w-7 h-7" />
                  {vStyle?.label ?? 'REVIEWED'}
                </div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Your Action: {heroActionLabel}</p>
                {verdict?.bestAction && (
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Coach&apos;s Pick: {verdict.bestAction}</p>
                )}
              </div>

              <div className="bg-muted/30 p-6 rounded-2xl border shadow-inner text-left">
                <div className="text-sm leading-relaxed text-muted-foreground">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-foreground mt-4 mb-2" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-foreground mt-3 mb-2" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-md font-bold text-foreground mt-2 mb-1" {...props} />,
                      strong: ({ node, ...props }) => <strong className="text-foreground font-black" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1 mb-2" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal pl-4 space-y-1 mb-2" {...props} />,
                      li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                      p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                    }}
                  >
                    {verdict?.explanation || ''}
                  </ReactMarkdown>
                </div>
              </div>

              <Button
                onClick={onNextHand}
                className="w-full py-6 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl text-sm"
              >
                Next Hand
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
