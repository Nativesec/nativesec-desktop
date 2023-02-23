import database from '../database';
import { IDBCreateOrganization } from './types';
import { DatabaseReturnType } from '../types';

export interface CreateOrganizationProps {
  data: IDBCreateOrganization;
}

const createOrganization = async ({
  data,
}: CreateOrganizationProps): DatabaseReturnType => {
  return database.run(
    `
      INSERT INTO organizations (
      _id,
      nome,
      descricao,
      tema,
      dono,
      data_criacao,
      data_atualizacao,
      limite_usuarios,
      limite_armazenamento,
      convidados_participantes,
      convidados_administradores,
      participantes,
      administradores,
      deletado
    )
    VALUES(
      '${data._id}',
      '${data.name}',
      '${data.description}',
      '${data.theme}',
      '${data.ownerEmail}',
      '${data.creationDate}',
      '${data.updateDate}',
      '${data.limitUsers}',
      '${data.storageLimit}',
      '${data.participantGuests}',
      '${data.adminGuests}',
      '${data.participants}',
      '${data.admins}',
      '${data.deleted}'
    )
    `
  );
};

export default createOrganization;
