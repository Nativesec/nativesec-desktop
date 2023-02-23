import {
  IOrganization,
  IOrganizationIcon,
  IOrganizationInvite,
} from 'renderer/contexts/organizationsContext/types';

export enum ActionType {
  UPDATE_ORGANIZATIONS = 'UPDATE_ORGANIZATIONS',
  UPDATE_ORGANIZATIONS_ICONS = 'UPDATE_ORGANIZATIONS_ICONS',
  CHANGE_CURRENT_ORGANIZATION = 'CHANGE_CURRENT_ORGANIZATION',
  UPDATE_ORGANIZATIONS_INVITES = 'UPDATE_ORGANIZATIONS_INVITES',
}

export function updateOrganizationsAction(newOrganizations: IOrganization[]) {
  return {
    type: ActionType.UPDATE_ORGANIZATIONS,
    payload: {
      newOrganizations,
    },
  };
}

export function updateOrganizationsIconsAction(
  organizationsIcons: IOrganizationIcon[]
) {
  return {
    type: ActionType.UPDATE_ORGANIZATIONS_ICONS,
    payload: {
      organizationsIcons,
    },
  };
}

export function changeCurrentOrganizationAction(
  newCurrentOrganizationId: string
) {
  return {
    type: ActionType.CHANGE_CURRENT_ORGANIZATION,
    payload: {
      newCurrentOrganizationId,
    },
  };
}

export function updateOrganizationsInvitesAction(
  newOrganizationsInvites: IOrganizationInvite[]
) {
  return {
    type: ActionType.UPDATE_ORGANIZATIONS_INVITES,
    payload: {
      newOrganizationsInvites,
    },
  };
}
