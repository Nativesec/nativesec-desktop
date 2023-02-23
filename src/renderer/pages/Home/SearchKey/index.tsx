/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect } from 'react';
import { Buffer } from 'buffer';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import LottieControl from 'renderer/components/LottieControl';
import { IDefaultApiResult } from 'renderer/types';
import { toastOptions } from 'renderer/utils/options/Toastify';

import { IPCTypes } from 'renderer/@types/IPCTypes';
import { ISearchKeyProps } from '../types';

import * as animationData from '../../../../../assets/animationsJson/key-search.json';

import styles from './styles.module.sass';

const SearchKey = ({ handleSetIsLoading, handleEnter }: ISearchKeyProps) => {
  toast.dismiss('safety-invalid');

  const readFile = (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const onDrop = useCallback(async (acceptedFiles: any) => {
    const result = await readFile(acceptedFiles[0]);
    const buff = Buffer.from(result as string, 'base64').toString('utf-8');
    toast.dismiss('invalidPrivateKey');
    if (
      buff.startsWith('-----BEGIN PGP PRIVATE KEY BLOCK-----') &&
      buff.includes('-----END PGP PRIVATE KEY BLOCK-----')
    ) {
      handleSetIsLoading(true);
      window.electron.ipcRenderer.sendMessage('useIPC', {
        event: IPCTypes.VALIDATE_PRIVATE_KEY,
        data: {
          privateKey: buff,
        },
      });
    } else {
      toast.error('Chave Privada Invalida.', {
        ...toastOptions,
        toastId: 'invalidPrivateKey',
      });
    }
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.once(
      IPCTypes.INITIALIZEDB_INSERTED_PRIVATE_KEY_RESPONSE,
      (result) => {
        const myResult = result as IDefaultApiResult;
        switch (myResult.status) {
          case 200:
            window.electron.ipcRenderer.sendMessage('useIPC', {
              event: IPCTypes.INSERT_DATABASE_KEYS,
            });
            handleEnter();
            break;
          default:
            break;
        }
      }
    );
  }, []);

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop,
  });

  return (
    <div className={styles.home}>
      <LottieControl animationData={animationData} loop play />

      <div className={styles.home_content}>
        <h4>Por favor, insira a sua chave privada.</h4>
        <p>
          A chave privada não foi encontrada em sua máquina e por motivos de
          segurança, não salvamos sua chave nos nossos servidores.
        </p>
        <div className={styles.send_archive} {...getRootProps()}>
          <input {...getInputProps()} />
          <p>Arraste o arquivo chave ou clique aqui.</p>
        </div>
      </div>
    </div>
  );
};

export default SearchKey;
