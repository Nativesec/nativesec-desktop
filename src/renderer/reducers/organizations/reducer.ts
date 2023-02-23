import { produce } from 'immer';
import organizations from 'main/ipc/organizations';
import {
  IOrganization,
  IOrganizationIcon,
  IOrganizationInvite,
} from 'renderer/contexts/organizationsContext/types';
import { ActionType } from './actions';

interface OrganizationsState {
  organizations: IOrganization[];
  organizationsIcons: IOrganizationIcon[];
  organizationsInvites: IOrganizationInvite[];
  currentOrganization: IOrganization | undefined;
  currentOrganizationIcon: IOrganizationIcon | undefined;
}

export function organizationsReducer(state: OrganizationsState, action: any) {
  switch (action.type) {
    case ActionType.UPDATE_ORGANIZATIONS: {
      let currentOrganizationIndex = -1;
      if (state.currentOrganization) {
        currentOrganizationIndex = state.organizations.findIndex(
          (organization) => {
            return organization._id === state.currentOrganization?._id;
          }
        );
      }

      return produce(state, (draft) => {
        draft.organizations = action.payload.newOrganizations;
        if (currentOrganizationIndex >= 0) {
          draft.currentOrganization =
            action.payload.newOrganizations[currentOrganizationIndex];
        }
      });
    }
    case ActionType.UPDATE_ORGANIZATIONS_ICONS:
      return produce(state, (draft) => {
        draft.organizationsIcons = action.payload.organizationsIcons;
      });

    case ActionType.CHANGE_CURRENT_ORGANIZATION: {
      const currentOrganizationIndex = state.organizations.findIndex(
        (organization) => {
          return organization._id === action.payload.newCurrentOrganizationId;
        }
      );

      const currentOrganizationIconIndex = state.organizationsIcons.findIndex(
        (organizationIcon) => {
          return (
            organizationIcon._id === action.payload.newCurrentOrganizationId
          );
        }
      );

      return produce(state, (draft) => {
        draft.currentOrganization =
          state.organizations[currentOrganizationIndex];
        draft.currentOrganizationIcon =
          state.organizationsIcons[currentOrganizationIconIndex];
      });
    }

    case ActionType.UPDATE_ORGANIZATIONS_INVITES:
      return produce(state, (draft) => {
        draft.organizationsInvites = action.payload.newOrganizationsInvites;
      });

    default:
      return state;
  }
}
