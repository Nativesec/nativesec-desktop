import { createContext, ReactNode, useEffect, useReducer } from 'react';
import { useLocation } from 'react-router-dom';
import { useIpcOrganization } from 'renderer/hooks/useOrganization/useIpcOrganization';
import {
  changeCurrentOrganizationAction,
  updateOrganizationsAction,
  updateOrganizationsIconsAction,
  updateOrganizationsInvitesAction,
} from 'renderer/reducers/organizations/actions';
import { organizationsReducer } from 'renderer/reducers/organizations/reducer';
import { IOrganization, IOrganizationIcon, IOrganizationInvite } from './types';

interface OrganizationsContextType {
  organizations: IOrganization[];
  organizationsIcons: IOrganizationIcon[];
  organizationsInvites: IOrganizationInvite[];
  currentOrganization: IOrganization | undefined;
  currentOrganizationIcon: IOrganizationIcon | undefined;

  updateOrganizations: (newOrganizations: IOrganization[]) => void;
  updateOrganizationsIcons: (
    newOrganizationsIcons: IOrganizationIcon[]
  ) => void;
  changeCurrentOrganization: (newCurrentOrganizationId: string) => void;
  refreshOrganizations: () => void;
  updateOrganizationsInvites: (
    newOrganizationsInvites: IOrganizationInvite[]
  ) => void;
}
export const OrganizationsContext = createContext(
  {} as OrganizationsContextType
);

interface CyclesContextProviderProps {
  children: ReactNode;
}

export function OrganizationsContextProvider({
  children,
}: CyclesContextProviderProps) {
  const location = useLocation();
  const [organizationsState, dispatch] = useReducer(organizationsReducer, {
    organizations: [],
    organizationsIcons: [],
    organizationsInvites: [],
    currentOrganization: undefined,
    currentOrganizationIcon: undefined,
  });

  const {
    organizations,
    organizationsIcons,
    organizationsInvites,
    currentOrganization,
    currentOrganizationIcon,
  } = organizationsState;

  useEffect(() => {
    if (currentOrganization !== undefined) {
      const root = document.documentElement;
      root?.style.setProperty(
        '--main-color',
        JSON.parse(currentOrganization?.tema as string).mainColor
      );
      root?.style.setProperty(
        '--second-color',
        JSON.parse(currentOrganization?.tema as string).secondColor
      );
    }
  }, [currentOrganization, location.pathname]);

  function updateOrganizations(newOrganizations: IOrganization[]) {
    dispatch(updateOrganizationsAction(newOrganizations));
  }

  function updateOrganizationsIcons(
    newOrganizationsIcons: IOrganizationIcon[]
  ) {
    dispatch(updateOrganizationsIconsAction(newOrganizationsIcons));
  }

  function refreshOrganizations() {
    dispatch(
      updateOrganizationsAction(window.electron.store.get('organizations'))
    );
    dispatch(
      updateOrganizationsIconsAction(window.electron.store.get('iconeAll'))
    );
  }

  function changeCurrentOrganization(newCurrentOrganizationId: string) {
    dispatch(changeCurrentOrganizationAction(newCurrentOrganizationId));
  }

  function updateOrganizationsInvites(
    newOrganizationsInvites: IOrganizationInvite[]
  ) {
    dispatch(updateOrganizationsInvitesAction(newOrganizationsInvites));
  }

  return (
    <OrganizationsContext.Provider
      value={{
        organizations,
        organizationsIcons,
        organizationsInvites,
        currentOrganization,
        currentOrganizationIcon,
        updateOrganizations,
        updateOrganizationsIcons,
        updateOrganizationsInvites,
        changeCurrentOrganization,
        refreshOrganizations,
      }}
    >
      {children}
    </OrganizationsContext.Provider>
  );
}
