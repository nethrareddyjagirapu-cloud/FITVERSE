import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChatMessage } from '../types';
import { Button } from '../components/common/Button';
import { fitbotApi } from '../services/api';
import {
  Sparkles,
  Send,
  User,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Dumbbell,
  UtensilsCrossed,
  Scale,
} from 'lucide-react';

export const FitBotPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello ${user?.fullName || 'Athlete'}! I am FitBot, your AI fitness & nutrition assistant. I am connected directly to your logged meals, workouts, and target goals. How can I assist your training or nutrition today?`,
      timestamp: 'Just now',
      isDemo: true,
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Pull user's real logged statistics from storage for intelligent deterministic grounding
  const savedMeals = localStorage.getItem(`fitverse_nutrition_items_${user?.id}`);
  const mealsList = savedMeals ? JSON.parse(savedMeals) : [];
  const totalProteinLogged = mealsList.reduce((acc: number, m: any) => acc + (m.protein || 0), 0);
  const totalCaloriesLogged = mealsList.reduce((acc: number, m: any) => acc + (m.calories || 0), 0);

  const targetProtein = user?.profile?.targetDailyProtein || 140;
  const targetCalories = user?.profile?.targetDailyCalories || 2200;
  const remainingProtein = Math.max(0, targetProtein - totalProteinLogged);
  const remainingCalories = Math.max(0, targetCalories - totalCaloriesLogged);

  const samplePrompts = [
    'How much protein do I have remaining today?',
    'Suggest a vegetarian high-protein dinner based on my remaining targets.',
    'What exercises are best for building upper chest?',
    'How has my weight changed since I started my current journey?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const resp = await fitbotApi.chat(query);
      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: resp.reply,
        timestamp: resp.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDemo: resp.demo,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      // Fallback if backend is not currently running
      let botReply = '';
      const lower = query.toLowerCase();

      if (lower.includes('protein')) {
        botReply = `According to your actual logged food entries today, you have consumed **${totalProteinLogged.toFixed(1)}g of protein** towards your **${targetProtein}g daily goal**. You have **${remainingProtein.toFixed(1)}g of protein remaining**. \n\nTo hit this target, you could consume 100g of Paneer (18g protein) or 40g of Soya Chunks (20g protein).`;
      } else if (lower.includes('dinner') || lower.includes('vegetarian')) {
        botReply = `Based on your remaining calorie target of **${remainingCalories} kcal** and protein target of **${remainingProtein.toFixed(1)}g**, here is a balanced vegetarian dinner recommendation:\n• **2 Multigrain Rotis (70g)**: 208 kcal, 6g protein\n• **150g Dal Tadka / Moong Dal**: 158 kcal, 10g protein\n• **100g Grilled Paneer or Tofu**: 265 kcal, 18g protein\n• **Fresh Green Salad**: 35 kcal, 1g protein\nTotal: ~660 kcal and ~35g protein.`;
      } else if (lower.includes('chest') || lower.includes('workout')) {
        botReply = `For upper chest development, the best movements include:\n1. **Incline Dumbbell Bench Press (30° angle)**: 3-4 sets of 8-10 reps focusing on controlled eccentric lowering.\n2. **Incline Cable Flyes**: Keeps continuous tension at peak pectoral contraction.\n3. **Decline Pushups or Low-to-High Cable Crossovers**: Great accessory finishers.`;
      } else if (lower.includes('weight') || lower.includes('journey')) {
        botReply = `You are currently in the **${user?.profile?.fitnessGoal?.replace('_', ' ') || 'General Fitness'}** phase. Your baseline recorded weight is **${user?.profile?.currentWeightKg || 75} kg**. Be sure to log weigh-ins in the morning on an empty stomach for maximum consistency!`;
      } else {
        botReply = `Great question! Consistency in caloric balance, adequate protein intake (~1.6-2.0g/kg), progressive overload, and 7-8 hours of sleep form the bedrock of your transformation. Would you like specific meal ideas or a workout routine breakdown?`;
      }

      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDemo: true,
      };

      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col rounded-3xl bg-dark-900 border border-slate-800 overflow-hidden animate-in fade-in duration-300">
      {/* FitBot Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-dark-950/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">FitBot AI Assistant</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-lime-400/10 text-lime-400 border border-lime-400/30 font-bold">
                Grounded Engine Active
              </span>
            </div>
            <p className="text-xs text-slate-400">Personalized fitness companion trained on your verified records</p>
          </div>
        </div>

        {/* User Context Badge */}
        <div className="hidden md:flex items-center gap-3 text-xs text-slate-400 bg-dark-900 border border-slate-800 px-3.5 py-1.5 rounded-xl">
          <span className="flex items-center gap-1">
            <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-400" />
            Protein Today: <strong className="text-white">{totalProteinLogged.toFixed(0)}/{targetProtein}g</strong>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Scale className="w-3.5 h-3.5 text-teal-400" />
            Weight: <strong className="text-white">{user?.profile?.currentWeightKg || 75}kg</strong>
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 max-w-3xl ${
              m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                m.sender === 'user'
                  ? 'bg-emerald-500 text-dark-950'
                  : 'bg-dark-800 border border-slate-700 text-lime-400'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>

            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-emerald-500 text-dark-950 font-medium'
                  : 'bg-dark-950 border border-slate-800 text-slate-200'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>
              <span
                className={`block text-[10px] mt-1.5 ${
                  m.sender === 'user' ? 'text-emerald-950/70 text-right' : 'text-slate-500'
                }`}
              >
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-dark-800 border border-slate-700 text-lime-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-dark-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
              FitBot is calculating from your verified logs...
            </div>
          </div>
        )}
      </div>

      {/* Suggested Chips */}
      <div className="px-4 py-2 border-t border-slate-800/60 bg-dark-950/40 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] text-slate-500 shrink-0">Try asking:</span>
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(p)}
            className="text-xs bg-dark-900 hover:bg-dark-800 text-slate-300 border border-slate-800 px-3 py-1 rounded-xl whitespace-nowrap transition"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-slate-800 bg-dark-950/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your remaining nutrition, exercise form, or workout volume..."
            className="flex-1 px-4 py-3 rounded-xl bg-dark-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition"
          />
          <Button
            type="submit"
            variant="primary"
            disabled={!input.trim() || isLoading}
            icon={<Send className="w-4 h-4" />}
            className="font-bold py-3"
          >
            Send
          </Button>
        </form>

        <p className="text-[10px] text-slate-500 text-center mt-2 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          FitBot provides fitness education based on your logged records. It does not provide medical prescriptions or clinical diagnosis.
        </p>
      </div>
    </div>
  );
};
