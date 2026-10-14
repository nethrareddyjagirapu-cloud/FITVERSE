import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Exercise, WorkoutSession, WorkoutSet } from '../types';
import { workoutApi } from '../services/api';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import {
  Dumbbell,
  Play,
  CheckCircle,
  Plus,
  Trash2,
  Trophy,
  Activity,
  Layers,
  Timer,
  Info,
} from 'lucide-react';

// Exercise Library across 10 categories
const EXERCISE_LIBRARY: Exercise[] = [
  // Chest
  { id: 'ex-1', name: 'Barbell Flat Bench Press', muscleGroup: 'Chest', equipment: 'Barbell & Bench', difficulty: 'INTERMEDIATE', instructions: 'Retract scapula, lower bar to mid-chest, drive up with feet planted.' },
  { id: 'ex-2', name: 'Incline Dumbbell Press', muscleGroup: 'Chest', equipment: 'Dumbbells & 30° Incline Bench', difficulty: 'INTERMEDIATE', instructions: 'Press dumbbells up at an angle focusing on upper pectoral contraction.' },
  // Back
  { id: 'ex-3', name: 'Lat Pulldown', muscleGroup: 'Back', equipment: 'Cable Machine', difficulty: 'BEGINNER', instructions: 'Pull bar down towards upper chest while arching upper back gently.' },
  { id: 'ex-4', name: 'Barbell Bent-Over Row', muscleGroup: 'Back', equipment: 'Barbell', difficulty: 'INTERMEDIATE', instructions: 'Hinge at hips, pull bar towards belly button, squeeze lats and traps.' },
  // Shoulders
  { id: 'ex-5', name: 'Dumbbell Lateral Raise', muscleGroup: 'Shoulders', equipment: 'Dumbbells', difficulty: 'BEGINNER', instructions: 'Raise arms out to side with slight elbow bend up to shoulder level.' },
  { id: 'ex-6', name: 'Overhead Barbell Military Press', muscleGroup: 'Shoulders', equipment: 'Barbell', difficulty: 'ADVANCED', instructions: 'Stand tall, press barbell overhead, locking elbows at the top.' },
  // Biceps
  { id: 'ex-7', name: 'Standing Barbell Bicep Curl', muscleGroup: 'Biceps', equipment: 'Barbell', difficulty: 'BEGINNER', instructions: 'Keep elbows tucked into ribs, curl weight without swinging torso.' },
  // Triceps
  { id: 'ex-8', name: 'Tricep Rope Pushdown', muscleGroup: 'Triceps', equipment: 'Cable Machine', difficulty: 'BEGINNER', instructions: 'Extend elbows downwards, flaring rope slightly at bottom for lockout.' },
  // Legs
  { id: 'ex-9', name: 'Barbell Back Squat', muscleGroup: 'Legs', equipment: 'Barbell & Squat Rack', difficulty: 'INTERMEDIATE', instructions: 'Feet shoulder-width, squat to parallel or below, keeping chest upright.' },
  { id: 'ex-10', name: 'Romanian Deadlift (RDL)', muscleGroup: 'Legs', equipment: 'Barbell / Dumbbells', difficulty: 'INTERMEDIATE', instructions: 'Hinge back at the hips, keeping back flat and feeling hamstring stretch.' },
  // Core & Abs
  { id: 'ex-11', name: 'Hanging Leg Raises', muscleGroup: 'Core & Abs', equipment: 'Pull-up Bar', difficulty: 'INTERMEDIATE', instructions: 'Hang from bar, raise legs up towards chest without excessive swinging.' },
  // Cardio
  { id: 'ex-12', name: 'High-Intensity Treadmill Intervals', muscleGroup: 'Cardio', equipment: 'Treadmill', difficulty: 'INTERMEDIATE', instructions: 'Alternate 1 min sprint with 1 min brisk walking for target duration.' },
  // Flexibility & Mobility
  { id: 'ex-13', name: 'World’s Greatest Stretch', muscleGroup: 'Flexibility & Mobility', equipment: 'Bodyweight', difficulty: 'BEGINNER', instructions: 'Deep lunge with torso rotation to open hips, thoracic spine, and hamstrings.' },
  // Full Body
  { id: 'ex-14', name: 'Kettlebell Swings', muscleGroup: 'Full Body', equipment: 'Kettlebell', difficulty: 'INTERMEDIATE', instructions: 'Hinge explosively with glutes and hamstrings to swing kettlebell to chest level.' },
];

