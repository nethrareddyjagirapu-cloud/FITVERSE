package com.fitverse.service;

import com.fitverse.dto.ChatResponse;
import com.fitverse.model.MealItem;
import com.fitverse.model.UserProfile;
import com.fitverse.model.WorkoutSession;
import com.fitverse.repository.MealItemRepository;
import com.fitverse.repository.UserProfileRepository;
import com.fitverse.repository.WorkoutSessionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class FitBotService {

    private final UserProfileRepository userProfileRepository;
    private final MealItemRepository mealItemRepository;
    private final WorkoutSessionRepository workoutSessionRepository;

    @Value("${fitverse.ai.gemini-api-key:}")
    private String geminiApiKey;

    public FitBotService(
            UserProfileRepository userProfileRepository,
            MealItemRepository mealItemRepository,
            WorkoutSessionRepository workoutSessionRepository) {
        this.userProfileRepository = userProfileRepository;
        this.mealItemRepository = mealItemRepository;
        this.workoutSessionRepository = workoutSessionRepository;
    }

    public ChatResponse generateResponse(String userId, String userQuery) {
        String today = LocalDate.now().toString();
        UserProfile profile = userProfileRepository.findByUserId(userId).orElse(null);
        List<MealItem> todayMeals = mealItemRepository.findByUserIdAndLogDateOrderByCreatedAtAsc(userId, today);
        List<WorkoutSession> recentWorkouts = workoutSessionRepository.findByUserIdOrderByCreatedAtDesc(userId);

        int caloriesEaten = todayMeals.stream().mapToInt(MealItem::getCalories).sum();
        int targetCalories = (profile != null && profile.getTargetDailyCalories() != null) ? profile.getTargetDailyCalories() : 2200;
        int targetProtein = (profile != null && profile.getTargetDailyProtein() != null) ? profile.getTargetDailyProtein() : 140;

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("hh:mm a"));

        // If Gemini API Key is provided, attempt live AI inference
        if (geminiApiKey != null && !geminiApiKey.trim().isEmpty()) {
            try {
                String aiReply = callGeminiApi(userQuery, profile, caloriesEaten, targetCalories, recentWorkouts);
                if (aiReply != null && !aiReply.trim().isEmpty()) {
                    return new ChatResponse(aiReply, false, timestamp);
                }
            } catch (Exception e) {
                // Fall back gracefully to deterministic coach mode if network or key fails
            }
        }

        // Deterministic grounded response based on user's real logged metrics
        String reply = buildGroundedResponse(userQuery, profile, caloriesEaten, targetCalories, targetProtein, todayMeals, recentWorkouts);
        return new ChatResponse(reply, true, timestamp);
    }

    private String buildGroundedResponse(
            String query,
            UserProfile profile,
            int caloriesEaten,
            int targetCalories,
            int targetProtein,
            List<MealItem> meals,
            List<WorkoutSession> workouts) {

        String q = query.toLowerCase();

        if (q.contains("calorie") || q.contains("how much have i eaten") || q.contains("food today")) {
            int remaining = Math.max(0, targetCalories - caloriesEaten);
            if (meals.isEmpty()) {
                return "You haven't logged any meals today yet! Your daily target is " + targetCalories + " kcal. Head over to the Nutrition Tracker to log your breakfast, lunch, or snacks.";
            }
            return String.format(
                "Today you have logged %d kcal out of your %d kcal target (%d kcal remaining). You've logged %d food items so far.",
                caloriesEaten, targetCalories, remaining, meals.size()
            );
        }

        if (q.contains("protein") || q.contains("muscle")) {
            return String.format(
                "Your daily protein goal is %dg. High-quality protein sources to hit your goal include boiled eggs (6g each), paneer (18g/100g), chicken breast (31g/100g), curd/yogurt, and soya chunks (52g/100g).",
                targetProtein
            );
        }

        if (q.contains("workout") || q.contains("exercise") || q.contains("gym")) {
            if (workouts.isEmpty()) {
                return "You haven't logged any workouts yet. Try starting with a simple 30-minute session like Pushups, Squats, or Bench Press in the Workout Tracker!";
            }
            WorkoutSession last = workouts.get(0);
            return String.format(
                "Your last recorded workout was '%s' on %s (%d mins). Keep up the great consistency!",
                last.getName(), last.getSessionDate(), last.getDurationMinutes()
            );
        }

        if (q.contains("weight") || q.contains("goal") || q.contains("fat loss") || q.contains("cut")) {
            String goal = (profile != null && profile.getFitnessGoal() != null) ? profile.getFitnessGoal().replace("_", " ") : "staying healthy";
            return String.format(
                "Your primary fitness goal is %s. Remember: consistent calorie management, 7-8 hours of sleep, and progressive resistance training drive 90%% of long-term transformations.",
                goal
            );
        }

        if (q.contains("water") || q.contains("drink") || q.contains("hydrate")) {
            return "Aim for 2.5 to 3.5 liters of water every day. Staying hydrated improves workout performance, digestive health, and energy levels.";
        }

        return "Hello! I am FitBot, your FITVERSE AI fitness coach. I can help analyze your logged meals, track your calorie targets, suggest workout splits, and offer personalized nutrition tips. What would you like to explore today?";
    }

    private String callGeminiApi(String userQuery, UserProfile profile, int caloriesEaten, int targetCalories, List<WorkoutSession> workouts) {
        try {
            String systemContext = String.format(
                "You are FitBot, an encouraging personal fitness coach for FitVerse. " +
                "The user's daily calorie target is %d kcal. Calories eaten today: %d kcal. " +
                "Keep your answers practical, motivating, concise, and easy to understand for beginners.",
                targetCalories, caloriesEaten
            );

            String escapedPrompt = userQuery.replace("\"", "\\\"").replace("\n", " ");
            String escapedContext = systemContext.replace("\"", "\\\"").replace("\n", " ");

            String requestBody = String.format(
                "{\"contents\": [{\"parts\": [{\"text\": \"%s\\nUser query: %s\"}]}]}",
                escapedContext, escapedPrompt
            );

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                String body = response.body();
                // Simple JSON parsing to extract "text": "..."
                int textIdx = body.indexOf("\"text\": \"");
                if (textIdx != -1) {
                    int start = textIdx + 9;
                    int end = body.indexOf("\"", start);
                    if (end != -1) {
                        return body.substring(start, end).replace("\\n", "\n").replace("\\\"", "\"");
                    }
                }
            }
        } catch (Exception ignored) {
        }
        return null;
    }
}
