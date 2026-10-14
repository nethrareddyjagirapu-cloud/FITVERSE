import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ProgressMeasurement, ProgressPhoto } from '../types';
import { progressApi } from '../services/api';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import {
  LineChart,
  Camera,
  Plus,
  Trash2,
  Columns,
  Scale,
  ShieldCheck,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export const ProgressTrackerPage: React.FC = () => {
  const { user } = useAuth();

  // Measurements
  const [measurements, setMeasurements] = useState<ProgressMeasurement[]>([
    { id: 'm-1', date: 'Sep 15, 2026', weightKg: 77.0, waistCm: 84, chestCm: 101, hipCm: 98, notes: 'Starting baseline measurement' },
    { id: 'm-2', date: 'Oct 01, 2026', weightKg: 75.8, waistCm: 82.5, chestCm: 102, hipCm: 97.5, notes: 'Feeling leaner, waist reduced' },
    { id: 'm-3', date: 'Oct 12, 2026', weightKg: 75.0, waistCm: 81.5, chestCm: 103, hipCm: 97.0, notes: 'Chest circumference increased, waist decreased' },
  ]);

  // Photos (with private demo placeholders)
  const [photos, setPhotos] = useState<ProgressPhoto[]>([
    {
      id: 'p-1',
      date: 'Sep 15, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&auto=format&fit=crop&q=60',
      label: 'Week 1 Baseline',
      notes: 'Starting physique check',
    },
    {
      id: 'p-2',
      date: 'Oct 12, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&auto=format&fit=crop&q=60',
      label: 'Week 4 Check-in',
      notes: 'Noticeable upper body definition and posture improvement',
    },
  ]);

  // Modal states
  const [isMeasureModalOpen, setIsMeasureModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // New measurement form
  const [newWeight, setNewWeight] = useState(75.0);
  const [newWaist, setNewWaist] = useState(81.0);
  const [newChest, setNewChest] = useState(103.0);
  const [newHip, setNewHip] = useState(97.0);
  const [newNotes, setNewNotes] = useState('');

  // Compare photo state
  const [compareLeft, setCompareLeft] = useState<string>(photos[0]?.id || '');
  const [compareRight, setCompareRight] = useState<string>(photos[1]?.id || '');

  useEffect(() => {
    let isMounted = true;
    const fetchMeasurements = async () => {
      try {
        const data = await progressApi.getMeasurements();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setMeasurements(data);
        }
      } catch {
        // Offline or demo fallback
      }
    };
    if (user?.id) {
      fetchMeasurements();
    }
    return () => { isMounted = false; };
  }, [user?.id]);

  const handleAddMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    const newM: ProgressMeasurement = {
      id: `m-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      weightKg: newWeight,
      waistCm: newWaist,
      chestCm: newChest,
      hipCm: newHip,
      notes: newNotes,
    };
    setMeasurements((prev) => [newM, ...prev]);

    // Persist to backend database asynchronously
    progressApi.logMeasurement(newM).then((saved) => {
      if (saved && saved.id) {
        setMeasurements((prev) => prev.map((m) => m.id === newM.id ? { ...m, id: saved.id } : m));
      }
    }).catch((err) => {
      console.warn('Backend unavailable, measurement saved locally:', err);
    });

    setIsMeasureModalOpen(false);
  };

  const handleSimulatePhotoUpload = () => {
    const newP: ProgressPhoto = {
      id: `p-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=60',
      label: 'Latest Progress Capture',
      notes: 'Captured in morning light with verified privacy consent.',
    };
    setPhotos((prev) => [newP, ...prev]);
    setIsPhotoModalOpen(false);
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const photoA = photos.find((p) => p.id === compareLeft);
  const photoB = photos.find((p) => p.id === compareRight);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            Progress & Transformation Photos
            <LineChart className="w-6 h-6 text-emerald-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track body circumference metrics and private side-by-side visual comparisons.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {photos.length >= 2 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsCompareModalOpen(true)}
              icon={<Columns className="w-4 h-4 text-lime-400" />}
            >
              Side-by-Side Compare
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsMeasureModalOpen(true)}
            icon={<Plus className="w-4 h-4 text-emerald-400" />}
          >
            Log Measurements
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsPhotoModalOpen(true)}
            icon={<Camera className="w-4 h-4" />}
            className="font-bold"
          >
            Add Progress Photo
          </Button>
        </div>
      </div>

      {/* Body Measurements Log Table */}
      <div className="rounded-3xl bg-dark-900 border border-slate-800 p-6">
        <h2 className="text-base font-bold text-white mb-2">Recorded Circumference Measurements</h2>
        <p className="text-xs text-slate-400 mb-4">Waist, Chest, and Hip trends in centimetres (cm)</p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-dark-950 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Date</th>
                <th className="py-3 px-4">Weight (kg)</th>
                <th className="py-3 px-4">Waist (cm)</th>
                <th className="py-3 px-4">Chest (cm)</th>
                <th className="py-3 px-4">Hips (cm)</th>
                <th className="py-3 px-4 rounded-r-xl">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {measurements.map((m) => (
                <tr key={m.id} className="hover:bg-dark-950/40 transition">
                  <td className="py-3 px-4 font-bold text-white">{m.date}</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">{m.weightKg} kg</td>
                  <td className="py-3 px-4 text-slate-300">{m.waistCm || '—'} cm</td>
                  <td className="py-3 px-4 text-slate-300">{m.chestCm || '—'} cm</td>
                  <td className="py-3 px-4 text-slate-300">{m.hipCm || '—'} cm</td>
                  <td className="py-3 px-4 text-slate-400 italic">{m.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Progress Photos Timeline */}
      <div className="rounded-3xl bg-dark-900 border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white">Private Transformation Photo Timeline</h2>
            <p className="text-xs text-slate-400">Strictly encrypted and isolated to your account only</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Private Vault
          </span>
        </div>

        {photos.length === 0 ? (
          <EmptyState
            icon={<Camera className="w-6 h-6" />}
            title="No progress photos recorded yet"
            description="Take regular photos under consistent lighting to document your physical transformation."
            actionText="Upload First Photo"
            onAction={() => setIsPhotoModalOpen(true)}
            actionIcon={<Plus className="w-4 h-4" />}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl bg-dark-950 border border-slate-800 overflow-hidden group hover:border-slate-700 transition"
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={p.imageUrl}
                    alt={p.label}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-dark-950/80 backdrop-blur-md text-[11px] font-bold text-white border border-slate-700">
                    {p.date}
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-white">{p.label}</h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">{p.notes}</p>
                  </div>
                  <button
                    onClick={() => handleDeletePhoto(p.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    title="Delete photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Measurements Modal */}
      <Modal
        isOpen={isMeasureModalOpen}
        onClose={() => setIsMeasureModalOpen(false)}
        title="Log Circumference Measurements"
        subtitle="Consistent tape measurements help detect fat loss even when the scale fluctuates."
        maxWidth="md"
      >
        <form onSubmit={handleAddMeasurement} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={newWeight}
                onChange={(e) => setNewWeight(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-xs text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Waist (cm)</label>
              <input
                type="number"
                step="0.5"
                value={newWaist}
                onChange={(e) => setNewWaist(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Chest (cm)</label>
              <input
                type="number"
                step="0.5"
                value={newChest}
                onChange={(e) => setNewChest(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hips (cm)</label>
              <input
                type="number"
                step="0.5"
                value={newHip}
                onChange={(e) => setNewHip(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Progress Notes</label>
            <input
              type="text"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="e.g. Belt notch tightened, felt energetic in gym"
              className="w-full px-3.5 py-2 rounded-xl bg-dark-950 border border-slate-800 text-xs text-white"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setIsMeasureModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="flex-1 font-bold">
              Save Measurements
            </Button>
          </div>
        </form>
      </Modal>

      {/* Progress Photo Upload Modal */}
      <Modal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        title="Upload Progress Photo"
        subtitle="Photos are stored in private storage with authenticated access controls."
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div className="p-8 border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl flex flex-col items-center justify-center text-center bg-dark-950 cursor-pointer transition">
            <Camera className="w-10 h-10 text-slate-500 mb-3" />
            <p className="font-bold text-white mb-1">Drag and drop photo here, or click to browse</p>
            <p className="text-slate-500 text-[11px]">Supports PNG, JPG, WEBP up to 5MB</p>
          </div>

          <div className="p-3 rounded-xl bg-dark-950 border border-slate-800 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 inline mr-1.5" />
            FITVERSE strictly respects your privacy. Photos are never shared or made public.
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsPhotoModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSimulatePhotoUpload} className="flex-1 font-bold">
              Confirm & Save Photo
            </Button>
          </div>
        </div>
      </Modal>

      {/* Side-by-Side Comparison Modal */}
      {isCompareModalOpen && (
        <Modal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          title="Side-by-Side Physique Comparison"
          subtitle="Compare transformation checkpoints side-by-side to review visual muscularity and posture."
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Photo A */}
              <div className="space-y-2">
                <select
                  value={compareLeft}
                  onChange={(e) => setCompareLeft(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-xs text-white"
                >
                  {photos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label} ({p.date})
                    </option>
                  ))}
                </select>
                <div className="h-80 rounded-2xl overflow-hidden border border-slate-800 bg-dark-950">
                  {photoA && (
                    <img src={photoA.imageUrl} alt="Left Compare" className="w-full h-full object-cover" />
                  )}
                </div>
              </div>

              {/* Photo B */}
              <div className="space-y-2">
                <select
                  value={compareRight}
                  onChange={(e) => setCompareRight(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-xs text-white"
                >
                  {photos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label} ({p.date})
                    </option>
                  ))}
                </select>
                <div className="h-80 rounded-2xl overflow-hidden border border-slate-800 bg-dark-950">
                  {photoB && (
                    <img src={photoB.imageUrl} alt="Right Compare" className="w-full h-full object-cover" />
                  )}
                </div>
              </div>
            </div>

            <Button variant="secondary" onClick={() => setIsCompareModalOpen(false)} className="w-full">
              Close Comparison
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
