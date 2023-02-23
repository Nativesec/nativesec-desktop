/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-plusplus */

import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Buffer from 'buffer';

import { BsArrowDown } from 'react-icons/bs';
import ButtonOutlined from 'renderer/components/Buttons/ButtonOutlined';
import ToggleSwitch from 'renderer/components/Buttons/ToggleSwitch';
import { toastOptions } from 'renderer/utils/options/Toastify';

import { IKeys, IUser } from 'main/types';
import { IDefaultApiResult } from 'renderer/types';

import { IUserConfig } from 'main/ipc/user/types';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { ThemeContext } from 'renderer/contexts/theme/ThemeContext';
import { IUsersSettingsProps } from '../Workspace/types';

import styles from './styles.module.sass';

export function UserSettings({
  handleRefreshTime,
  refreshTime,
}: IUsersSettingsProps) {
  const { changeTheme, theme } = useContext(ThemeContext);

  const [savePrivateKey, setSavePrivateKey] = useState<string>(
    window.electron.store.get('userConfig').savePrivateKey
  );

  useEffect(() => {
    setSavePrivateKey(window.electron.store.get('userConfig').savePrivateKey);
  }, []);

  const handleTheme = () => {
    const userConfig = window.electron.store.get('userConfig') as IUserConfig;
    const newTheme = userConfig.theme === 'dark' ? 'light' : 'dark';
    window.electron.ipcRenderer.sendMessage('useIPC', {
      event: IPCTypes.UPDATE_USER_CONFIG,
      data: {
        ...userConfig,
        theme: newTheme,
      },
    });
    changeTheme(newTheme);
  };

  const handleChangeTime = (value: any) => {
    handleRefreshTime(value);
  };

  const saveFile = (privateKey: string) => {
    const { myEmail } = window.electron.store.get('user') as IUser;
    const byteCharacters = Buffer.Buffer.from(privateKey, 'utf-8').toString(
      'base64'
    );
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const element = document.createElement('a');
    const temp = new Blob([byteArray]);
    element.href = URL.createObjectURL(temp);
    element.download = myEmail;
    element.click();
  };

  const handleExportKey = () => {
    const { privateKey } = window.electron.store.get('keys') as IKeys;
    saveFile(privateKey);
  };

  const handleSavePrivateKey = () => {
    setSavePrivateKey((state) => (state === 'true' ? 'false' : 'true'));
    if (savePrivateKey !== 'true') {
      window.electron.ipcRenderer.sendMessage('saveAPIPrivateKey', []);
    } else {
      window.electron.ipcRenderer.sendMessage('deleteAPIPrivateKey', []);
    }
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('saveAPIPrivateKey-response', (result) => {
      const myResult = result as IDefaultApiResult;
      if (myResult.status !== 200 && myResult.data?.msg !== 'ok') {
        toast.error('Erro ao salvar chaves.', {
          ...toastOptions,
          toastId: 'erroSavePrivateKey',
        });
      }
    });
  }, []);

  return (
    <div
      className={`${styles.userSettings} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <div className={styles.box}>
        <div className={styles.keys}>
          <div>
            <h4>Exportar Chave</h4>
            <p>
              Exporte sua chave de segurança para posteriormente importa-la em
              outro dispositivo ou nova instalação.
            </p>
          </div>
          <ButtonOutlined
            text="exportar chave"
            Icon={BsArrowDown}
            onClick={handleExportKey}
          />
        </div>
        <div className={styles.container}>
          <div className={styles.options}>
            <div className={styles.optionsContainer}>
              <h4>Atualização</h4>
              <div className={styles.option}>
                <div className={styles.optionContent}>
                  <div className={styles.title}>
                    <p>Tempo de atualização dos Cofres</p>
                  </div>
                  <select
                    value={refreshTime}
                    onChange={(e) => handleChangeTime(e.target.value)}
                  >
                    <option value="30">30 Segundos</option>
                    <option value="60">1 Minuto</option>
                    <option value="300">5 Minutos</option>
                  </select>
                </div>
              </div>
              <h4>Segurança</h4>
              <div
                className={`${styles.option} ${
                  savePrivateKey === 'true' ? styles.active : ''
                } ${styles.optionClickable}`}
                onClick={handleSavePrivateKey}
              >
                <div className={styles.optionContent}>
                  <div className={styles.title}>
                    <p>
                      Salvar sua chave de segurança nos
                      <br /> servidores do NativeSec.{' '}
                    </p>
                  </div>
                  <ToggleSwitch
                    value={savePrivateKey === 'true' ? 'true' : 'false'}
                    checked={savePrivateKey === 'true'}
                    onChange={() => {}}
                  />
                </div>
                {savePrivateKey === 'false' ? (
                  <p className={styles.warning}>
                    Com a opção de salvar chave desativada recomendamos exportar
                    sua chave e salvar em um lugar seguro, para posteriormente
                    realizar login em outra maquina
                  </p>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
          <div className={styles.options}>
            <div className={styles.optionsContainer}>
              <h4>Aparencia</h4>
              <div
                className={`${styles.option} ${
                  theme === 'dark' ? styles.active : ''
                } ${styles.optionClickable}`}
                onClick={handleTheme}
              >
                <div className={styles.optionContent}>
                  <div className={styles.title}>
                    <p>Defina um Tema</p>
                  </div>
                  <ToggleSwitch
                    value={theme === 'dark' ? 'true' : 'false'}
                    checked={theme === 'dark'}
                    onChange={() => {}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
