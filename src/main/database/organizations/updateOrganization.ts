import database from '../database';
import { RunReturn } from '../types';
import { IDBUpdateOrganization } from './types';

export interface UpdateOrganizationProps {
  data: IDBUpdateOrganization;
}

const updateOrganization = async ({
  data,
}: UpdateOrganizationProps): RunReturn => {
  return database.run(
    `UPDATE organizations SET
    nome = '${data.name}',
    tema = '${data.theme}',
    dono = '${data.ownerEmail}',
    descricao = '${data.description}',
    data_atualizacao = '${data.updateDate}',
    convidados_participantes = '${data.participantGuests}',
    convidados_administradores = '${data.adminGuests}',
    limite_usuarios = '${data.limitUsers}',
    limite_armazenamento = '${data.storageLimit}',
    participantes = '${data.participants}',
    administradores = '${data.admins}',
    deletado = '${data.deleted}'
    WHERE _id = '${data.organizationId}'
  `
  );
};

export default updateOrganization;
