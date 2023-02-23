export interface IDBCreateOrganization {
  _id: string;
  creationDate: number;
  updateDate: number;
  name: string;
  description: string;
  theme: string;
  limitUsers: number;
  storageLimit: number;
  ownerEmail: string;
  adminGuests: string;
  participantGuests: string;
  participants: string;
  admins: string;
  deleted: string;
}

export interface IDBUpdateOrganization {
  organizationId: string;
  updateDate: number;
  name: string;
  description: string;
  theme: string;
  limitUsers: number;
  storageLimit: number;
  ownerEmail: string;
  adminGuests: string;
  participantGuests: string;
  participants: string;
  admins: string;
  deleted: string;
}
