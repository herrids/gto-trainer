"use client";

import { X } from "lucide-react";
import { Button } from "./ui/button";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: string;
  setModel: (model: string) => void;
  analysisLevel: string;
  setAnalysisLevel: (level: string) => void;
}

export const SettingsModal = ({
  isOpen,
  onClose,
  model,
  setModel,
  analysisLevel,
  setAnalysisLevel,
}: SettingsModalProps) => {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="w-full max-w-md bg-background border rounded-2xl shadow-xl p-6 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-black uppercase tracking-tight">Settings</h2>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                    <X className="w-5 h-5" />
                </Button>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">AI Model</label>
                    <select 
                        value={model} 
                        onChange={(e) => setModel(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="google/gemini-3-flash-preview">Gemini 3 Flash Preview</option>
                        <option value="x-ai/grok-4.1-fast">Grok 4.1 Fast</option>
                        <option value="openai/gpt-5.2">GPT-5.2</option>
                        <option value="openai/gpt-5-nano">GPT-5 Nano</option>
                        <option value="openai/gpt-oss-120b:nitro">GPT OSS 120B Nitro</option>
                        <option value="anthropic/claude-haiku-4.5">Claude Haiku 4.5</option>
                        <option value="anthropic/claude-opus-4.5">Claude Opus 4.5</option>
                        <option value="moonshotai/kimi-k2.5">Moonshot Kimi k2.5</option>
                        <option value="deepseek/deepseek-v3.2">DeepSeek V3.2</option>
                    </select>
                    <p className="text-[10px] text-muted-foreground">
                        Select the AI model used for generating strategy explanations.
                    </p>
                </div>

                <div className="space-y-3 pt-2">
                    <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">Expertise Level</label>
                    <div className="flex items-center justify-between bg-muted/50 p-3 rounded-xl border">
                        <span className="font-medium text-sm">
                            {analysisLevel === 'beginner' ? 'Beginner Mode' : 'Expert Mode'}
                        </span>
                        <div className="flex bg-background rounded-lg border p-1">
                             <Button 
                                size="sm" 
                                variant={analysisLevel === 'beginner' ? 'default' : 'ghost'} 
                                onClick={() => setAnalysisLevel('beginner')}
                                className="h-7 text-xs"
                            >
                                Beginner
                            </Button>
                             <Button 
                                size="sm" 
                                variant={analysisLevel === 'pro' ? 'default' : 'ghost'} 
                                onClick={() => setAnalysisLevel('pro')}
                                className="h-7 text-xs"
                            >
                                Expert
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-2">
                <Button className="w-full font-bold" onClick={onClose}>
                    Save Changes
                </Button>
            </div>
        </div>
    </div>
  );
};
