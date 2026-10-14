-- ===================================================================
-- FITVERSE: V2 Seed Reference Data Migration
-- Seeds 22 verified Indian staples & standard muscle exercises
-- ===================================================================

-- 1. Foods
INSERT INTO foods (id, name, hindi_name, category, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, is_verified, description)
VALUES
('food-roti', 'Roti / Chapati (Whole Wheat)', 'रोटी / चपाती', 'Grains & Breads', 297, 9.0, 56.0, 3.5, 9.5, TRUE, 'Fresh homemade whole wheat flatbread rich in dietary fibre.'),
('food-rice-steamed', 'Steamed White Rice', 'उबले हुए चावल', 'Grains & Breads', 130, 2.7, 28.0, 0.3, 0.4, TRUE, 'Cooked white rice. Easily digestible staple carbohydrate source.'),
('food-dal-tadka', 'Dal (Yellow Moong / Toor Dal, Cooked)', 'दाल तड़का / पकी हुई दाल', 'Lentils & Dals', 105, 7.0, 15.0, 1.5, 4.0, TRUE, 'Cooked yellow lentils tempered with cumin, turmeric, and garlic.'),
('food-idli', 'Idli (Steamed Rice & Urad Dal Cake)', 'इडली', 'South Indian Dishes', 136, 4.5, 27.5, 0.8, 1.4, TRUE, 'Fermented steamed South Indian cake. Low in fat and gut-friendly.'),
('food-dosa', 'Plain Dosa (Crispy)', 'सादा डोसा', 'South Indian Dishes', 168, 3.9, 29.0, 3.8, 1.2, TRUE, 'Crisp fermented crepe made from rice and black gram batter.'),
('food-egg-boiled', 'Whole Boiled Egg', 'उबला हुआ अंडा', 'Eggs & Poultry', 155, 13.0, 1.1, 11.0, 0.0, TRUE, 'Whole boiled egg with all 9 essential amino acids.'),
('food-egg-white', 'Egg White (Boiled)', 'अंडे की सफेदी', 'Eggs & Poultry', 52, 11.0, 0.7, 0.2, 0.0, TRUE, 'Pure egg albumin with near zero fat.'),
('food-paneer', 'Paneer (Indian Cottage Cheese)', 'पनीर', 'Dairy & Paneer', 265, 18.3, 3.4, 20.8, 0.0, TRUE, 'Fresh cottage cheese high in bioavailable casein protein and calcium.'),
('food-curd', 'Curd / Plain Dahi (Whole Milk)', 'दही', 'Dairy & Paneer', 61, 3.5, 4.7, 3.3, 0.0, TRUE, 'Natural cultured milk product rich in probiotic bacteria.'),
('food-soya-chunks', 'Soya Chunks (Raw / Uncooked)', 'सोया चंक्स / नूट्रेला', 'Plant Protein', 345, 52.0, 33.0, 0.5, 13.0, TRUE, 'Defatted soy chunks containing ~52% protein.'),
('food-chicken-breast', 'Chicken Breast (Cooked, Boneless)', 'चिकन ब्रेस्ट', 'Eggs & Poultry', 165, 31.0, 0.0, 3.6, 0.0, TRUE, 'Cooked lean chicken breast with minimal fat.'),
('food-poha', 'Poha (Flattened Rice with Veggies & Peanuts)', 'पोहा', 'Breakfast Dishes', 180, 4.2, 33.0, 3.8, 2.2, TRUE, 'Light breakfast dish made with tempered flattened rice and peanuts.'),
('food-upma', 'Upma (Semolina / Rava Breakfast)', 'उपमा', 'Breakfast Dishes', 145, 3.8, 24.5, 3.5, 1.8, TRUE, 'Roasted semolina (sooji) tempered with spices.'),
('food-rajma', 'Rajma Masala (Red Kidney Beans Curry)', 'राजमा मसाला', 'Curries & Dishes', 135, 6.8, 19.5, 3.2, 5.5, TRUE, 'Red kidney beans in onion-tomato gravy with complex carbs and fibre.'),
('food-chole', 'Chole / Chana Masala (Chickpeas Curry)', 'छोले / चना मसाला', 'Curries & Dishes', 150, 7.2, 22.0, 3.8, 6.0, TRUE, 'Tender chickpeas simmered in aromatic spiced gravy.'),
('food-khichdi', 'Khichdi (Rice & Moong Dal Comfort Dish)', 'खिचड़ी', 'Curries & Dishes', 120, 4.8, 22.0, 1.5, 2.5, TRUE, 'Balanced comfort one-pot meal of rice and yellow moong dal.'),
('food-sambar', 'Sambar (Lentil Vegetable Stew)', 'सांभर', 'South Indian Dishes', 65, 3.0, 10.5, 1.2, 3.0, TRUE, 'Tangy lentil and mixed vegetable soup.'),
('food-oats', 'Rolled Oats Porridge (Cooked in Milk/Water)', 'ओट्स दलिया', 'Grains & Breads', 95, 3.8, 16.5, 1.8, 2.5, TRUE, 'Whole grain oats high in beta-glucan soluble fibre.'),
('food-banana', 'Banana (Raw Fresh)', 'केला', 'Fruits & Vegetables', 89, 1.1, 22.8, 0.3, 2.6, TRUE, 'Natural sweet energy booster loaded with potassium.'),
('food-apple', 'Apple (Fresh with Skin)', 'सेब', 'Fruits & Vegetables', 52, 0.3, 13.8, 0.2, 2.4, TRUE, 'Fresh apple rich in pectin fibre and antioxidants.'),
('food-mixed-salad', 'Fresh Mixed Salad (Cucumber, Tomato, Onion)', 'ताज़ा सलाद', 'Fruits & Vegetables', 22, 1.0, 4.2, 0.2, 1.8, TRUE, 'Fresh sliced raw salad with lime and salt.'),
('food-almonds', 'Almonds (Raw / Soaked Badam)', 'बादाम', 'Nuts & Healthy Fats', 579, 21.2, 21.6, 49.9, 12.5, TRUE, 'Nutrient-dense tree nuts loaded with healthy monounsaturated fats.');

