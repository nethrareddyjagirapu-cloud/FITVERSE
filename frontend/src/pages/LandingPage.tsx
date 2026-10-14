import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { FeatureGrid } from '../components/landing/FeatureGrid';
import { DashboardPreview } from '../components/landing/DashboardPreview';
import { Footer } from '../components/layout/Footer';
import { AuthModal } from './AuthModal';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, ShieldCheck, Dumbbell, Compass, Award } from 'lucide-react';
import { Button } from '../components/common/Button';

export const LandingPage: React.FC = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { loginDemoUser } = useAuth();
  const navigate = useNavigate();

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleDemoAccess = async () => {
    await loginDemoUser();
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col">
      <Navbar
        onOpenAuth={handleOpenAuth}
        onExploreDemo={handleDemoAccess}
      />

      <main className="flex-1">
        <HeroSection
          onGetStarted={() => handleOpenAuth('register')}
          onExploreDemo={handleDemoAccess}
        />

        <DashboardPreview />

        <FeatureGrid />

        {/* Transformation Journey Section */}
        <section id="journey" className="py-20 bg-dark-900/60 border-t border-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  Automated Progress Synthesizer
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 leading-tight">
                  Your Entire Journey, Documented Honestly
                </h2>
                <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                  Most fitness trackers overwhelm you with confusing numbers or fabricate data. FITVERSE generates an end-of-journey transformation report based strictly on your verified logs:
                </p>

                <div className="mt-6 space-y-3.5">
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-dark-950 border border-slate-800">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Mathematical Weight Delta</h4>
                      <p className="text-xs text-slate-400">
                        Exact calculation: <code className="text-emerald-400">Net Change = Latest Weight − Starting Weight</code>. Negative values denote verified weight loss.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-dark-950 border border-slate-800">
                    <div className="p-2 rounded-xl bg-lime-500/10 text-lime-400 shrink-0">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Data Completeness Transparency</h4>
                      <p className="text-xs text-slate-400">
                        We never assume missing days mean zero activity. Your report openly distinguishes logged consistency from missing data.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Button
                    variant="primary"
                    onClick={() => handleOpenAuth('register')}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Start a 30-Day or 60-Day Journey
                  </Button>
                </div>
              </div>

              {/* Journey Report Card Visual */}
              <div className="p-6 sm:p-8 rounded-3xl bg-dark-950 border border-slate-800 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sample Journey Report</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                    Completed 60-Day Run
                  </span>
                </div>
                <div className="mt-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-dark-900 border border-slate-800">
                      <span className="text-[11px] text-slate-400">Net Weight Change</span>
                      <p className="text-xl font-black text-emerald-400 mt-0.5">-4.2 kg</p>
                    </div>
                    <div className="p-3 rounded-xl bg-dark-900 border border-slate-800">
                      <span className="text-[11px] text-slate-400">Workouts Logged</span>
                      <p className="text-xl font-black text-white mt-0.5">38 Sessions</p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-dark-900 border border-slate-800 text-xs text-slate-300">
                    <span className="text-slate-400 block mb-1">Nutrition Adherence:</span>
                    <span>Average Daily Calories: <strong>2,120 kcal</strong> • Daily Protein Average: <strong>142g</strong></span>
                  </div>
                  <div className="text-[11px] text-slate-500 italic text-center">
                    Report exportable to printable & PDF format for your personal archives.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FitBot Callout Banner */}
        <section id="fitbot" className="py-16 bg-gradient-to-b from-dark-950 to-dark-900 border-t border-slate-800/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-lime-400/10 border border-lime-400/20 text-lime-400 mb-4">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-3xl font-extrabold text-white">
              Meet FitBot: The AI Grounded in Your Actual Data
            </h2>
            <p className="mt-3 text-sm text-slate-400 max-w-2xl mx-auto">
              Ask about your remaining calories, get personalized workout suggestions based on your logged experience level, and never wonder what to eat next.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button variant="primary" size="lg" onClick={handleDemoAccess} icon={<ArrowRight className="w-5 h-5" />}>
                Try FitBot in Demo Mode
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
};
