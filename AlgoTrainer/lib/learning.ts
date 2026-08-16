// lib/learning.ts — Backend API functions for difficulty, goals, and profile
import { supabase } from "@/lib/supabase";
import { getBackendUrl } from "@/lib/appConfig";

const BACKEND_URL = getBackendUrl();

async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function apiCall<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" = "GET",
  body?: any,
): Promise<T> {
  if (!BACKEND_URL) {
    throw new Error("Backend URL not configured");
  }

  const token = await getAccessToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API error: ${response.statusText} - ${errorBody}`);
  }

  return response.json();
}

// Difficulty
export async function getDifficulty(): Promise<{ difficulty: string | null }> {
  return apiCall("/api/user/difficulty", "GET");
}

export async function setDifficulty(
  difficulty: "beginner" | "intermediate" | "advanced",
): Promise<{ success: boolean; difficulty: string }> {
  return apiCall("/api/user/difficulty", "PUT", { difficulty });
}

// Goals
export async function getGoal(): Promise<{ daily_minutes: number | null }> {
  return apiCall("/api/user/goal", "GET");
}

export async function setGoal(daily_minutes: number): Promise<{ success: boolean }> {
  return apiCall("/api/user/goal", "POST", { daily_minutes });
}

// Profile
export async function getProfile(): Promise<{ profile: { id: string; username: string | null } }> {
  return apiCall("/api/user/profile", "GET");
}

export async function updateProfile(username: string): Promise<{ success: boolean }> {
  return apiCall("/api/user/profile", "PUT", { username });
}
