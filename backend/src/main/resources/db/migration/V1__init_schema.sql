-- ===================================================================
-- FITVERSE: V1 Initial Database Schema Migration
-- Designed for MySQL 8.0 & ANSI SQL compatibility
-- ===================================================================

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(191) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_profiles (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL UNIQUE,
    age INT,
    gender VARCHAR(32),
    height_cm DECIMAL(5,2),
    current_weight_kg DECIMAL(5,2),
    fitness_goal VARCHAR(40),
    activity_level VARCHAR(40),
    fitness_experience VARCHAR(40),
    diet_preference VARCHAR(40),
    workout_location VARCHAR(40),
    preferred_workout_days INT DEFAULT 4,
    allergies VARCHAR(255),
    target_daily_calories INT DEFAULT 2200,
    target_daily_protein INT DEFAULT 140,
    target_daily_carbs INT DEFAULT 250,
    target_daily_fat INT DEFAULT 65,
    target_daily_fibre INT DEFAULT 35,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS foods (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    hindi_name VARCHAR(150),
    category VARCHAR(60) NOT NULL,
    calories_per_100g INT NOT NULL,
    protein_per_100g DECIMAL(5,1) NOT NULL,
    carbs_per_100g DECIMAL(5,1) NOT NULL,
    fat_per_100g DECIMAL(5,1) NOT NULL,
    fibre_per_100g DECIMAL(5,1) NOT NULL,
    is_verified BOOLEAN DEFAULT TRUE,
    description VARCHAR(500),
    created_by_user_id VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS food_serving_options (
    id VARCHAR(64) PRIMARY KEY,
    food_id VARCHAR(64) NOT NULL,
    label VARCHAR(120) NOT NULL,
    grams DECIMAL(6,1) NOT NULL,
    unit_name VARCHAR(40) NOT NULL,
    is_gram_based BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_serving_food FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS meal_items (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    food_id VARCHAR(64),
    food_name VARCHAR(150) NOT NULL,
    meal_category VARCHAR(32) NOT NULL,
    log_date VARCHAR(20) NOT NULL,
    serving_label VARCHAR(120),
    quantity DECIMAL(6,1) NOT NULL,
    total_grams DECIMAL(6,1) NOT NULL,
    calories INT NOT NULL,
    protein DECIMAL(5,1) NOT NULL,
    carbs DECIMAL(5,1) NOT NULL,
    fat DECIMAL(5,1) NOT NULL,
    fibre DECIMAL(5,1) NOT NULL,
    logged_at VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_meal_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS exercises (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    muscle_group VARCHAR(50) NOT NULL,
    equipment VARCHAR(80),
    difficulty VARCHAR(30),
    instructions TEXT
);

CREATE TABLE IF NOT EXISTS workout_sessions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    name VARCHAR(120) NOT NULL,
    session_date VARCHAR(30) NOT NULL,
    duration_minutes INT DEFAULT 45,
    total_volume_kg DECIMAL(8,1) DEFAULT 0,
    exercises_logged INT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_workout_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS fitness_journeys (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    name VARCHAR(120) NOT NULL,
    goal_type VARCHAR(40) NOT NULL,
    starting_weight_kg DECIMAL(5,2) NOT NULL,
    current_weight_kg DECIMAL(5,2) NOT NULL,
    target_weight_kg DECIMAL(5,2),
    start_date VARCHAR(30) NOT NULL,
    planned_end_date VARCHAR(30) NOT NULL,
    actual_end_date VARCHAR(30),
    status VARCHAR(30) DEFAULT 'ACTIVE',
    target_workout_days_per_week INT DEFAULT 4,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_journey_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS progress_measurements (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    measurement_date VARCHAR(30) NOT NULL,
    weight_kg DECIMAL(5,2) NOT NULL,
    waist_cm DECIMAL(5,2),
    chest_cm DECIMAL(5,2),
    hip_cm DECIMAL(5,2),
    notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_measurement_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS daily_habits (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    log_date VARCHAR(30) NOT NULL,
    water_intake_ml INT DEFAULT 0,
    sleep_hours DECIMAL(4,1) DEFAULT 0,
    steps_count INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_habit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
