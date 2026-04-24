import { get } from "./api";

type User = {
  message: string;
  user_id: string;
};

async function getUser(): Promise<User> {
  return await get("user");
}

export function getUserFromLocalStorage() {
  return localStorage.getItem("userId");
}

export async function initUser() {
  let userId = getUserFromLocalStorage()

  if (userId) return userId;

  const res = await getUser();

  localStorage.setItem("userId", res.user_id);

  return res.user_id;
}