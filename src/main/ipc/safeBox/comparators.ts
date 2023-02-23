/* eslint-disable no-plusplus */
/* eslint-disable array-callback-return */
/* eslint-disable no-underscore-dangle */

import DBSafeBox from '../../database/safebox';
import database from '../../database/database';
import { ISafeBoxDatabase } from '../organizations/types';
import { ISafeBox } from './types';

const safeBoxComparator = async (
  listAPISafeBox: ISafeBox[],
  listDBSafeBox: ISafeBoxDatabase[]
) => {
  const qSafeBoxFilter = (<ISafeBoxDatabase[]>listDBSafeBox).filter(
    (qSafeBox: ISafeBoxDatabase) => qSafeBox !== undefined
  );

  if (qSafeBoxFilter.length === 0 && listAPISafeBox.length > 0) {
    await Promise.all(
      listAPISafeBox.map(async (item) => {
        await DBSafeBox.createSafeBox({
          safeBox: {
            id: item._id.$oid,
            usuarios_leitura: JSON.stringify(item.usuarios_leitura),
            usuarios_escrita: JSON.stringify(item.usuarios_escrita),
            usuarios_escrita_deletado: JSON.stringify(
              item.usuarios_escrita_deletado
            ),
            usuarios_leitura_deletado: JSON.stringify(
              item.usuarios_leitura_deletado
            ),
            data_atualizacao: item.data_atualizacao.$date,
            data_hora_create: item.data_hora_create.$date,
            tipo: item.tipo,
            criptografia: item.criptografia,
            nome: item.nome,
            anexos: JSON.stringify(item.anexos),
            descricao: item.descricao,
            conteudo: item.conteudo,
            organizacao: item.organizacao,
          },
        });
      })
    );
    return true;
  }

  if (listAPISafeBox.length > qSafeBoxFilter.length) {
    const arrayInsert: ISafeBox[] = [];

    for (let i = 0; i < listAPISafeBox.length; i++) {
      let equal = false;
      for (let x = 0; x < qSafeBoxFilter.length; x++) {
        if (qSafeBoxFilter[x]._id === listAPISafeBox[i]._id.$oid) {
          equal = true;
        }
      }
      if (equal === false) {
        arrayInsert.push(listAPISafeBox[i]);
      }
    }

    if (arrayInsert.length > 0) {
      await Promise.all(
        arrayInsert.map(async (item) => {
          await DBSafeBox.createSafeBox({
            safeBox: {
              id: item._id.$oid,
              usuarios_leitura: JSON.stringify(item.usuarios_leitura),
              usuarios_escrita: JSON.stringify(item.usuarios_escrita),
              data_atualizacao: item.data_atualizacao.$date,
              data_hora_create: item.data_hora_create.$date,
              usuarios_escrita_deletado: JSON.stringify(
                item.usuarios_escrita_deletado
              ),
              usuarios_leitura_deletado: JSON.stringify(
                item.usuarios_leitura_deletado
              ),
              tipo: item.tipo,
              criptografia: item.criptografia,
              nome: item.nome,
              anexos: JSON.stringify(item.anexos),
              descricao: item.descricao,
              conteudo: item.conteudo,
              organizacao: item.organizacao,
            },
          });
        })
      );
    }
    return true;
  }

  if (listAPISafeBox.length < qSafeBoxFilter.length) {
    const arrayDelete: ISafeBoxDatabase[] = [];
    for (let i = 0; i < qSafeBoxFilter.length; i++) {
      let equal = false;
      for (let x = 0; x < listAPISafeBox.length; x++) {
        if (qSafeBoxFilter[i]._id === listAPISafeBox[x]._id.$oid) {
          equal = true;
        }
      }
      if (equal === false) {
        arrayDelete.push(qSafeBoxFilter[i]);
      }
    }

    if (arrayDelete.length > 0) {
      await Promise.all(
        arrayDelete.map(async (item) => {
          await DBSafeBox.deleteSafeBox({ safeBoxId: item._id });
        })
      );
    }

    return true;
  }

  if (listAPISafeBox.length > 0) {
    const arrayUpdate: ISafeBox[] = [];
    for (let i = 0; i < listAPISafeBox.length; i++) {
      let equal = false;
      for (let x = 0; x < qSafeBoxFilter.length; x++) {
        if (qSafeBoxFilter[x]._id === listAPISafeBox[i]._id.$oid) {
          if (
            Number(listAPISafeBox[i].data_atualizacao.$date) ===
            Number(qSafeBoxFilter[x].data_atualizacao)
          ) {
            equal = true;
          }
        }
      }
      if (equal === false) {
        arrayUpdate.push(listAPISafeBox[i]);
      }
    }
    if (arrayUpdate.length > 0) {
      await Promise.all(
        arrayUpdate.map((item) => {
          database.all(
            `UPDATE safebox SET
            anexos = '${JSON.stringify(item.anexos)}',
            conteudo = '${item.conteudo}',
            criptografia = '${item.criptografia}',
            data_hora_create = '${item.data_hora_create.$date}',
            data_atualizacao = '${item.data_atualizacao.$date}',
            descricao = '${item.descricao}',
            nome = '${item.nome}',
            tipo = '${item.tipo}',
            usuarios_escrita = '${JSON.stringify(item.usuarios_escrita)}' ,
            usuarios_leitura = '${JSON.stringify(item.usuarios_leitura)}'
            WHERE _id = '${item._id.$oid}'
            AND organizacao = '${item.organizacao}'
            `
          );
        })
      );
      return true;
    }
    return false;
  }
  return false;
};

export default safeBoxComparator;
