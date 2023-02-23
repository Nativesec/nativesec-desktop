import database from '../database';
import { RunReturn } from '../types';

export interface DeleteParticipantProps {
  participants: string;
  organizationId: string;
}

const deleteParticipant = async ({
  participants,
  organizationId,
}: DeleteParticipantProps): RunReturn => {
  return database.run(
    `
      UPDATE organizations SET
      participantes = '${participants}'
      WHERE _id = '${organizationId}'
      `
  );
};

export default deleteParticipant;
