import { useContext, useEffect, useState } from 'react';

import { MdDeleteForever } from 'react-icons/md';
import { BsCheck } from 'react-icons/bs';

import LottieControl from 'renderer/components/LottieControl';
import ButtonOutlined from 'renderer/components/Buttons/ButtonOutlined';

import { OrganizationsContext } from 'renderer/contexts/organizationsContext/OrganizationsContext';
import { ThemeContext } from 'renderer/contexts/theme/ThemeContext';
import loading from '../../../../assets/animationsJson/loading-button.json';
import styles from './styles.module.sass';

export function Invite() {
  const { theme } = useContext(ThemeContext);
  const { organizationsInvites } = useContext(OrganizationsContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [acceptId, setAcceptId] = useState<string>('');

  // useEffect(() => {
  //   if (isCloseModal) {
  //     setIsLoading(false);
  //     setAcceptId('');
  //   }
  // }, [dispath, isCloseModal]);

  function handleAccepted(id: string) {
    setIsLoading(true);
    setAcceptId(id);
    window.electron.ipcRenderer.sendMessage('acceptInvite', {
      organizationId: id,
    });
  }

  function handleDecline(id: string) {
    window.electron.ipcRenderer.sendMessage('declineInvite', {
      organizationId: id,
    });
  }

  return (
    <div
      className={`${styles.invites} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <div className={styles.limit}>
        <div className={styles.container}>
          {organizationsInvites.map((invite) => (
            <div key={invite._id.$oid} className={styles.invite}>
              <p>
                Convite para participar do Workspace: <br />
                <span>{invite.nome}</span>
              </p>
              <div className={styles.buttons}>
                {!isLoading ? (
                  <>
                    <ButtonOutlined
                      Icon={BsCheck}
                      type="button"
                      text="Aceitar"
                      onClick={() => handleAccepted(invite._id.$oid)}
                    />
                    <ButtonOutlined
                      Icon={MdDeleteForever}
                      type="button"
                      text="Rejeitar"
                      onClick={() => handleDecline(invite._id.$oid)}
                    />
                  </>
                ) : (
                  acceptId === invite._id.$oid && (
                    <div className={styles.loading}>
                      <LottieControl animationData={loading} loop play />
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
          {organizationsInvites.length === 0 && (
            <div className={styles.invite}>
              <h3>Não ha convites pendentes</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
