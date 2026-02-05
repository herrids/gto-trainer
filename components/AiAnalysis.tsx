import { Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Card } from './ui/card';
import { POSITION_NAMES } from '@/lib/poker-data';
import { getCardsFromHandString } from '@/lib/poker-utils';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

interface AiAnalysisProps {
  selectedHand: string | null;
  position: string;
  situation: string;
  aiLoading: boolean;
  aiExplanation: string;
}

export const AiAnalysis = ({
  selectedHand,
  position,
  situation,
  aiLoading,
  aiExplanation,
}: AiAnalysisProps) => {

  return (
    <Card className={cn(
        "rounded-3xl p-8 border-2 border-dashed shadow-sm transition-all",
        selectedHand ? "border-blue-500 bg-blue-50/10" : "border-slate-200 opacity-50"
    )}>
      {selectedHand ? (
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="flex gap-2">
                {getCardsFromHandString(selectedHand).map((card, idx) => (
                  <div key={idx} className="w-16 h-24 bg-white rounded-xl shadow-xl border-2 border-slate-200 flex flex-col justify-between p-2 flex-shrink-0 animate-in slide-in-from-bottom-2">
                    <div className={cn("text-sm font-black", (card.suit === '♥' || card.suit === '♦') ? 'text-rose-500' : 'text-slate-900')}>{card.rank}</div>
                    <div className={cn("text-3xl self-center", (card.suit === '♥' || card.suit === '♦') ? 'text-rose-500' : 'text-slate-900')}>{card.suit}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Selected Context</div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300">
                    {POSITION_NAMES[position]}
                  </Badge>
                  <Badge variant="outline" className="text-muted-foreground">
                    {situation === 'RFI' ? 'RFI' : situation === 'LIMPERS' ? 'Limpers' : 'Facing Open'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background p-6 rounded-2xl border shadow-inner min-h-[140px]">
            {aiLoading ? (
              <div className="flex flex-col items-center justify-center h-24 gap-4 animate-pulse">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Generating GTO Analysis...</span>
              </div>
            ) : (
              <div className="text-sm leading-relaxed text-muted-foreground">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-xl font-bold text-foreground mt-4 mb-2" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-lg font-bold text-foreground mt-3 mb-2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-md font-bold text-foreground mt-2 mb-1" {...props} />,
                    strong: ({node, ...props}) => <strong className="text-foreground font-black" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1 mb-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-4 space-y-1 mb-2" {...props} />,
                    li: ({node, ...props}) => <li className="pl-1" {...props} />,
                    table: ({node, ...props}) => <div className="overflow-x-auto my-4 rounded-lg border"><table className="w-full text-left text-xs" {...props} /></div>,
                    thead: ({node, ...props}) => <thead className="bg-muted text-foreground uppercase tracking-wider font-semibold" {...props} />,
                    th: ({node, ...props}) => <th className="px-4 py-2 border-b" {...props} />,
                    td: ({node, ...props}) => <td className="px-4 py-2 border-b last:border-0" {...props} />,
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary/20 pl-4 italic text-muted-foreground my-2" {...props} />,
                    code: ({node, ...props}) => <code className="bg-muted px-1 py-0.5 rounded font-mono text-xs text-foreground" {...props} />,
                  }}
                >
                  {aiExplanation}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 space-y-4">
          <Sparkles className="w-10 h-10 text-blue-400 mx-auto opacity-40" />
          <p className="font-black text-xs text-muted-foreground uppercase tracking-widest">Select any hand on the grid for AI strategy analysis</p>
        </div>
      )}
    </Card>
  );
};
