import createOrganization from './createOrganization';
import listOrganizations from './listOrganization';
import inviteParticipant from './inviteParticipant';
import inviteAdmin from './inviteAdmin';
import updateOrganization from './updateOrganization';
import deleteOrganization from './deleteOrganization';
import deleteInviteAdmin from './deleteInviteAdmin';
import deleteInviteParticipant from './deleteInviteParticipant';
import deleteAdmin from './deleteAdmin';
import deleteParticipant from './deleteParticipant';

const DBOrganization = {
  createOrganization,
  listOrganizations,
  inviteParticipant,
  updateOrganization,
  deleteOrganization,
  inviteAdmin,
  deleteInviteAdmin,
  deleteInviteParticipant,
  deleteAdmin,
  deleteParticipant,
};

export default DBOrganization;
