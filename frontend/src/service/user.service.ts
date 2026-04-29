import { get } from "./api";

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
    const auth = await checkAuthentication(storedUserId);

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

async function checkAuthentication(id: string): Promise<AuthCheckResult> {
  try {
    const user = await get<AuthCheckResult>(`user/${id}`);

    return {
      isAuthenticated: true,
      username: user.username,
    };
  } catch {
    return {
      isAuthenticated: false,
      username: null,
    };
  }
}