import { Target } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';

interface ScenarioSelectorProps {
  situation: string;
  setSituation: (sit: string) => void;
}

export const ScenarioSelector = ({ situation, setSituation }: ScenarioSelectorProps) => {
  const scenarios = [
    { id: 'RFI', label: 'Raise First In', sub: 'Unopened pot' },
    { id: 'LIMPERS', label: 'Facing Limpers', sub: 'Isolation Opportunity' },
    { id: 'FACING', label: 'Facing Open-Raise', sub: 'Defensive Logic' },
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <Target className="w-3 h-3" /> Preflop Scenario
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {scenarios.map((sit) => (
          <Button
            key={sit.id}
            onClick={() => setSituation(sit.id)}
            variant={situation === sit.id ? 'default' : 'outline'}
            className={cn(
                "w-full h-auto p-4 justify-start text-left border-2 block",
                situation === sit.id ? "" : "hover:border-slate-300"
            )}
          >
            <div className="font-black text-sm uppercase">{sit.label}</div>
            <div className="text-[10px] opacity-70 font-medium whitespace-normal">{sit.sub}</div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};
