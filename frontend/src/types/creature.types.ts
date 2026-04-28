export type Creature = {
  id: string;
  name: string;
  description: string;
  isPlayable: boolean;
  imageUrl: string;

};

export type CreatureStats = {
  iD: string;
  creatureID: string;
  maxHP: number;
  attack: number;
  defence: number;
  actionPoint: number;
  speed: number;
};

export type CreatureDetails = {
  id: string;
  name: string;
  description: string;
  isPlayable: boolean;
  imageUrl: string;
  maxHP: number;
  attack: number;
  defence: number;
  actionPoint: number;
  speed: number;
};