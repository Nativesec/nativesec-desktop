import produce from 'immer';
import { ActionType } from './actions';

interface ThemeState {
  theme: 'light' | 'dark';
}

export function themeReducer(state: ThemeState, action: any) {
  switch (action.type) {
    case ActionType.CHANGE_THEME:
      return produce(state, (draft) => {
        draft.theme = action.payload.theme;
      });
    default:
      return state;
  }
}