const MUSCLE_GROUPS = [
  'All',
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Legs',
  'Core & Abs',
  'Cardio',
  'Flexibility & Mobility',
  'Full Body',
];

export const WorkoutTrackerPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [searchExercise, setSearchExercise] = useState('');

  // Workout sessions stored in localStorage
  const [sessions, setSessions] = useState<WorkoutSession[]>(() => {
    const saved = localStorage.getItem(`fitverse_workout_sessions_${user?.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  // Active workout logger modal
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [sessionTitle, setSessionTitle] = useState('Upper Body Hypertrophy');
  const [sessionNotes, setSessionNotes] = useState('');
  const [activeSets, setActiveSets] = useState<{ exerciseName: string; weight: number; reps: number }[]>([
    { exerciseName: 'Barbell Flat Bench Press', weight: 60, reps: 10 },
    { exerciseName: 'Barbell Flat Bench Press', weight: 65, reps: 8 },
    { exerciseName: 'Lat Pulldown', weight: 55, reps: 12 },
  ]);

  // Selected exercise detail modal
  const [viewExercise, setViewExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`fitverse_workout_sessions_${user.id}`, JSON.stringify(sessions));
      // Sync total sessions to dashboard
      const dashboardFormat = sessions.map((s) => ({
        id: s.id,
        name: s.name,
        durationMinutes: s.durationMinutes,
        muscleGroup: s.muscleGroups.join(', '),
        sets: s.exercisesLogged,
      }));
      localStorage.setItem(`fitverse_workouts_${user.id}`, JSON.stringify(dashboardFormat));
    }
  }, [sessions, user?.id]);

  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      try {
        const history = await workoutApi.getHistory();
        if (isMounted && Array.isArray(history) && history.length > 0) {
          setSessions(history);
        }
      } catch {
        // Offline or demo fallback
      }
    };
    if (user?.id) {
      fetchHistory();
    }
    return () => { isMounted = false; };
  }, [user?.id]);

  const handleFinishWorkout = () => {
    if (activeSets.length === 0) return;

    const totalVolume = activeSets.reduce((acc, s) => acc + s.weight * s.reps, 0);
    const newSession: WorkoutSession = {
      id: `session-${Date.now()}`,
      name: sessionTitle,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      durationMinutes: 45,
      muscleGroups: [selectedMuscle === 'All' ? 'Full Body' : selectedMuscle],
      totalVolumeKg: totalVolume,
      notes: sessionNotes,
      exercisesLogged: activeSets.length,
    };

    setSessions((prev) => [newSession, ...prev]);

    // Persist to backend database asynchronously
    workoutApi.logSession(newSession).then((saved) => {
      if (saved && saved.id) {
        setSessions((prev) => prev.map((s) => s.id === newSession.id ? { ...s, id: saved.id } : s));
      }
    }).catch((err) => {
      console.warn('Backend unavailable, workout saved locally:', err);
    });

    setIsSessionModalOpen(false);
  };

  const handleAddSetToActive = (exerciseName: string) => {
    setActiveSets((prev) => [...prev, { exerciseName, weight: 50, reps: 10 }]);
  };

  const handleRemoveSet = (index: number) => {
    setActiveSets((prev) => prev.filter((_, i) => i !== index));
  };

  const filteredExercises = EXERCISE_LIBRARY.filter((ex) => {
    const matchesGroup = selectedMuscle === 'All' || ex.muscleGroup === selectedMuscle;
    const matchesSearch = ex.name.toLowerCase().includes(searchExercise.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-dark-900 border border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            Workout Tracker
            <Dumbbell className="w-6 h-6 text-lime-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Progressive overload logger with 10 muscle categories and volume tracking.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsSessionModalOpen(true)}
          icon={<Play className="w-4 h-4 fill-dark-950" />}
          className="font-bold shadow-lg shadow-emerald-500/20"
        >
          Start New Workout Session
        </Button>
      </div>

      {/* Muscle Group Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {MUSCLE_GROUPS.map((mg) => (
          <button
            key={mg}
            onClick={() => setSelectedMuscle(mg)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedMuscle === mg
                ? 'bg-lime-400 text-dark-950 shadow-md shadow-lime-400/20'
                : 'bg-dark-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {mg}
          </button>
        ))}
      </div>

      {/* Exercise Library Grid */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold text-white">Exercise Library</h2>
          <span className="text-xs text-slate-400">{filteredExercises.length} Exercises Available</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map((ex) => (
            <div
              key={ex.id}
              className="p-5 rounded-2xl bg-dark-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-md bg-dark-950 text-emerald-400 border border-slate-800 font-semibold">
                    {ex.muscleGroup}
                  </span>
                  <span className="text-[11px] text-slate-400 capitalize">{ex.difficulty.toLowerCase()}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-1">{ex.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{ex.instructions}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => setViewExercise(ex)}
                  className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1"
                >
                  <Info className="w-3.5 h-3.5" />
                  Details
                </button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleAddSetToActive(ex.name);
                    setIsSessionModalOpen(true);
                  }}
                  icon={<Plus className="w-3 h-3" />}
                  className="text-xs py-1"
                >
                  Add to Routine
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workout Session History */}
      <div className="rounded-3xl bg-dark-900 border border-slate-800 p-6">
        <h2 className="text-base font-bold text-white mb-1">Recorded Workout Sessions</h2>
        <p className="text-xs text-slate-400 mb-4">Historical sessions and accumulated training volume</p>

        {sessions.length === 0 ? (
          <EmptyState
            icon={<Dumbbell className="w-6 h-6" />}
            title="No workout sessions recorded yet"
            description="Start your first session to track exercises, sets, weights, and total training volume."
            actionText="Start Session"
            onAction={() => setIsSessionModalOpen(true)}
            actionIcon={<Play className="w-4 h-4" />}
          />
        ) : (
          <div className="space-y-3">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-2xl bg-dark-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{s.name}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{s.date}</span>
                  </div>
                  <p className="text-slate-400 mt-1">
                    {s.exercisesLogged} Exercises logged • Duration: {s.durationMinutes} minutes
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Training Volume</span>
                    <span className="font-black text-lime-400 text-sm">{s.totalVolumeKg.toLocaleString()} kg</span>
                  </div>
                  <span className="p-2 rounded-xl bg-lime-400/10 text-lime-400 border border-lime-400/20">
                    <CheckCircle className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Workout Session Modal */}
      <Modal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        title="Active Workout Logger"
        subtitle="Record your exercises, weights, and repetitions in real-time."
        maxWidth="xl"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Session Name</label>
            <input
              type="text"
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-dark-950 border border-slate-800 text-xs text-white"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-white">Logged Sets & Exercises ({activeSets.length})</span>
              <button
                type="button"
                onClick={() => handleAddSetToActive('Barbell Flat Bench Press')}
                className="text-xs text-emerald-400 hover:underline inline-flex items-center gap-1 font-bold"
              >
                <Plus className="w-3.5 h-3.5" /> Add Set
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {activeSets.map((set, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-dark-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-white">{set.exerciseName}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={set.weight}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setActiveSets((prev) =>
                            prev.map((s, i) => (i === idx ? { ...s, weight: val } : s))
                          );
                        }}
                        className="w-16 px-2 py-1 rounded bg-dark-900 border border-slate-800 text-center text-white"
                      />
                      <span className="text-slate-400">kg</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setActiveSets((prev) =>
                            prev.map((s, i) => (i === idx ? { ...s, reps: val } : s))
                          );
                        }}
                        className="w-14 px-2 py-1 rounded bg-dark-900 border border-slate-800 text-center text-white"
                      />
                      <span className="text-slate-400">reps</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveSet(idx)}
                      className="p-1 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-3 border-t border-slate-800">
            <Button variant="secondary" onClick={() => setIsSessionModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleFinishWorkout} className="flex-1 font-bold">
              Finish & Save Workout
            </Button>
          </div>
        </div>
      </Modal>

      {/* Exercise Detail Modal */}
      {viewExercise && (
        <Modal
          isOpen={!!viewExercise}
          onClose={() => setViewExercise(null)}
          title={viewExercise.name}
          subtitle={`Target Muscle: ${viewExercise.muscleGroup} • Equipment: ${viewExercise.equipment}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div>
              <h4 className="font-bold text-white mb-1">Execution Form & Instructions:</h4>
              <p className="text-slate-300 leading-relaxed bg-dark-950 p-3.5 rounded-xl border border-slate-800">
                {viewExercise.instructions}
              </p>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-dark-950 border border-slate-800">
              <span className="text-slate-400">Recommended Difficulty:</span>
              <span className="font-bold text-emerald-400">{viewExercise.difficulty}</span>
            </div>
            <Button
              variant="primary"
              onClick={() => {
                handleAddSetToActive(viewExercise.name);
                setViewExercise(null);
                setIsSessionModalOpen(true);
              }}
              className="w-full font-bold"
            >
              Add To Active Session
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
