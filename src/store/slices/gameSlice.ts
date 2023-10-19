import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import TeamEnum from "../../globalTypes/TeamEnum";
import ICharacter, { IGameCharacter } from "../../globalTypes/ICharacter";

export interface IGameState {
  whichSpeciesTurn: TeamEnum;
  clickedCharacter: IGameCharacter | undefined;
  characterInAction: IGameCharacter | undefined;
  hoveredCharacter: IGameCharacter | undefined;
  error: string;
  message: string;
}

const initialState: IGameState = {
  whichSpeciesTurn: TeamEnum.A,
  clickedCharacter: undefined,
  characterInAction: undefined,
  hoveredCharacter: undefined,
  error: "",
  message: "",
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setTurn: (state: IGameState, action: PayloadAction<TeamEnum>) => {
      state.whichSpeciesTurn = action.payload;
    },
    setClickedCharacter: (
      state: IGameState,
      action: PayloadAction<IGameCharacter | undefined>
    ) => {
      state.clickedCharacter = action.payload;
    },
    setCharacterInAction: (
      state: IGameState,
      action: PayloadAction<IGameCharacter | undefined>
    ) => {
      state.characterInAction = action.payload;
    },
    setError: (state: IGameState, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setMessage: (state: IGameState, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    setHoveredCharacter: (
      state: IGameState,
      action: PayloadAction<IGameCharacter>
    ) => {
      state.hoveredCharacter = action.payload;
    },
  },
});

export default gameSlice.reducer;
