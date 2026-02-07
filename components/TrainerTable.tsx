import { User, CheckCircle2, XCircle, MessageSquareText } from 'lucide-react';
import { Button } from './ui/button';
import { POS_ORDER, TABLE_SLOTS, POSITION_NAMES } from '@/lib/poker-data';
import { cn } from '@/lib/utils';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface TrainerTableProps {
  currentQuestion: any;
  feedback: any;
  score: { correct: number; total: number };
  onAction: (action: string) => void;
  onNextHand: () => void;
  onAskAi: () => void;
}

export const TrainerTable = ({
  currentQuestion,
  feedback,
  score,
  onAction,
  onNextHand,
  onAskAi,
}: TrainerTableProps) => {

  return (
    <div className="flex flex-col items-center py-4 space-y-8">
      <div className="relative w-full max-w-4xl aspect-[2/1] bg-emerald-950 rounded-[250px] border-[16px] border-slate-900 shadow-2xl flex items-center justify-center mt-12 mb-12">
        <div className="absolute inset-4 border border-emerald-800/20 rounded-[230px]" />
        
        {currentQuestion && (
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
        )}

        {currentQuestion && POS_ORDER.map((pos, idx) => {
          const targetIdx = POS_ORDER.indexOf(currentQuestion.pos);
          const rotated = POS_ORDER[(targetIdx + idx) % 6];
          const slot = TABLE_SLOTS[idx];
          const isLimp = currentQuestion.limperPos === rotated;
          const isHero = idx === 0;

          return (
            <div key={idx} style={{ top: slot.top, left: slot.left }} className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              {isLimp && <div className="bg-amber-500 text-white text-[9px] font-black px-3 py-1 rounded-full animate-bounce uppercase mb-1 shadow-lg shadow-amber-500/30">LIMP</div>}
              <div className={cn(
                  "w-24 p-2 rounded-3xl border-2 flex flex-col items-center transition-all",
                  isHero ? "bg-primary border-white scale-125 shadow-2xl z-40" : "bg-slate-900/90 border-slate-700 z-10"
              )}>
                <div className={cn("p-1.5 rounded-full mb-1", isHero ? "bg-primary-foreground/20" : "bg-slate-800")}>
                    <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-tighter">{rotated}</span>
              </div>
            </div>
          );
        })}

        <div className="z-40">
          {!feedback ? (
            <div className="flex gap-4 animate-in zoom-in-95 duration-300">
              {currentQuestion?.cards.map((c: any, i: number) => (
                <div key={i} className="w-24 h-36 bg-white rounded-2xl shadow-2xl border-2 border-slate-100 flex flex-col justify-between p-4 transform transition-transform hover:-translate-y-2">
                  <div className={cn("text-2xl font-black", (c.suit === '♥' || c.suit === '♦') ? 'text-rose-500' : 'text-slate-900')}>{c.rank}</div>
                  <div className={cn("text-6xl self-center", (c.suit === '♥' || c.suit === '♦') ? 'text-rose-500' : 'text-slate-900')}>{c.suit}</div>
                  <div className={cn("text-2xl font-black self-end rotate-180", (c.suit === '♥' || c.suit === '♦') ? 'text-rose-500' : 'text-slate-900')}>{c.rank}</div>
                </div>
              ))}
            </div>
          ) : (
            <Card className="bg-background/95 backdrop-blur-md p-8 rounded-[3rem] shadow-2xl text-center min-w-[340px] animate-in zoom-in-95 duration-300 relative overflow-hidden">
              <div className={cn("text-3xl font-black mb-3 flex items-center justify-center gap-3", feedback.isCorrect ? 'text-emerald-500' : 'text-rose-500')}>
                {feedback.isCorrect ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                {feedback.isCorrect ? 'PERFECT' : 'MISTAKE'}
              </div>
              <p className="text-sm font-bold text-muted-foreground uppercase mb-8 tracking-widest">GTO Choice: {feedback.correctAction.toUpperCase()}</p>
              
              <div className="flex flex-col gap-3">
                <Button 
                    variant="secondary"
                    onClick={onAskAi}
                    className="w-full py-6 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <MessageSquareText className="w-4 h-4" /> Ask AI Coach Why ✨
                </Button>
                <Button 
                    onClick={onNextHand} 
                    className="w-full py-6 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl text-sm"
                >
                    Next Hand
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {currentQuestion && !feedback && (
        <div className="w-full max-w-xl text-center space-y-10 animate-in fade-in slide-in-from-bottom-4">
          <div className="space-y-3">
            <h3 className="text-3xl font-black uppercase tracking-tighter">Action on <span className="text-primary">{POSITION_NAMES[currentQuestion.pos]}</span></h3>
            <div className="flex justify-center gap-3">
              <Badge variant="secondary" className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                {currentQuestion.sit === 'LIMPERS' ? `Facing Limper in ${currentQuestion.limperPos}` : currentQuestion.sit === 'RFI' ? 'Raise First In' : 'Facing Open-Raise'}
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <Button onClick={() => onAction('fold')} variant="secondary" className="py-8 rounded-[2.5rem] font-black uppercase tracking-widest shadow-lg">Fold</Button>
            <Button onClick={() => onAction('call')} className="py-8 bg-blue-600 hover:bg-blue-700 rounded-[2.5rem] font-black uppercase tracking-widest text-white shadow-xl shadow-blue-500/30">Call</Button>
            <Button onClick={() => onAction('raise')} className="py-8 bg-orange-600 hover:bg-orange-700 rounded-[2.5rem] font-black uppercase tracking-widest text-white shadow-xl shadow-orange-500/30">Raise</Button>
          </div>
        </div>
      )}
    </div>
  );
};
