import test from 'node:test';
import assert from 'node:assert/strict';

// Test pure math formulas
function roundToOneDecimal(val) {
  return Math.round(val * 10) / 10;
}

function calculateNutrient(nutrientPer100g, grams) {
  if (grams <= 0 || nutrientPer100g <= 0) return 0;
  return roundToOneDecimal((nutrientPer100g * grams) / 100);
}

function calculateCalories(caloriesPer100g, grams) {
  if (grams <= 0 || caloriesPer100g <= 0) return 0;
  return Math.round((caloriesPer100g * grams) / 100);
}

function calculateTotalGrams(servingGrams, quantity) {
  if (servingGrams <= 0 || quantity <= 0) return 0;
  return roundToOneDecimal(servingGrams * quantity);
}

function calculateDailyTotals(items) {
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

function calculateRemainingCalories(target, consumed) {
  return Math.max(0, target - consumed);
}

test('1. calculateNutrient correctly applies (nutrient_per_100g * grams) / 100', () => {
  // 9.0g protein per 100g in roti. For 70g (2 rotis): 9.0 * 70 / 100 = 6.3g
  assert.equal(calculateNutrient(9.0, 70), 6.3);

  // 52.0g protein per 100g in soya chunks. For 50g: 52 * 50 / 100 = 26.0g
  assert.equal(calculateNutrient(52.0, 50), 26.0);

  // Edge cases: 0 grams or 0 nutrient
  assert.equal(calculateNutrient(0, 100), 0);
  assert.equal(calculateNutrient(20, 0), 0);
});

test('2. calculateCalories correctly computes integer calories', () => {
  // 297 kcal per 100g in roti. For 70g: 297 * 70 / 100 = 207.9 -> 208 kcal
  assert.equal(calculateCalories(297, 70), 208);

  // 105 kcal per 100g in dal. For 150g: 105 * 150 / 100 = 157.5 -> 158 kcal
  assert.equal(calculateCalories(105, 150), 158);

  // 155 kcal per 100g in whole egg. For 100g (2 eggs): 155 kcal
  assert.equal(calculateCalories(155, 100), 155);
});

test('3. Serving-size conversions: count * servingGrams', () => {
  // 2 medium rotis at 35g each
  assert.equal(calculateTotalGrams(35, 2), 70);

  // 3 idlis at 50g each
  assert.equal(calculateTotalGrams(50, 3), 150);

  // 1 bowl of dal at 150g
  assert.equal(calculateTotalGrams(150, 1), 150);
});

test('4. Adding food and calculating daily totals', () => {
  const mealItems = [
    {
      id: 'item-1',
      foodName: 'Roti (Whole Wheat)',
      calories: 208,
      protein: 6.3,
      carbs: 39.2,
      fat: 2.5,
      fibre: 6.7,
    },
    {
      id: 'item-2',
      foodName: 'Dal Tadka',
      calories: 158,
      protein: 10.5,
      carbs: 22.5,
      fat: 2.3,
      fibre: 6.0,
    },
  ];

  const totals = calculateDailyTotals(mealItems);
  assert.equal(totals.calories, 366);
  assert.equal(totals.protein, 16.8);
  assert.equal(totals.carbs, 61.7);
  assert.equal(totals.fat, 4.8);
  assert.equal(totals.fibre, 12.7);
});

test('5. Editing quantity updates calories and nutrients proportionally', () => {
  // Starting with 2 rotis (70g)
  const twoRotis = {
    calories: calculateCalories(297, calculateTotalGrams(35, 2)),
    protein: calculateNutrient(9.0, calculateTotalGrams(35, 2)),
  };
  assert.equal(twoRotis.calories, 208);
  assert.equal(twoRotis.protein, 6.3);

  // User edits quantity to 3 rotis (105g)
  const threeRotis = {
    calories: calculateCalories(297, calculateTotalGrams(35, 3)),
    protein: calculateNutrient(9.0, calculateTotalGrams(35, 3)),
  };
  assert.equal(threeRotis.calories, 312);
  assert.equal(threeRotis.protein, 9.5);
});

test('6. Deleting a food item immediately deducts from daily totals', () => {
  let items = [
    { id: '1', calories: 208, protein: 6.3, carbs: 39.2, fat: 2.5, fibre: 6.7 },
    { id: '2', calories: 158, protein: 10.5, carbs: 22.5, fat: 2.3, fibre: 6.0 },
    { id: '3', calories: 155, protein: 13.0, carbs: 1.1, fat: 11.0, fibre: 0.0 },
  ];

  let initialTotals = calculateDailyTotals(items);
  assert.equal(initialTotals.calories, 521);

  // User deletes item 3 (Egg)
  items = items.filter((i) => i.id !== '3');
  let updatedTotals = calculateDailyTotals(items);
  assert.equal(updatedTotals.calories, 366);
  assert.equal(updatedTotals.protein, 16.8);
});

test('7. calculateRemainingCalories respects target and never dips below 0', () => {
  // 2200 target, 1500 consumed -> 700 remaining
  assert.equal(calculateRemainingCalories(2200, 1500), 700);

  // 2200 target, 2400 consumed -> 0 remaining (not -200)
  assert.equal(calculateRemainingCalories(2200, 2400), 0);
});
