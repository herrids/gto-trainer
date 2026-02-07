import { useMemo } from 'react';
import { generateHandMatrix } from '@/lib/poker-utils';
import { cn } from '@/lib/utils';

interface HandMatrixProps {
  position: string;
  situation: string;
  onHandSelect: (hand: string, action: string) => void;
}

export const HandMatrix = ({ position, situation, onHandSelect }: HandMatrixProps) => {
  const matrix = useMemo(() => generateHandMatrix(position, situation), [position, situation]);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'raise': return 'bg-orange-600 text-white hover:bg-orange-700';
      case '3bet': return 'bg-orange-400 text-white hover:bg-orange-500';
      case 'call': return 'bg-blue-600 text-white hover:bg-blue-700';
      case 'walk': return 'bg-emerald-500 text-white';
      case 'fold': return 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700';
      default: return 'bg-white';
    }
  };

  const legendItems = [
    { label: 'Raise', color: 'bg-orange-600' },
    { label: '3-Bet', color: 'bg-orange-400' },
    { label: 'Call', color: 'bg-blue-600' },
    { label: 'Fold', color: 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700' },
  ];

  return (
    <div className="rounded-[2.5rem] p-4 shadow-xl border bg-card overflow-x-auto">
      <div className="min-w-[500px] grid grid-cols-[repeat(13,minmax(0,1fr))] gap-1 mb-6">
        {matrix.map((row, i) => row.map((cell, j) => (
          <button
            key={`${i}-${j}`}
            disabled={cell.action === 'walk'}
            onClick={() => onHandSelect(cell.hand, cell.action)}
            className={cn(
              "aspect-square flex items-center justify-center text-[9px] font-black rounded-sm transition-all",
              cell.action !== 'walk' && "hover:scale-125",
              getActionColor(cell.action)
            )}
          >
            {cell.hand}
          </button>
        )))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 border-t pt-4">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-sm", item.color)} />
            <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
