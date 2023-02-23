/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState } from 'react';

import { MdDeleteForever } from 'react-icons/md';

import { IUser } from 'main/types';
import { OrganizationsContext } from 'renderer/contexts/organizationsContext/OrganizationsContext';
import { ThemeContext } from 'renderer/contexts/theme/ThemeContext';
import { DeleteInviteModal } from './DeleteInviteModal';
import { RemoveUserModal } from './RemoveUserModal';

import * as types from '../types';

import styles from './styles.module.sass';

export function Members() {
  const { myEmail } = window.electron.store.get('user') as IUser;
  const { currentOrganization } = useContext(OrganizationsContext);
  const { theme } = useContext(ThemeContext);
  const [deleteUser, setDeleteUser] = useState<types.IDeleteUser | undefined>(
    undefined
  );
  const permissionDeleteUser =
    JSON.parse(currentOrganization?.participantes as string).filter(
      (email: string) => email === myEmail
    ).length === 0;

  const [modalDeleteInviteIsOpen, setModalDeleteInviteIsOpen] =
    useState<boolean>(false);

  const [modalRemoveUserIsOpen, setModalRemoveUserIsOpen] =
    useState<boolean>(false);

  const handleOpenModal = ({ email, type }: types.IDeleteUser) => {
    setDeleteUser({ email, type });
    setModalDeleteInviteIsOpen(true);
  };

  const handleCloseModal = () => {
    setDeleteUser(undefined);
    setModalDeleteInviteIsOpen(false);
  };

  const handleOpenRemoveUserModal = ({ email, type }: types.IRemoveUser) => {
    setDeleteUser({ email, type });
    setModalRemoveUserIsOpen(true);
  };

  const handleCloseRemoveUserModal = () => {
    setDeleteUser(undefined);
    setModalRemoveUserIsOpen(false);
  };

  return (
    <>
      <DeleteInviteModal
        onRequestClose={handleCloseModal}
        isOpen={modalDeleteInviteIsOpen}
        user={deleteUser}
        orgId={currentOrganization?._id as string}
        currentTheme={theme}
      />
      <RemoveUserModal
        onRequestClose={handleCloseRemoveUserModal}
        isOpen={modalRemoveUserIsOpen}
        user={deleteUser}
        orgId={currentOrganization?._id as string}
        currentTheme={theme}
      />
      <div
        className={`${styles.members} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
      >
        <div className={styles.participant_box}>
          <h4>Participantes</h4>
          <div className={styles.participant}>
            <div className={styles.imgProfile}>
              {currentOrganization?.dono?.charAt(0)}
            </div>
            <div className={styles.info}>
              <p className={styles.user}>{currentOrganization?.dono}</p>
              <p>Dono</p>
            </div>
          </div>
          {JSON.parse(currentOrganization?.administradores as string)?.map(
            (member: string) => (
              <div className={styles.participant} key={member}>
                <div className={styles.imgProfile}>{member?.charAt(0)}</div>
                <div className={styles.info}>
                  <p className={styles.user}>{member}</p>
                  <p>Administrador</p>
                  {member !== myEmail && permissionDeleteUser && (
                    <div className={styles.delete}>
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenRemoveUserModal({
                            email: member,
                            type: 'admin',
                          })
                        }
                      >
                        <MdDeleteForever />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          )}
          {JSON.parse(currentOrganization?.participantes as string)?.map(
            (member: string) => (
              <div className={styles.participant} key={member}>
                <div className={styles.imgProfile}>{member?.charAt(0)}</div>
                <div className={styles.info}>
                  <p className={styles.user}>{member}</p>
                  <p>Participante</p>
                  {permissionDeleteUser && (
                    <div className={styles.delete}>
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenRemoveUserModal({
                            email: member,
                            type: 'participant',
                          })
                        }
                      >
                        <MdDeleteForever />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>
        <div className={styles.members_box}>
          <h4>Convidados</h4>
          {JSON.parse(
            currentOrganization?.convidados_administradores as string
          ).map(
            (user: string) =>
              user.length > 0 && (
                <div className={styles.participant} key={user}>
                  <div className={styles.imgProfile}>{user.charAt(0)}</div>
                  <div className={styles.info}>
                    <p className={styles.user}>{user}</p>
                    <p>Administrador</p>
                  </div>
                  {permissionDeleteUser && (
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenModal({ email: user, type: 'admin' })
                      }
                    >
                      <MdDeleteForever />
                    </button>
                  )}
                </div>
              )
          )}
          {JSON.parse(
            currentOrganization?.convidados_participantes as string
          ).map(
            (user: string) =>
              user.length > 0 && (
                <div className={styles.participant} key={user}>
                  <div className={styles.imgProfile}>{user.charAt(0)}</div>
                  <div className={styles.info}>
                    <p className={styles.user}>{user}</p>
                    <p>Participante</p>
                  </div>
                  {permissionDeleteUser && (
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenModal({ email: user, type: 'participant' })
                      }
                    >
                      <MdDeleteForever />
                    </button>
                  )}
                </div>
              )
          )}
        </div>
      </div>
    </>
  );
}
