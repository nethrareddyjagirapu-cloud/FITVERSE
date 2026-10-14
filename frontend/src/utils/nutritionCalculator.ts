import { FoodItem, ServingOption, LoggedMealItem, NutritionTotals } from '../types';

/**
 * Rounds a number to exactly 1 decimal place.
 */
export function roundToOneDecimal(val: number): number {
  return Math.round(val * 10) / 10;
}

/**
 * Calculates a single nutrient from grams using the exact 100g reference formula:
 * calculated_nutrient = (nutrient_per_100g * grams) / 100
 */
export function calculateNutrient(nutrientPer100g: number, grams: number): number {
  if (grams <= 0 || nutrientPer100g <= 0) return 0;
  return roundToOneDecimal((nutrientPer100g * grams) / 100);
}

/**
 * Calculates integer calories:
 * calories = Math.round((calories_per_100g * grams) / 100)
 */
export function calculateCalories(caloriesPer100g: number, grams: number): number {
  if (grams <= 0 || caloriesPer100g <= 0) return 0;
  return Math.round((caloriesPer100g * grams) / 100);
}

/**
 * Computes total grams for a chosen serving size and quantity.
 * e.g., 2 medium rotis (35g each) -> 70g
 */
export function calculateTotalGrams(servingGrams: number, quantity: number): number {
  if (servingGrams <= 0 || quantity <= 0) return 0;
  return roundToOneDecimal(servingGrams * quantity);
}

/**
 * Computes complete macronutrient and calorie snapshot for a food item.
 */
export function calculateFoodSnapshot(
  food: FoodItem,
  servingOption: ServingOption,
  quantity: number
): {
  totalGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
} {
  const totalGrams = calculateTotalGrams(servingOption.grams, quantity);
  return {
    totalGrams,
    calories: calculateCalories(food.caloriesPer100g, totalGrams),
    protein: calculateNutrient(food.proteinPer100g, totalGrams),
    carbs: calculateNutrient(food.carbsPer100g, totalGrams),
    fat: calculateNutrient(food.fatPer100g, totalGrams),
    fibre: calculateNutrient(food.fibrePer100g, totalGrams),
  };
}

/**
 * Computes daily totals from an array of logged meal items.
 */
export function calculateDailyTotals(items: LoggedMealItem[]): NutritionTotals {
  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;
  let fibre = 0;

  for (const item of items) {
    calories += item.calories;
    protein += item.protein;
    carbs += item.carbs;
    fat += item.fat;
    fibre += item.fibre;
  }

  return {
    calories: Math.round(calories),
    protein: roundToOneDecimal(protein),
    carbs: roundToOneDecimal(carbs),
    fat: roundToOneDecimal(fat),
    fibre: roundToOneDecimal(fibre),
  };
}

/**
 * Computes remaining calories without dipping below 0.
 */
export function calculateRemainingCalories(target: number, consumed: number): number {
  return Math.max(0, target - consumed);
}

/**
 * Calculates progress percentage safely between 0% and 100%+.
 */
export function calculatePercentage(current: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

/**
 * Forgiving search engine that matches names, alternate spellings, and Indian food terms.
 */
export function searchFoods(query: string, foods: FoodItem[]): FoodItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return foods;

  // Common Indian transliteration mapping
  const aliasMap: Record<string, string[]> = {
    roti: ['chapati', 'phulka', 'fulka', 'rotli', 'bread'],
    chapati: ['roti', 'phulka', 'fulka', 'wheat'],
    dal: ['dhal', 'daal', 'toor', 'moong', 'lentil'],
    daal: ['dal', 'dhal', 'lentil'],
    chawal: ['rice', 'bhat', 'steamed rice'],
    rice: ['chawal', 'bhat'],
    dosa: ['dosai', 'dhosa'],
    idli: ['idly', 'iddly'],
    anda: ['egg', 'boiled egg', 'omelette'],
    egg: ['anda', 'boiled egg', 'egg white'],
    dahi: ['curd', 'yogurt', 'chaas'],
    curd: ['dahi', 'yogurt'],
    panir: ['paneer', 'cottage cheese'],
    paneer: ['panir', 'cottage cheese'],
    chhole: ['chole', 'chana', 'chickpeas'],
    chole: ['chana', 'chhole', 'chickpeas'],
    rajmah: ['rajma', 'kidney beans'],
    rajma: ['rajmah', 'kidney beans'],
  };

  const expandedTerms = [q, ...(aliasMap[q] || [])];

  return foods.filter((f) => {
    const fName = f.name.toLowerCase();
    const fCategory = f.category.toLowerCase();
    const fHindi = f.hindiName ? f.hindiName.toLowerCase() : '';
    const fAlts = (f.alternateNames || []).map((a) => a.toLowerCase());

    return expandedTerms.some((term) => {
      return (
        fName.includes(term) ||
        fCategory.includes(term) ||
        fHindi.includes(term) ||
        fAlts.some((alt) => alt.includes(term))
      );
    });
  });
}
