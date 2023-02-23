import createOrganization from './createOrganization';
import getOrganizationIcon from './getOrganizationIcon';
import inviteParticipant from './inviteParticipant';
import deleteInvite from './deleteInvite';
import deleteParticipant from './deleteParticipant';
import updateOrganization from './updateOrganization';
import deleteOrganization from './deleteOrganization';
import leaveOrganization from './leaveOrganization';
import acceptInvite from './acceptInvite';
import listMyOrganizations from './listMyOrganizations';
import getOrganization from './getOrganization';
import declineInvite from './declineInvite';
import getMyInvites from './getMyInvites';
import listOrganizationIcons from './listOrganizationIcons';

const APIOrganization = {
  getMyInvites,
  deleteInvite,
  acceptInvite,
  declineInvite,
  getOrganization,
  deleteParticipant,
  leaveOrganization,
  inviteParticipant,
  createOrganization,
  deleteOrganization,
  getOrganizationIcon,
  updateOrganization,
  listMyOrganizations,
  listOrganizationIcons,
};

export default APIOrganization;
