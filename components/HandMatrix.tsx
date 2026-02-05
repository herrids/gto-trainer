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
      case 'walk': return 'bg-emerald-500 text-white hover:bg-emerald-600';
      case 'fold': return 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700';
      default: return 'bg-white';
    }
  };

  return (
    <div className="rounded-[2.5rem] p-4 shadow-xl border bg-card overflow-x-auto">
      <div className="min-w-[500px] grid grid-cols-[repeat(13,minmax(0,1fr))] gap-1">
        {matrix.map((row, i) => row.map((cell, j) => (
          <button
            key={`${i}-${j}`}
            onClick={() => onHandSelect(cell.hand, cell.action)}
            className={cn(
              "aspect-square flex items-center justify-center text-[9px] font-black rounded-sm hover:scale-125 transition-all",
              getActionColor(cell.action)
            )}
          >
            {cell.hand}
          </button>
        )))}
      </div>
    </div>
  );
};
