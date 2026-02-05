"use client"

import { Brain, Settings, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from './ui/button';

interface HeaderProps {
  view: string;
  setView: (view: string) => void;
  onOpenSettings: () => void;
}

export const Header = ({ view, setView, onOpenSettings }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between gap-4 border-b pb-6">
      <div className="flex items-center gap-4">
        <div className="bg-primary p-2 rounded-xl shadow-lg">
          <Brain className="text-primary-foreground w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">GTO 6-Max Coach</h1>
          <p className="text-muted-foreground font-medium italic">Master Your Preflop Game</p>
        </div>
      </div>
      <div className="flex bg-muted p-1 rounded-2xl shadow-inner">
        <Button
          variant={view === 'reference' ? 'default' : 'ghost'}
          className="rounded-xl font-bold"
          onClick={() => setView('reference')}
        >
          Reference
        </Button>
        <Button
          variant={view === 'game' ? 'default' : 'ghost'}
          className="rounded-xl font-bold"
          onClick={() => setView('game')}
        >
          Trainer
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="rounded-xl" onClick={onOpenSettings}>
          <Settings className="w-5 h-5 text-muted-foreground" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-xl"
          onClick={() => signOut({ callbackUrl: '/login' })}
          title="Sign out"
        >
          <LogOut className="w-5 h-5 text-muted-foreground" />
        </Button>
      </div>
    </header>
  );
};
