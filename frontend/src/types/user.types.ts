export type AuthResponse = {
  message: string;
  user_id: string;
};

export type Credentials = {
  username: string;
  password: string;
};

export type UserStats = {
  completedCampaigns: number;
  fights: number;
  wins: number;
  losses: number;
};