-- 2. Serving Options
INSERT INTO food_serving_options (id, food_id, label, grams, unit_name, is_gram_based)
VALUES
('srv-roti-med', 'food-roti', '1 Medium Roti (approx. 35g)', 35.0, 'roti', FALSE),
('srv-roti-large', 'food-roti', '1 Large Roti (approx. 50g)', 50.0, 'roti', FALSE),
('srv-roti-g', 'food-roti', 'Grams (g)', 1.0, 'g', TRUE),
('srv-rice-cup', 'food-rice-steamed', '1 Medium Bowl / Katori (150g cooked)', 150.0, 'katori', FALSE),
('srv-rice-g', 'food-rice-steamed', 'Grams (g)', 1.0, 'g', TRUE),
('srv-dal-katori', 'food-dal-tadka', '1 Medium Katori / Bowl (150g)', 150.0, 'katori', FALSE),
('srv-dal-g', 'food-dal-tadka', 'Grams (g)', 1.0, 'g', TRUE),
('srv-idli-p', 'food-idli', '1 Medium Idli (approx. 50g)', 50.0, 'idli', FALSE),
('srv-idli-g', 'food-idli', 'Grams (g)', 1.0, 'g', TRUE),
('srv-egg-one', 'food-egg-boiled', '1 Large Boiled Egg (approx. 50g)', 50.0, 'egg', FALSE),
('srv-paneer-cube', 'food-paneer', '5 Small Cubes (50g)', 50.0, 'serving', FALSE),
('srv-curd-katori', 'food-curd', '1 Medium Katori / Cup (150g)', 150.0, 'katori', FALSE);

-- 3. Standard Exercises
INSERT INTO exercises (id, name, muscle_group, equipment, difficulty, instructions)
VALUES
('ex-1', 'Barbell Flat Bench Press', 'Chest', 'Barbell & Bench', 'INTERMEDIATE', 'Retract scapula, lower bar to mid-chest, drive up with feet planted.'),
('ex-2', 'Incline Dumbbell Press', 'Chest', 'Dumbbells & Incline Bench', 'INTERMEDIATE', 'Press dumbbells up at 30° angle focusing on upper pectorals.'),
('ex-3', 'Lat Pulldown', 'Back', 'Cable Machine', 'BEGINNER', 'Pull bar down towards upper chest while arching upper back gently.'),
('ex-4', 'Barbell Bent-Over Row', 'Back', 'Barbell', 'INTERMEDIATE', 'Hinge at hips, pull bar towards belly button, squeeze lats.'),
('ex-5', 'Dumbbell Lateral Raise', 'Shoulders', 'Dumbbells', 'BEGINNER', 'Raise arms out to side with slight elbow bend up to shoulder level.'),
('ex-6', 'Barbell Back Squat', 'Legs', 'Barbell & Squat Rack', 'INTERMEDIATE', 'Feet shoulder-width, squat to parallel, keep chest upright.'),
('ex-7', 'Romanian Deadlift (RDL)', 'Legs', 'Barbell / Dumbbells', 'INTERMEDIATE', 'Hinge at hips, keeping back flat, feeling hamstring stretch.'),
('ex-8', 'Standing Barbell Bicep Curl', 'Biceps', 'Barbell', 'BEGINNER', 'Keep elbows pinned to ribs, curl bar with control.'),
('ex-9', 'Tricep Rope Pushdown', 'Triceps', 'Cable Machine', 'BEGINNER', 'Extend elbows downwards, flaring rope slightly at bottom.'),
('ex-10', 'Hanging Leg Raises', 'Core & Abs', 'Pull-up Bar', 'INTERMEDIATE', 'Hang from bar, raise legs up towards chest with control.');
