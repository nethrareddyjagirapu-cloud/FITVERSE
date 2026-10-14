import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FoodItem, MealCategory, LoggedMealItem, ServingOption, NutritionTotals } from '../types';
import { INDIAN_FOOD_DATABASE, POPULAR_FOOD_IDS } from '../data/foodDatabase';
import { nutritionApi } from '../services/api';
import {
  calculateFoodSnapshot,
  calculateDailyTotals,
  calculateRemainingCalories,
  calculatePercentage,
  searchFoods,
} from '../utils/nutritionCalculator';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import {
  UtensilsCrossed,
  Search,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Sparkles,
  Flame,
  Info,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const NutritionTrackerPage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  // Selected viewing date in YYYY-MM-DD
  const getTodayDateString = () => new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());

  // User's adjustable daily calorie target (defaults from user profile or 2200)
  const [calorieTarget, setCalorieTarget] = useState<number>(
    user?.profile?.targetDailyCalories || 2200
  );
  const [isEditTargetModalOpen, setIsEditTargetModalOpen] = useState(false);
  const [tempTargetInput, setTempTargetInput] = useState<string>(String(calorieTarget));

  // All logged items stored in localStorage per user
  const [allLoggedItems, setAllLoggedItems] = useState<LoggedMealItem[]>(() => {
    const saved = localStorage.getItem(`fitverse_nutrition_items_${user?.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Recently chosen food IDs
  const [recentFoodIds, setRecentFoodIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(`fitverse_recent_foods_${user?.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeMealCategory, setActiveMealCategory] = useState<MealCategory>('BREAKFAST');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isCustomFoodModalOpen, setIsCustomFoodModalOpen] = useState(false);

  // Add/Edit Form State
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [selectedFood, setSelectedFood] = useState<FoodItem>(INDIAN_FOOD_DATABASE[0]);
  const [selectedServing, setSelectedServing] = useState<ServingOption>(
    INDIAN_FOOD_DATABASE[0].servingOptions[0]
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [customGramInput, setCustomGramInput] = useState<number>(100);

  // New Custom Food Form State
  const [customFoodName, setCustomFoodName] = useState('');
  const [customCalories, setCustomCalories] = useState<number>(150);
  const [customProtein, setCustomProtein] = useState<number>(10);
  const [customCarbs, setCustomCarbs] = useState<number>(20);
  const [customFat, setCustomFat] = useState<number>(3);
  const [customFibre, setCustomFibre] = useState<number>(2);

  // Sync logged items to localStorage whenever they change
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`fitverse_nutrition_items_${user.id}`, JSON.stringify(allLoggedItems));

      // Sync today's meals to dashboard summary
      const todayString = getTodayDateString();
      const todayItems = allLoggedItems.filter((i) => i.date === todayString);
      const dashboardFormat = todayItems.map((item) => ({
        id: item.id,
        name: item.foodName,
        meal: item.mealCategory.toLowerCase(),
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
        fibre: item.fibre,
      }));
      localStorage.setItem(`fitverse_meals_${user.id}`, JSON.stringify(dashboardFormat));
    }
  }, [allLoggedItems, user?.id]);

  // Sync recent foods
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`fitverse_recent_foods_${user.id}`, JSON.stringify(recentFoodIds));
    }
  }, [recentFoodIds, user?.id]);

  // Load daily meals from backend API, fallback to localStorage
  useEffect(() => {
    let isMounted = true;
    const fetchDaily = async () => {
      try {
        const summary = await nutritionApi.getDaily(selectedDate);
        if (isMounted && summary && Array.isArray(summary.items)) {
          setAllLoggedItems((prev) => {
            const otherDates = prev.filter((i) => i.date !== selectedDate);
            return [...summary.items, ...otherDates];
          });
          if (summary.calorieTarget) {
            setCalorieTarget(summary.calorieTarget);
          }
        }
      } catch {
        // Offline or backend unavailable, continue with local items
      }
    };
    if (user?.id) {
      fetchDaily();
    }
    return () => { isMounted = false; };
  }, [selectedDate, user?.id]);

  // Filter items for the selected viewing date
  const dateLoggedItems = allLoggedItems.filter((i) => i.date === selectedDate);
  const dailyTotals: NutritionTotals = calculateDailyTotals(dateLoggedItems);
  const caloriesRemaining = calculateRemainingCalories(calorieTarget, dailyTotals.calories);
  const caloriePercent = calculatePercentage(dailyTotals.calories, calorieTarget);

  // Target macros (estimated based on calorie target)
  const targetProtein = user?.profile?.targetDailyProtein || 140;
  const targetCarbs = user?.profile?.targetDailyCarbs || 250;
  const targetFat = user?.profile?.targetDailyFat || 65;
  const targetFibre = user?.profile?.targetDailyFibre || 35;

  // Open Add Food modal for a specific meal
  const handleOpenAddFood = (meal: MealCategory) => {
    setEditingItemId(null);
    setActiveMealCategory(meal);
    setSearchQuery('');
    setSelectedCategoryFilter('ALL');
    const defaultFood = INDIAN_FOOD_DATABASE[0];
    setSelectedFood(defaultFood);
    setSelectedServing(defaultFood.servingOptions[0]);
    setQuantity(defaultFood.id === 'food-roti' ? 2 : 1);
    setIsAddModalOpen(true);
  };

  // Open Edit Food modal for an existing logged item
  const handleOpenEditItem = (item: LoggedMealItem) => {
    setEditingItemId(item.id);
    setActiveMealCategory(item.mealCategory);

    const foundFood = INDIAN_FOOD_DATABASE.find((f) => f.id === item.foodId);
    if (foundFood) {
      setSelectedFood(foundFood);
      const foundServing = foundFood.servingOptions.find((s) => s.id === item.servingOptionId);
      if (foundServing) {
        setSelectedServing(foundServing);
        if (foundServing.isGramBased) {
          setCustomGramInput(item.totalGrams);
          setQuantity(item.totalGrams);
        } else {
          setQuantity(item.quantity);
        }
      } else {
        setSelectedServing(foundFood.servingOptions[0]);
        setQuantity(item.quantity);
      }
    }
    setIsAddModalOpen(true);
  };

  // When user picks a food item in the modal
  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    const defaultServing = food.servingOptions[0];
    setSelectedServing(defaultServing);
    setQuantity(food.id === 'food-roti' ? 2 : 1);
  };

  // When user changes the serving size dropdown
  const handleServingChange = (servingId: string) => {
    const s = selectedFood.servingOptions.find((opt) => opt.id === servingId);
    if (s) {
      setSelectedServing(s);
      if (s.isGramBased) {
        setCustomGramInput(100);
        setQuantity(100);
      } else {
        setQuantity(1);
      }
    }
  };

  // Live computed snapshot of currently selected food in modal
  const effectiveGrams = selectedServing.isGramBased
    ? customGramInput
    : selectedServing.grams * quantity;

  const currentSnapshot = calculateFoodSnapshot(
    selectedFood,
    selectedServing.isGramBased ? { ...selectedServing, grams: customGramInput } : selectedServing,
    selectedServing.isGramBased ? 1 : quantity
  );

  // Confirm Add or Update Food
  const handleSaveMealItem = () => {
    const finalQuantity = selectedServing.isGramBased ? customGramInput : quantity;
    if (finalQuantity <= 0) return;

    const servingLabel = selectedServing.isGramBased
      ? `${customGramInput}g`
      : `${quantity} × ${selectedServing.label}`;

    if (editingItemId) {
      // Update existing item
      setAllLoggedItems((prev) =>
        prev.map((item) => {
          if (item.id === editingItemId) {
            return {
              ...item,
              foodId: selectedFood.id,
              foodName: selectedFood.name,
              servingOptionId: selectedServing.id,
              servingLabel,
              quantity: finalQuantity,
              totalGrams: currentSnapshot.totalGrams,
              calories: currentSnapshot.calories,
              protein: currentSnapshot.protein,
              carbs: currentSnapshot.carbs,
              fat: currentSnapshot.fat,
              fibre: currentSnapshot.fibre,
            };
          }
          return item;
        })
      );
    } else {
      // Add new item
      const newItem: LoggedMealItem = {
        id: `meal-log-${Date.now()}`,
        foodId: selectedFood.id,
        foodName: selectedFood.name,
        mealCategory: activeMealCategory,
        date: selectedDate,
        servingOptionId: selectedServing.id,
        servingLabel,
        quantity: finalQuantity,
        totalGrams: currentSnapshot.totalGrams,
        calories: currentSnapshot.calories,
        protein: currentSnapshot.protein,
        carbs: currentSnapshot.carbs,
        fat: currentSnapshot.fat,
        fibre: currentSnapshot.fibre,
        loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setAllLoggedItems((prev) => [newItem, ...prev]);

      // Persist to backend database asynchronously
      nutritionApi.logMeal(newItem).then((saved) => {
        if (saved && saved.id) {
          setAllLoggedItems((prev) => prev.map((item) => item.id === newItem.id ? { ...item, id: saved.id } : item));
        }
      }).catch((err) => {
        console.warn('Backend unavailable, meal saved locally:', err);
      });

      // Add to recently used list
      setRecentFoodIds((prev) => [
        selectedFood.id,
        ...prev.filter((id) => id !== selectedFood.id),
      ].slice(0, 8));
    }

    setIsAddModalOpen(false);
  };

  // Delete logged item
  const handleDeleteItem = (id: string) => {
    setAllLoggedItems((prev) => prev.filter((i) => i.id !== id));
    nutritionApi.deleteMeal(id).catch((err) => {
      console.warn('Backend deletion failed or offline:', err);
    });
  };

  // Save updated calorie target
  const handleSaveCalorieTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(tempTargetInput, 10);
    if (!isNaN(val) && val >= 1200 && val <= 5000) {
      setCalorieTarget(val);
      updateProfile({ targetDailyCalories: val });
      setIsEditTargetModalOpen(false);
    }
  };

  // Create custom food
  const handleCreateCustomFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFoodName.trim()) return;

    const newFood: FoodItem = {
      id: `custom-food-${Date.now()}`,
      name: customFoodName.trim(),
      category: 'My Custom Foods',
      caloriesPer100g: customCalories,
      proteinPer100g: customProtein,
      carbsPer100g: customCarbs,
      fatPer100g: customFat,
      fibrePer100g: customFibre,
      isVerified: false,
      description: 'Custom food created by you.',
      servingOptions: [
        { id: `srv-custom-1`, label: '1 Standard Serving (100g)', grams: 100, unitName: 'serving' },
        { id: `srv-custom-g`, label: 'Grams (g)', grams: 1, unitName: 'g', isGramBased: true },
      ],
    };

    INDIAN_FOOD_DATABASE.unshift(newFood);
    setSelectedFood(newFood);
    setSelectedServing(newFood.servingOptions[0]);
    setQuantity(1);
    setIsCustomFoodModalOpen(false);
  };

  // Search results
  const searchResults = searchFoods(searchQuery, INDIAN_FOOD_DATABASE);

  // Meal sections list
  const mealSections: {
    key: MealCategory;
    title: string;
    icon: string;
    timeHint: string;
    emptyText: string;
  }[] = [
    {
      key: 'BREAKFAST',
      title: 'Breakfast',
      icon: '☀️',
      timeHint: 'Morning (e.g. Idli, Poha, Eggs, Oats, Roti)',
      emptyText: 'No breakfast recorded yet. What did you eat this morning?',
    },
    {
      key: 'LUNCH',
      title: 'Lunch',
      icon: '🥗',
      timeHint: 'Afternoon (e.g. Rice, Dal, Roti, Sabzi, Paneer)',
      emptyText: 'No lunch recorded yet. Add your afternoon meal here.',
    },
    {
      key: 'SNACKS',
      title: 'Snacks',
      icon: '🍎',
      timeHint: 'Evening (e.g. Curd, Banana, Nuts, Chaas)',
      emptyText: 'No snacks recorded yet. Did you have any tea-time fruit or nuts?',
    },
    {
      key: 'DINNER',
      title: 'Dinner',
      icon: '🍲',
      timeHint: 'Night (e.g. Dal, Roti, Salad, Chicken, Khichdi)',
      emptyText: 'No dinner recorded yet. Record your evening meal before bed.',
    },
  ];

  // Date navigation helpers
  const handlePreviousDay = () => {
    const cur = new Date(selectedDate);
    cur.setDate(cur.getDate() - 1);
    setSelectedDate(cur.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const cur = new Date(selectedDate);
    cur.setDate(cur.getDate() + 1);
    setSelectedDate(cur.toISOString().split('T')[0]);
  };

  const isToday = selectedDate === getTodayDateString();

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* 1. Header & Friendly Date Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-dark-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Daily Nutrition Tracker
            </h1>
            <span className="text-2xl">🍛</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Easy meal logging with Indian food portions. Add what you ate to see calories and nutrients update instantly.
          </p>
        </div>

        {/* Date Selector Buttons */}
        <div className="flex items-center gap-2 bg-dark-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={handlePreviousDay}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-900 transition"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSelectedDate(getTodayDateString())}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              isToday ? 'bg-emerald-500 text-dark-950 shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            Today
          </button>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-300 px-2 py-1 rounded-lg border border-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
          />

          <button
            onClick={handleNextDay}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-900 transition"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Top Summary Card: Calories & Easy Nutrient Progress */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-dark-900 via-dark-850 to-dark-900 border border-slate-800 shadow-xl">
        {/* Calories Bar & Targets */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {isToday ? "Today's Energy Balance" : `Meals on ${selectedDate}`}
              </span>
              <button
                onClick={() => setIsHelpModalOpen(true)}
                className="text-slate-400 hover:text-emerald-400 text-xs inline-flex items-center gap-1 transition"
                title="Explain nutrients"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span className="text-[11px] underline">What do these mean?</span>
              </button>
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl sm:text-4xl font-black text-white">
                {dailyTotals.calories}
              </span>
              <span className="text-sm font-semibold text-slate-400">
                / {calorieTarget} kcal
              </span>
              <button
                onClick={() => {
                  setTempTargetInput(String(calorieTarget));
                  setIsEditTargetModalOpen(true);
                }}
                className="ml-2 text-xs text-emerald-400 hover:underline font-bold"
              >
                Change Target
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-1">
              {caloriesRemaining > 0 ? (
                <span className="text-emerald-400 font-bold">
                  {caloriesRemaining} kcal remaining today
                </span>
              ) : dailyTotals.calories > 0 ? (
                <span className="text-amber-400 font-bold">
                  Target reached ({dailyTotals.calories - calorieTarget} kcal over)
                </span>
              ) : (
                'No meals logged yet. Record your food to track calories.'
              )}
            </p>
          </div>

          <div className="sm:text-right">
            <span className="text-xs text-slate-400 block">Goal Completion</span>
            <span className="text-2xl font-black text-white">{caloriePercent}%</span>
          </div>
        </div>

        {/* Calorie Progress Line */}
        <div className="w-full h-3 bg-dark-950 rounded-full my-4 overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-all duration-500"
            style={{ width: `${Math.min(caloriePercent, 100)}%` }}
          />
        </div>

        {/* 4 Nutrient Pills in Everyday English */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {/* Protein */}
          <div className="p-3.5 rounded-2xl bg-dark-950/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-white flex items-center gap-1">
                <span>🥩</span> Protein
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">
                {calculatePercentage(dailyTotals.protein, targetProtein)}%
              </span>
            </div>
            <div className="text-lg font-black text-emerald-400">
              {dailyTotals.protein}g{' '}
              <span className="text-xs font-normal text-slate-400">/ {targetProtein}g</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Builds & repairs muscle</p>
          </div>

          {/* Carbs */}
          <div className="p-3.5 rounded-2xl bg-dark-950/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-white flex items-center gap-1">
                <span>⚡</span> Carbs
              </span>
              <span className="text-[10px] text-sky-400 font-bold">
                {calculatePercentage(dailyTotals.carbs, targetCarbs)}%
              </span>
            </div>
            <div className="text-lg font-black text-sky-400">
              {dailyTotals.carbs}g{' '}
              <span className="text-xs font-normal text-slate-400">/ {targetCarbs}g</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Energy for study & workout</p>
          </div>

          {/* Fats */}
          <div className="p-3.5 rounded-2xl bg-dark-950/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-white flex items-center gap-1">
                <span>🥑</span> Healthy Fats
              </span>
              <span className="text-[10px] text-amber-400 font-bold">
                {calculatePercentage(dailyTotals.fat, targetFat)}%
              </span>
            </div>
            <div className="text-lg font-black text-amber-400">
              {dailyTotals.fat}g{' '}
              <span className="text-xs font-normal text-slate-400">/ {targetFat}g</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Brain & hormone support</p>
          </div>

          {/* Fibre */}
          <div className="p-3.5 rounded-2xl bg-dark-950/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-white flex items-center gap-1">
                <span>🌾</span> Dietary Fibre
              </span>
              <span className="text-[10px] text-lime-400 font-bold">
                {calculatePercentage(dailyTotals.fibre, targetFibre)}%
              </span>
            </div>
            <div className="text-lg font-black text-lime-400">
              {dailyTotals.fibre}g{' '}
              <span className="text-xs font-normal text-slate-400">/ {targetFibre}g</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Smooth gut & digestion</p>
          </div>
        </div>
      </div>

      {/* 3. The 4 Meal Sections (Breakfast, Lunch, Snacks, Dinner) */}
      <div className="space-y-5">
        {mealSections.map((sec) => {
          const items = dateLoggedItems.filter((i) => i.mealCategory === sec.key);
          const mealCalories = items.reduce((acc, i) => acc + i.calories, 0);
          const mealProtein = items.reduce((acc, i) => acc + i.protein, 0);

          return (
            <div
              key={sec.key}
              className="p-5 sm:p-6 rounded-3xl bg-dark-900 border border-slate-800 transition hover:border-slate-750"
            >
              {/* Meal Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{sec.icon}</span>
                    <h2 className="text-lg font-black text-white tracking-wide">
                      {sec.title}
                    </h2>
                    {items.length > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-md bg-dark-950 text-slate-300 font-semibold border border-slate-800">
                        {items.length} {items.length === 1 ? 'item' : 'items'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {items.length > 0 ? (
                      <>
                        Subtotal: <strong className="text-white">{mealCalories} kcal</strong> •{' '}
                        <strong className="text-emerald-400">{mealProtein.toFixed(1)}g Protein</strong>
                      </>
                    ) : (
                      sec.timeHint
                    )}
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleOpenAddFood(sec.key)}
                  icon={<Plus className="w-4 h-4" />}
                  className="font-bold w-full sm:w-auto"
                >
                  + Add Food to {sec.title}
                </Button>
              </div>

              {/* Logged Food Cards or Friendly Empty State */}
              {items.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 flex flex-col items-center justify-center">
                  <p className="max-w-md">{sec.emptyText}</p>
                  <button
                    onClick={() => handleOpenAddFood(sec.key)}
                    className="mt-2 text-xs font-bold text-emerald-400 hover:underline"
                  >
                    Click to log your first food
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-800/60 mt-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-dark-950/40 px-3 rounded-2xl transition"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-sm">{item.foodName}</h3>
                          <span className="text-xs text-slate-400 font-medium">
                            • {item.servingLabel}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs mt-0.5">
                          {item.totalGrams}g total weight • Logged at {item.loggedAt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-5">
                        <div className="text-left sm:text-right">
                          <span className="text-sm font-black text-white block">
                            {item.calories} kcal
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            <strong className="text-emerald-400 font-semibold">{item.protein}g P</strong> •{' '}
                            {item.carbs}g C • {item.fat}g F
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditItem(item)}
                            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-800 transition"
                            title="Edit quantity"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                            title="Delete food item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Add Food Modal: Simple, Forgiving Search & Familiar Serving Sizes */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingItemId ? `Edit Food Quantity` : `Add Food to ${activeMealCategory}`}
        subtitle="Search any Indian dish or pick from common staples. Serving sizes are in everyday units like rotis, katoris, and cups."
        maxWidth="xl"
      >
        <div className="space-y-4">
          {/* Step A: Search Bar (Forgiving with alternate names) */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name: roti, chapati, dal, rice, idli, egg, paneer, poha..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              autoFocus={!editingItemId}
            />
          </div>

          {/* Quick Popular Staples Chips */}
          {!searchQuery && (
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1.5 uppercase">
                Quick Popular Foods:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_FOOD_IDS.map((fid) => {
                  const food = INDIAN_FOOD_DATABASE.find((f) => f.id === fid);
                  if (!food) return null;
                  const isSelected = selectedFood.id === food.id;
                  return (
                    <button
                      key={food.id}
                      type="button"
                      onClick={() => handleSelectFood(food)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                        isSelected
                          ? 'bg-emerald-500 text-dark-950 font-bold border-emerald-500'
                          : 'bg-dark-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {food.name.split(' (')[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step B: Filtered Food List */}
          <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1 border-t border-b border-slate-800/80 py-2">
            {searchResults.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 bg-dark-950 rounded-xl">
                <p>No food found matching "{searchQuery}".</p>
                <button
                  type="button"
                  onClick={() => {
                    setCustomFoodName(searchQuery);
                    setIsCustomFoodModalOpen(true);
                  }}
                  className="mt-2 text-emerald-400 hover:underline font-bold inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add "{searchQuery}" as a custom food
                </button>
              </div>
            ) : (
              searchResults.map((f) => {
                const isSelected = selectedFood.id === f.id;
                return (
                  <div
                    key={f.id}
                    onClick={() => handleSelectFood(f)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 text-white'
                        : 'bg-dark-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-sm">{f.name}</span>
                        {f.isVerified && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                            Verified
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400 text-xs">{f.category}</span>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-white">{f.caloriesPer100g} kcal</span>
                      <span className="text-[11px] text-slate-400 block">{f.proteinPer100g}g protein/100g</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Step C: Serving Size Choice & Quantity Controls */}
          <div className="p-4 rounded-2xl bg-dark-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Selected Food:</span>
                <span className="text-sm font-bold text-white">{selectedFood.name}</span>
              </div>
              <span className="text-[11px] text-slate-400 bg-dark-900 px-2 py-1 rounded-md border border-slate-800">
                {selectedFood.category}
              </span>
            </div>

            {/* Serving Size Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Choose Serving Size:
              </label>
              <select
                value={selectedServing.id}
                onChange={(e) => handleServingChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {selectedFood.servingOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity Stepper (e.g. 2 Rotis or 150g) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {selectedServing.isGramBased ? 'Enter Total Weight in Grams:' : 'How Many Servings?'}
              </label>

              {selectedServing.isGramBased ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="2000"
                    value={customGramInput}
                    onChange={(e) => setCustomGramInput(Math.max(1, Number(e.target.value)))}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-dark-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-xs font-bold text-slate-400">grams</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setCustomGramInput(50)}
                      className="px-2 py-1 bg-dark-900 border border-slate-800 text-xs text-slate-300 rounded hover:text-white"
                    >
                      50g
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomGramInput(100)}
                      className="px-2 py-1 bg-dark-900 border border-slate-800 text-xs text-slate-300 rounded hover:text-white"
                    >
                      100g
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomGramInput(150)}
                      className="px-2 py-1 bg-dark-900 border border-slate-800 text-xs text-slate-300 rounded hover:text-white"
                    >
                      150g
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-xl bg-dark-900 border border-slate-800 text-white font-bold text-base hover:bg-dark-800 transition"
                  >
                    −
                  </button>
                  <div className="flex-1 text-center font-black text-lg text-white bg-dark-900 py-2 rounded-xl border border-slate-800">
                    {quantity}
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 rounded-xl bg-dark-900 border border-slate-800 text-white font-bold text-base hover:bg-dark-800 transition"
                  >
                    +
                  </button>
                </div>
              )}
            </div>

            {/* Instant Real-Time Preview */}
            <div className="p-3.5 rounded-xl bg-dark-900 border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2">
              <span className="text-slate-400">
                Total Weight: <strong>{currentSnapshot.totalGrams}g</strong>
              </span>
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-white text-sm">
                  {currentSnapshot.calories} kcal
                </span>
                <span className="text-emerald-400 font-bold">
                  {currentSnapshot.protein}g Protein
                </span>
                <span className="text-sky-400">{currentSnapshot.carbs}g Carbs</span>
                <span className="text-amber-400">{currentSnapshot.fat}g Fat</span>
              </div>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setIsAddModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveMealItem}
              className="flex-1 font-bold"
            >
              {editingItemId ? 'Update Food' : 'Add to Meal'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* 5. Simple Nutrient Help Modal (Everyday English for 10th-Class Student) */}
      <Modal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        title="Nutrition Guide in Everyday English"
        subtitle="A quick, simple guide to understanding what your body needs every day."
        maxWidth="md"
      >
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-dark-950 border border-slate-800 space-y-1">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
              <span>🔥</span> What is a Calorie (kcal)?
            </h4>
            <p className="text-slate-400">
              A calorie is a unit of energy. Think of food as fuel for your body's engine. If you eat the right amount of calories, your body stays active and maintains a healthy weight.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-dark-950 border border-slate-800 space-y-1">
            <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
              <span>🥩</span> Protein (Muscle & Repair)
            </h4>
            <p className="text-slate-400">
              Protein builds and repairs your muscles, bones, skin, and hair. Great sources: Dal, Paneer, Eggs, Soya Chunks, Chicken, and Curd.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-dark-950 border border-slate-800 space-y-1">
            <h4 className="font-bold text-sky-400 text-sm flex items-center gap-1.5">
              <span>⚡</span> Carbohydrates (Daily Energy)
            </h4>
            <p className="text-slate-400">
              Carbohydrates give your brain and body quick, reliable energy to study, play sports, and walk. Great sources: Roti, Rice, Oats, Poha, Fruits, and Potatoes.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-dark-950 border border-slate-800 space-y-1">
            <h4 className="font-bold text-amber-400 text-sm flex items-center gap-1.5">
              <span>🥑</span> Fats (Brain & Hormone Health)
            </h4>
            <p className="text-slate-400">
              Good fats absorb vitamins (like Vitamin A & D) and protect your brain. Great sources: Almonds, Walnuts, Peanuts, Ghee in moderation, and Paneer.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-dark-950 border border-slate-800 space-y-1">
            <h4 className="font-bold text-lime-400 text-sm flex items-center gap-1.5">
              <span>🌾</span> Dietary Fibre (Smooth Digestion)
            </h4>
            <p className="text-slate-400">
              Fibre helps digest food smoothly and keeps your stomach feeling comfortably full. Great sources: Whole wheat roti, Dal, Rajma, Salad, and Fruits.
            </p>
          </div>

          <Button
            variant="primary"
            onClick={() => setIsHelpModalOpen(false)}
            className="w-full font-bold mt-2"
          >
            Got it, thanks!
          </Button>
        </div>
      </Modal>

      {/* 6. Edit Calorie Goal Modal */}
      <Modal
        isOpen={isEditTargetModalOpen}
        onClose={() => setIsEditTargetModalOpen(false)}
        title="Change Daily Calorie Target"
        subtitle="Adjust your daily target according to your activity level and fitness coach."
        maxWidth="sm"
      >
        <form onSubmit={handleSaveCalorieTarget} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Daily Target Calories (kcal)
            </label>
            <input
              type="number"
              min="1200"
              max="5000"
              value={tempTargetInput}
              onChange={(e) => setTempTargetInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 font-bold"
              required
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Standard recommendations: 1,800 – 2,400 kcal per day.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setIsEditTargetModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="flex-1 font-bold">
              Save Target
            </Button>
          </div>
        </form>
      </Modal>

      {/* 7. Create Custom Food Modal */}
      <Modal
        isOpen={isCustomFoodModalOpen}
        onClose={() => setIsCustomFoodModalOpen(false)}
        title="Add Custom Homemade Dish"
        subtitle="Enter the approximate nutrition values per 100 grams for your personal dish."
        maxWidth="md"
      >
        <form onSubmit={handleCreateCustomFood} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Dish / Food Name</label>
            <input
              type="text"
              value={customFoodName}
              onChange={(e) => setCustomFoodName(e.target.value)}
              placeholder="e.g. Mummy's Methi Thepla"
              className="w-full px-3.5 py-2 rounded-xl bg-dark-950 border border-slate-800 text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Calories / 100g</label>
              <input
                type="number"
                value={customCalories}
                onChange={(e) => setCustomCalories(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-white"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Protein (g) / 100g</label>
              <input
                type="number"
                step="0.1"
                value={customProtein}
                onChange={(e) => setCustomProtein(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-white"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Carbs (g) / 100g</label>
              <input
                type="number"
                step="0.1"
                value={customCarbs}
                onChange={(e) => setCustomCarbs(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-white"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Fat (g) / 100g</label>
              <input
                type="number"
                step="0.1"
                value={customFat}
                onChange={(e) => setCustomFat(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Fibre (g) / 100g</label>
            <input
              type="number"
              step="0.1"
              value={customFibre}
              onChange={(e) => setCustomFibre(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-white"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setIsCustomFoodModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="flex-1 font-bold">
              Save Dish
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
