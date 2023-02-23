/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react';
import Dropzone from 'react-dropzone';
import InputAnimated from 'renderer/components/Inputs/InputAnimated';
import browserImageSize from 'browser-image-size';
import uploadImage from '../../../../../assets/images/upload.png';
import { IStepProps } from '../types';

import styles from './styles.module.sass';

const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export function StepTwo({
  errors,
  handleChange,
  handleBlur,
  touched,
  values,
  setFieldValue,
  currentTheme,
}: IStepProps) {
  const [messageError, setMessageError] = useState<string | undefined>(
    undefined
  );
  const handleUploadImage = async (e: File[]) => {
    if (
      e[0].type === 'image/png' ||
      e[0].type === 'image/jpeg' ||
      e[0].type === 'image/jpg'
    ) {
      const imageSize = await browserImageSize(e[0]).then((result: any) => {
        return result;
      });
      if (imageSize.width > 512 || imageSize.height > 512) {
        setMessageError('Tamanho máximo 512x512');
      } else {
        setMessageError(undefined);
        const base64 = await toBase64(e[0]);
        const temp = base64;
        setFieldValue('icon', temp);
      }
    } else {
      setFieldValue('icon', null);
      setMessageError('Formato invalido');
    }
  };

  return (
    <div
      className={`${styles.stepTwo} ${
        currentTheme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <h2>Insira aqui a logo da sua organização</h2>
      <div className={styles.stepTwo_dropzone}>
        <p>Clique ou Arraste a Imagem</p>
        <Dropzone
          onDrop={(acceptedFiles) => {
            handleUploadImage(acceptedFiles);
          }}
        >
          {({ getRootProps, getInputProps, acceptedFiles }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <img src={uploadImage} alt="Enviar Imagem" />
              </div>
              {messageError !== undefined ? (
                <p className={styles.error_file}>{messageError}</p>
              ) : (
                <p className={styles.name_file}>{acceptedFiles[0]?.name}</p>
              )}
              {/* {acceptedFiles.length > 0 ? (
                acceptedFiles[0].type === 'image/png' ||
                acceptedFiles[0].type === 'image/jpeg' ? (
                  <p className={styles.name_file}>{acceptedFiles[0].name}</p>
                ) : (
                  <p className={styles.error_file}>
                    Formato de imagem não suportado
                  </p>
                )
              ) : (
                ''
              )} */}
            </section>
          )}
        </Dropzone>
      </div>
      <InputAnimated
        text="Nome da Organização"
        name="name"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        isValid={!(Boolean(errors.name) && touched.name)}
        theme={currentTheme}
      />
      {errors.name && touched.name && (
        <p className={styles.form_error}>{errors.name as string}</p>
      )}
    </div>
  );
}
