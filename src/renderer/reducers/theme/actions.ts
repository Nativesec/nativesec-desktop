export enum ActionType {
  CHANGE_THEME = 'CHANGE_THEME',
}

export function changeThemeAction(theme: 'light' | 'dark') {
  return {
    type: ActionType.CHANGE_THEME,
    payload: {
      theme,
    },
  };
}
