import IPosition from "./IPosition";
import TeamEnum from "./TeamEnum";

interface ICharacter {
  name: string;
  movement: number;
  attack: number;
  defense: number;
  agility: number;
  position?: IPosition;
  species: TeamEnum;
  attackRange: number;
  health: number;

  head: string;
  hair: string;
  hand: string;
  facialHair: string;
  rightArmWeapon: string;
  metalHat: string;
  leatherHat: string;
  clothHat: string;
}

export enum HatTypeEnum {
  Leather = "Leather",
  Armor = "Armor",
  Cloth = "Cloth",
  None = "None",
}

export interface IGameCharacter extends Required<ICharacter> {
  actedInTurn: boolean;
}

export default ICharacter;
