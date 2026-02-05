import { MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { POSITION_NAMES } from '@/lib/poker-data';

interface PositionSelectorProps {
  position: string;
  setPosition: (pos: string) => void;
}

export const PositionSelector = ({ position, setPosition }: PositionSelectorProps) => {
  return (
    <Card>
        <CardHeader className="pb-4">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <MapPin className="w-3 h-3" /> Position Selection
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 gap-2">
                {Object.keys(POSITION_NAMES).map((pos) => (
                <Button 
                    key={pos} 
                    onClick={() => setPosition(pos)} 
                    variant={position === pos ? 'default' : 'outline'}
                    className={`h-auto py-3 px-2 rounded-xl text-xs font-black border-2 transition-all ${position === pos ? 'shadow-lg' : ''}`}
                >
                    {pos}
                </Button>
                ))}
            </div>
        </CardContent>
    </Card>
  );
};
