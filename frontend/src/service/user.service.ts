import type { AuthResponse, Credentials, UserStats } from "../types/user.types";
import { get, post, ApiError } from "./api";

type User = {
  message: string;
  user_id: string;
};

type AuthCheckResult = {
  isAuthenticated: boolean;
  username: string | null;
};

export class StaleUserError extends Error {
  constructor() {
    super("Stale userId in localStorage");
    this.name = "StaleUserError";
  }
}

async function getUser(): Promise<User> {
  return await get("user");
}

export function getUserFromLocalStorage() {
  return localStorage.getItem("userId");
}

type InitUserResult = {
  userId: string;
  isAuthenticated: boolean;
  username: string | null;
};

export async function initUser(): Promise<InitUserResult> {
  const storedUserId = getUserFromLocalStorage();

  if (storedUserId) {
    try {
      const auth = await checkAuthentication();
      return {
        userId: storedUserId,
        isAuthenticated: auth.isAuthenticated,
        username: auth.username,
      };
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        localStorage.removeItem("userId");
        throw new StaleUserError();
      }
      throw err;
    }
  }

  const res = await getUser();
  localStorage.setItem("userId", res.user_id);

  return {
    userId: res.user_id,
    isAuthenticated: false,
    username: null,
  };
}

async function checkAuthentication(): Promise<AuthCheckResult> {
  return await get<AuthCheckResult>("user/auth");
}

export async function login(data: Credentials): Promise<AuthResponse | null> {
  try {
    return await post<AuthResponse>("user/signin", data);
  } catch {
    return null;
  }
}

export async function register(data: Credentials): Promise<AuthResponse | null> {
  try {
    return await post<AuthResponse>("user/register", data);
  } catch {
    return null;
  }
}

export async function getUserStats(): Promise<UserStats | null> {
  try {
    return await get<UserStats>("user/stats");
  } catch {
    return null;
  }
}