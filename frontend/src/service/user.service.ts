import type { AuthResponse, Credentials } from "../types/user.types";
import { get, post } from "./api";

type User = {
  message: string;
  user_id: string;
};

type AuthCheckResult = {
  isAuthenticated: boolean;
  username: string | null;
};

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
    const auth = await checkAuthentication();

    return {
      userId: storedUserId,
      isAuthenticated: auth.isAuthenticated,
      username: auth.username,
    };
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
  try {
    const user = await get<AuthCheckResult>(`user/auth`);

    return {
      isAuthenticated: user.isAuthenticated,
      username: user.username,
    };
  } catch {
    return {
      isAuthenticated: false,
      username: null,
    };
  }
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