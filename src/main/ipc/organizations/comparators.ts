/* eslint-disable import/no-unresolved */
/* eslint-disable consistent-return */
/* eslint-disable promise/always-return */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable import/prefer-default-export */
import { IIcons } from 'renderer/pages/Workspace/types';
import database from '../../database/database';
import DBOrganization from '../../database/organizations';
import { IOrganization } from '../../../renderer/routes/types';
import { IIconsDatabase, IOrganizationDatabase } from './types';

const organizationComparator = async (
  organizations: IOrganization[]
): Promise<boolean> => {
  const queryOrganizations = await database.all(`SELECT * FROM organizations`);

  const qOrgFilter = (<IOrganizationDatabase[]>queryOrganizations).filter(
    (qOrg) => qOrg !== undefined
  );

  if (qOrgFilter.length === 0 && organizations.length > 0) {
    await Promise.all(
      organizations.map(async (item) => {
        await DBOrganization.createOrganization({
          data: {
            _id: item._id.$oid,
            name: item.nome,
            description: item.descricao,
            theme: item.tema,
            ownerEmail: item.dono,
            updateDate: item.data_atualizacao.$date,
            creationDate: item.data_criacao.$date,
            limitUsers: item.limite_usuarios,
            storageLimit: item.limite_armazenamento,
            adminGuests: JSON.stringify(item.convidados_administradores),
            participantGuests: JSON.stringify(item.convidados_participantes),
            participants: JSON.stringify(item.participantes),
            admins: JSON.stringify(item.administradores),
            deleted: item.deletado,
          },
        });
      })
    );
    return true;
  }
  if (organizations.length > qOrgFilter.length) {
    const arrayInsert: IOrganization[] = [];
    for (let i = 0; i < organizations.length; i++) {
      let equal = false;
      for (let x = 0; x < qOrgFilter.length; x++) {
        if (qOrgFilter[x]._id === organizations[i]._id.$oid) {
          equal = true;
        }
      }
      if (equal === false) {
        arrayInsert.push(organizations[i]);
      }
    }

    if (arrayInsert.length > 0) {
      await Promise.all(
        arrayInsert.map(async (item) => {
          await DBOrganization.createOrganization({
            data: {
              _id: item._id.$oid,
              name: item.nome,
              description: item.descricao,
              theme: item.tema,
              ownerEmail: item.dono,
              updateDate: item.data_atualizacao.$date,
              creationDate: item.data_criacao.$date,
              limitUsers: item.limite_usuarios,
              storageLimit: item.limite_armazenamento,
              adminGuests: JSON.stringify(item.convidados_administradores),
              participantGuests: JSON.stringify(item.convidados_participantes),
              participants: JSON.stringify(item.participantes),
              admins: JSON.stringify(item.administradores),
              deleted: item.deletado,
            },
          });
        })
      );
    }
    return true;
  }

  if (organizations.length < qOrgFilter.length) {
    const arrayDelete: IOrganizationDatabase[] = [];
    for (let i = 0; i < qOrgFilter.length; i++) {
      let equal = false;
      for (let x = 0; x < organizations.length; x++) {
        if (qOrgFilter[i]._id === organizations[x]._id.$oid) {
          equal = true;
        }
      }
      if (equal === false) {
        arrayDelete.push(qOrgFilter[i]);
      }
    }
    if (arrayDelete.length > 0) {
      await Promise.all(
        arrayDelete.map(async (item) => {
          DBOrganization.deleteOrganization({ organizationId: item._id });
        })
      );
    }
    return true;
  }

  if (organizations.length > 0) {
    const arrayUpdate: IOrganization[] = [];
    for (let i = 0; i < organizations.length; i++) {
      let equal = false;
      for (let x = 0; x < qOrgFilter.length; x++) {
        if (
          qOrgFilter[x]?._id === undefined ||
          organizations[i]?._id.$oid === undefined
        ) {
          break;
        }
        if (qOrgFilter[x]?._id === organizations[i]?._id.$oid) {
          if (
            Number(organizations[i].data_atualizacao.$date) ===
            Number(qOrgFilter[x].data_atualizacao)
          ) {
            equal = true;
          }
        }
      }
      if (equal === false) {
        arrayUpdate.push(organizations[i]);
      }
    }
    if (arrayUpdate.length > 0) {
      await Promise.all(
        arrayUpdate.map(async (item) => {
          if (item?._id.$oid === undefined) {
            return undefined;
          }
          await DBOrganization.updateOrganization({
            data: {
              organizationId: item._id.$oid,
              name: item.nome,
              theme: item.tema,
              ownerEmail: item.dono,
              description: item.descricao,
              updateDate: item.data_atualizacao.$date,
              participantGuests: JSON.stringify(item.convidados_participantes),
              adminGuests: JSON.stringify(item.convidados_administradores),
              participants: JSON.stringify(item.participantes),
              admins: JSON.stringify(item.administradores),
              limitUsers: item.limite_usuarios,
              storageLimit: item.limite_armazenamento,
              deleted: item.deletado,
            },
          });
        })
      );
      return true;
    }
    return false;
  }
  return false;
};

const iconsComparator = async (icons: IIcons[]): Promise<boolean> => {
  const queryIcons = await Promise.all(
    icons.map(async (icon) => {
      const dbQuery = await database.all(
        `SELECT * FROM organizationsIcons WHERE _id = '${icon._id.$oid}'`
      );
      if (dbQuery !== undefined) return <IIconsDatabase>dbQuery[0];
      return undefined;
    })
  );

  const qIconFilter = queryIcons.filter((qIcon) => qIcon !== undefined);

  if (queryIcons.length === 0 && icons.length > 0) {
    await Promise.all(
      icons.map(async (item) => {
        await database.run(
          `INSERT INTO organizationsIcons (_id, icone ) VALUES ('${item._id.$oid}','${item.icone}')`
        );
      })
    );
    return true;
  }

  if (icons.length > qIconFilter.length) {
    const arrayInsert: IIcons[] = [];
    for (let i = 0; i < icons.length; i++) {
      let equal = false;
      for (let x = 0; x < qIconFilter.length; x++) {
        if (qIconFilter[x]?._id === icons[i]._id.$oid) {
          equal = true;
        }
      }
      if (equal === false) {
        arrayInsert.push(icons[i]);
      }
    }

    if (arrayInsert.length > 0) {
      await Promise.all(
        arrayInsert.map(async (item) => {
          await database.run(
            `INSERT INTO organizationsIcons (_id, icone ) VALUES ('${item._id.$oid}','${item.icone}')`
          );
        })
      );
    }
    return true;
  }
  if (queryIcons.length > 0) {
    const arrayUpdate: IIcons[] = [];
    for (let i = 0; i < icons.length; i++) {
      let equal = false;
      for (let x = 0; x < qIconFilter.length; x++) {
        if (qIconFilter[x]?._id === icons[i]._id.$oid) {
          if (String(icons[i].icone) === String(qIconFilter[x]?.icone)) {
            equal = true;
          }
        }
      }
      if (equal === false) {
        arrayUpdate.push(icons[i]);
      }
    }

    if (arrayUpdate.length > 0) {
      await Promise.all(
        arrayUpdate.map(async (item) => {
          await database.all(
            `UPDATE organizationsIcons SET icone = '${item.icone}' WHERE _id = '${item._id.$oid}'`
          );
        })
      );
    }
    if (arrayUpdate.length > 0) {
      return true;
    }
    return false;
  }
  return false;
};

export { organizationComparator, iconsComparator };
