import { IPCTypes } from '../../../renderer/@types/IPCTypes';
import apiPubKey from '../../API/publicKey/index';
import apiSafeBox from '../../API/safeBox/index';
import DBSafeBox from '../../database/safebox/index';
import { store } from '../../main';
import * as types from './types';
import openpgp from '../../crypto/openpgp';
import { ISafeBox } from './types';
import { ISafeBoxDatabase, IToken } from '../organizations/types';
import { UseIPCData } from '..';

export async function refreshSafeBoxes(arg: UseIPCData) {
  let safeBoxResponse;
  const storeUser = store.get('token') as IToken;
  let lastDateUpdatedSafeBox = 1638290571;

  const listDBSafeBox = await DBSafeBox.listSafeBox({
    organizationId: arg.data.organizationId,
  }).catch(() => {
    return [];
  });

  if (listDBSafeBox.length > 0) {
    const updateDate = listDBSafeBox.map((safeBox) => {
      if (safeBox.data_atualizacao) {
        return Number(safeBox.data_atualizacao);
      }
      return 0;
    });

    lastDateUpdatedSafeBox = Math.max(...updateDate);

    if (!lastDateUpdatedSafeBox) {
      lastDateUpdatedSafeBox = 1638290571;
    }
  }

  const listAPISafeBox = await apiSafeBox
    .listSafeBox({
      organizationId: arg.data.organizationId,
      authorization: `${storeUser?.tokenType} ${storeUser?.accessToken}`,
      date: lastDateUpdatedSafeBox + 1,
    })
    .catch((error) => {
      return {
        status: 401,
        connection: false,
        data: { msg: [] },
      };
    });

  if (listAPISafeBox.status === 401) {
    return {
      response: 'leave-response',
      data: {
        type: 'sessionExpired',
      },
    };
  }

  const listAPISafeBoxesDeleted = await apiSafeBox
    .listSafeBoxesDeleted({
      organizationId: arg.data.organizationId,
      authorization: `${storeUser?.tokenType} ${storeUser?.accessToken}`,
      date: lastDateUpdatedSafeBox - 604800,
    })
    .catch((error) => {
      return {
        status: 401,
        data: {
          msg: [],
        },
      };
    });

  if (listAPISafeBoxesDeleted.status === 401) {
    return {
      response: 'leave-response',
      data: {
        type: 'sessionExpired',
      },
    };
  }

  const filterListAPISafeBox = (listAPISafeBox?.data as any)?.msg.filter(
    (dbSafeBox: ISafeBox) => {
      return !listAPISafeBoxesDeleted?.data?.msg.some(
        (deletedSafeBox: ISafeBox) => {
          return dbSafeBox._id.$oid == deletedSafeBox._id.$oid;
        }
      );
    }
  );

  const listToCreate = filterListAPISafeBox.filter((safebox: ISafeBox) => {
    return !listDBSafeBox.some((dbSafeBox: ISafeBoxDatabase) => {
      return dbSafeBox._id === safebox._id.$oid;
    });
  });

  const filterListToCreate = listToCreate.filter((safebox: ISafeBox) => {
    return listAPISafeBoxesDeleted?.data?.msg.filter(
      (safeBoxDeleted: ISafeBox) => {
        return safeBoxDeleted._id.$oid === safebox._id.$oid;
      }
    );
  });

  const listToUpdate = listDBSafeBox.filter((dbSafeBox) => {
    return filterListAPISafeBox.some((safebox: ISafeBox) => {
      return dbSafeBox._id === safebox._id.$oid;
    });
  });

  const filterListToUpdate = listToUpdate.filter((dbSafeBox) => {
    return listAPISafeBoxesDeleted?.data?.msg.filter(
      (safeBoxDeleted: ISafeBox) => {
        return dbSafeBox._id === safeBoxDeleted._id.$oid;
      }
    );
  });

  let listToDelete: ISafeBox[] = [];

  if (listAPISafeBoxesDeleted.data?.msg.length > 0) {
    listToDelete = listAPISafeBoxesDeleted?.data?.msg.filter(
      (safebox: ISafeBox) => {
        return listDBSafeBox.filter((dbSafeBox) => {
          return dbSafeBox._id === safebox._id.$oid;
        });
      }
    );
  }

  if (filterListToUpdate.length > 0) {
    safeBoxResponse = true;
    const safeBoxInfo: ISafeBox[] = await Promise.all(
      filterListToUpdate.map(async (safebox) => {
        const APIGetSafeBox = await apiSafeBox.getSafeBox({
          authorization: `${storeUser?.tokenType} ${storeUser?.accessToken}`,
          safeBoxId: safebox._id,
          organizationId: arg.data.organizationId,
        });

        return APIGetSafeBox?.data?.msg[0];
      })
    );

    await Promise.all(
      safeBoxInfo.map(async (safebox: ISafeBox) => {
        return DBSafeBox.updateSafeBox({
          newSafeBox: {
            ...safebox,
            anexos: JSON.stringify(safebox.anexos),
            data_hora_create: safebox.data_hora_create.$date,
            data_atualizacao: safebox.data_atualizacao.$date,
            usuarios_escrita_deletado: JSON.stringify(
              safebox.usuarios_escrita_deletado
            ),
            usuarios_leitura_deletado: JSON.stringify(
              safebox.usuarios_leitura_deletado
            ),
            usuarios_escrita: JSON.stringify(safebox.usuarios_escrita),
            usuarios_leitura: JSON.stringify(safebox.usuarios_leitura),
            id: safebox._id.$oid,
          },
        });
      })
    );
  }

  if (filterListToCreate.length > 0) {
    safeBoxResponse = true;
    const safeBoxInfo: ISafeBox[] = await Promise.all(
      filterListToCreate.map(async (safebox: ISafeBox) => {
        const APIGetSafeBox = await apiSafeBox.getSafeBox({
          authorization: `${storeUser?.tokenType} ${storeUser?.accessToken}`,
          safeBoxId: safebox._id.$oid,
          organizationId: arg.data.organizationId,
        });

        return APIGetSafeBox?.data?.msg[0];
      })
    );

    await Promise.all(
      safeBoxInfo.map(async (safebox: ISafeBox) => {
        return DBSafeBox.createSafeBox({
          safeBox: {
            ...safebox,
            anexos: JSON.stringify(safebox.anexos),
            data_hora_create: safebox.data_hora_create.$date,
            data_atualizacao: safebox.data_atualizacao.$date,
            usuarios_escrita_deletado: JSON.stringify(
              safebox.usuarios_escrita_deletado
            ),
            usuarios_leitura_deletado: JSON.stringify(
              safebox.usuarios_leitura_deletado
            ),
            usuarios_escrita: JSON.stringify(safebox.usuarios_escrita),
            usuarios_leitura: JSON.stringify(safebox.usuarios_leitura),
            id: safebox._id.$oid,
          },
        });
      })
    );
  }

  if (listToDelete.length > 0) {
    safeBoxResponse = true;
    await Promise.all(
      listToDelete.map(async (safeBoxDelete: ISafeBox) => {
        return DBSafeBox.deleteSafeBox({ safeBoxId: safeBoxDelete._id.$oid });
      })
    );
  }

  const dbListSafeBox = await DBSafeBox.listSafeBox({
    organizationId: arg.data.organizationId,
  });
  store.set('safebox', dbListSafeBox);

  return {
    response: IPCTypes.REFRESH_SAFEBOXES_RESPONSE,
    data: {
      safeBoxResponse,
    },
  };
}

const safeBox = [
  {
    async createSafeBox(
      event: Electron.IpcMainEvent,
      arg: types.ICreateSafeBox
    ) {
      const { accessToken, tokenType } = store.get('token') as IToken;
      const users = [...arg.usuarios_escrita, ...arg.usuarios_leitura];
      let content = {};

      const pubKeys = await Promise.all(
        users.map(async (email): Promise<string[] | unknown> => {
          try {
            const apiGetPubKey = await apiPubKey.getPublicKey({
              email,
              authorization: `${tokenType} ${accessToken}`,
            });
            if (
              apiGetPubKey.status === 200 &&
              apiGetPubKey.data?.status === 'ok'
            ) {
              return apiGetPubKey.data.msg[0].chave as string;
            }
            return undefined;
          } catch (error) {
            console.log(error);
            return undefined;
          }
        })
      ).then((result) => {
        return result;
      });
      await Promise.all(
        arg.conteudo.map(async (item: any) => {
          if (item.crypto === false) {
            content = {
              ...content,
              [`${item.name}`]: item[`${item.name}`],
            };
          } else {
            const encrypted = await openpgp.encrypt({
              message: item[`${item.name}`],
              publicKeysArmored: pubKeys as string[],
            });

            content = {
              ...content,
              [`${item.name}`]: encrypted.encryptedMessage,
            };
          }
        })
      ).then(() => {
        return content;
      });

      const APICreateSafeBox = await apiSafeBox.createSafeBox({
        newSafeBox: {
          ...arg,
          conteudo: JSON.stringify(content),
          anexos: [],
        },
        authorization: `${tokenType} ${accessToken} `,
      });

      if (
        APICreateSafeBox.status === 200 &&
        APICreateSafeBox.data?.status === 'ok' &&
        APICreateSafeBox.data.detail
      ) {
        const create = await DBSafeBox.createSafeBox({
          safeBox: {
            ...arg,
            id: APICreateSafeBox.data?.detail[0]._id.$oid,
            conteudo: JSON.stringify(content),
            data_hora_create:
              APICreateSafeBox.data.detail[0].data_hora_create.$date,
            data_atualizacao: APICreateSafeBox.data.detail[0].data_atualizacao,
            usuarios_escrita: JSON.stringify(arg.usuarios_escrita),
            usuarios_leitura: JSON.stringify(arg.usuarios_leitura),
            usuarios_escrita_deletado: JSON.stringify(
              arg.usuarios_escrita_deletado
            ),
            usuarios_leitura_deletado: JSON.stringify(
              arg.usuarios_leitura_deletado
            ),
            anexos: JSON.stringify([]),
          },
        });
        if (create !== true) {
          return event.reply('createSafeBox-response', {
            status: 500,
            data: 'error database',
          });
        }
      }

      const listSafeBox = await DBSafeBox.listSafeBox({
        organizationId: arg.organizacao,
      });

      store.set('safebox', listSafeBox);

      return event.reply('createSafeBox-response', {
        status: APICreateSafeBox.status,
        data: APICreateSafeBox.data,
      });
    },
  },
  {
    async getSafeBoxes(event: Electron.IpcMainEvent, arg: types.IGetSafeBox) {
      const dbGetAllSafeBox = await DBSafeBox.listSafeBox({
        organizationId: arg.organizationId,
      });

      store.set('safebox', dbGetAllSafeBox);
      event.reply(IPCTypes.GET_SAFE_BOXES_RESPONSE, {});
    },
  },
  {
    async getSafeBox(event: Electron.IpcMainEvent, arg: types.IGetSafeBox[]) {
      const listDBSafeBox = await DBSafeBox.getSafeBox({
        organizationId: arg[0].organizationId,
        safeBoxId: arg[0].safeBoxId,
      });
      event.reply('getSafeBox-response', {
        safeBox: listDBSafeBox,
      });
    },
  },
  {
    async updateSafeBox(
      event: Electron.IpcMainEvent,
      arg: types.IChangeSafeBox[]
    ) {
      const { accessToken, tokenType } = store.get('token') as IToken;
      const users = [...arg[0].usuarios_escrita, ...arg[0].usuarios_leitura];
      let content = {};
      const pubKeys = await Promise.all(
        users.map(async (email): Promise<string[] | unknown> => {
          try {
            const apiGetPubKey = await apiPubKey.getPublicKey({
              email,
              authorization: `${tokenType} ${accessToken}`,
            });

            if (
              apiGetPubKey.status === 200 &&
              apiGetPubKey?.data?.status === 'ok'
            ) {
              return apiGetPubKey?.data?.msg[0].chave;
            }
            return undefined;
          } catch (error) {
            console.log(error);
            return undefined;
          }
        })
      ).then((result) => {
        return result;
      });

      await Promise.all(
        arg[0].conteudo.map(async (item: any) => {
          if (item.crypto === false) {
            content = {
              ...content,
              [`${item.name}`]: item[`${item.name}`],
            };
          } else {
            const encrypted = await openpgp.encrypt({
              message: item[`${item.name}`],
              publicKeysArmored: pubKeys as string[],
            });

            content = {
              ...content,
              [`${item.name}`]: encrypted.encryptedMessage,
            };
          }
        })
      ).then(() => {
        return content;
      });

      const apiChangeSafeBox = await apiSafeBox.changeSafeBox({
        newSafeBox: {
          ...arg[0],
          conteudo: JSON.stringify(content),
          anexos: JSON.stringify([]),
        },
        authorization: `${tokenType} ${accessToken}`,
      });

      if (
        apiChangeSafeBox.status === 200 &&
        apiChangeSafeBox.data?.status === 'ok'
      ) {
        const update = await DBSafeBox.updateSafeBox({
          newSafeBox: {
            ...arg[0],
            conteudo: JSON.stringify(content),
            usuarios_escrita: JSON.stringify(arg[0].usuarios_escrita),
            usuarios_leitura: JSON.stringify(arg[0].usuarios_leitura),
            usuarios_escrita_deletado: JSON.stringify(
              arg[0].usuarios_escrita_deletado
            ),
            usuarios_leitura_deletado: JSON.stringify(
              arg[0].usuarios_leitura_deletado
            ),
            anexos: JSON.stringify([]),
            data_hora_create: arg[0].data_hora_create,
            data_atualizacao: arg[0].data_atualizacao,
          },
        });

        if (update !== true) {
          return event.reply('updateSafeBox-response', {
            status: 500,
            data: 'erro database',
            safeBoxId: arg[0].id,
          });
        }
      }

      const listSafeBox = await DBSafeBox.listSafeBox({
        organizationId: arg[0].organizacao,
      });

      store.set('safebox', listSafeBox);

      return event.reply('updateSafeBox-response', {
        status: apiChangeSafeBox.status,
        data: apiChangeSafeBox.data,
        safeBoxId: arg[0].id,
      });
    },
  },
  {
    async deleteSafeBox(
      event: Electron.IpcMainEvent,
      arg: types.IDeleteSafeBox
    ) {
      const { accessToken, tokenType } = store.get('token') as IToken;

      const del = await apiSafeBox.deleteSafeBox({
        authorization: `${tokenType} ${accessToken}`,
        organizationId: arg.organizationId,
        safeBoxId: arg.safeBoxId,
      });

      if (del.status === 200 && del?.data?.status === 'ok') {
        const dbDel = await DBSafeBox.deleteSafeBox({
          safeBoxId: arg.safeBoxId,
        });
        if (dbDel !== true) {
          return event.reply('deleteSafeBox-response', {
            status: del.status,
            data: del.data,
          });
        }
      }

      const getDBSafeBox = await DBSafeBox.listSafeBox({
        organizationId: arg.organizationId,
      });

      store.set('safebox', getDBSafeBox);

      return event.reply('deleteSafeBox-response', {
        status: del.status,
        data: del.data,
        deletedId: arg.safeBoxId,
      });
    },
  },
];

export default safeBox;
