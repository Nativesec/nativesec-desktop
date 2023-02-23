/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useContext, useEffect, useState } from 'react';

import InputAnimated from 'renderer/components/Inputs/InputAnimated';
import { OrganizationsContext } from 'renderer/contexts/organizationsContext/OrganizationsContext';
import { SafeBoxesContext } from 'renderer/contexts/safeBoxesContext/SafeBoxesContext';
import { ThemeContext } from 'renderer/contexts/theme/ThemeContext';
import Create from './Create';

import { ICreateSafeBoxProps, ISelected } from '../types';

import formikData from './Create/formik';
import styles from './styles.module.sass';

export function CreateSafeBox({ isOpen }: ICreateSafeBoxProps) {
  const { currentOrganization } = useContext(OrganizationsContext);
  const { currentSafeBox } = useContext(SafeBoxesContext);
  const { theme } = useContext(ThemeContext);
  const [selected, setSelected] = useState<ISelected>({
    value: -1,
    name: '',
  });
  useEffect(() => {
    if (isOpen === false && currentSafeBox === undefined) {
      setSelected({ value: -1, name: '' });
    }
  }, [isOpen, currentSafeBox]);

  useEffect(() => {
    const myFormik = formikData;
    if (currentSafeBox !== undefined) {
      const type = myFormik.filter(
        (item: any) => item.type === currentSafeBox?.tipo
      );
      setSelected({ value: type[0]?.value, name: type[0]?.name });
    } else {
      setSelected({ value: -1, name: '' });
    }
  }, [currentSafeBox]);

  function handleSelected(select: ISelected) {
    setSelected(select);
  }

  return (
    <div
      className={`${styles.createSafeBox} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <div
        className={`${styles.createWorkspace_content} ${
          selected.value !== -1 ? styles.overflow : ''
        }`}
      >
        <div className={styles.dropdown}>
          <div className={styles.input}>
            <InputAnimated
              type="text"
              className={styles.textBox}
              readOnly
              text="Tipo"
              value={selected?.name || ''}
              disabled={currentSafeBox !== undefined}
              theme={theme}
            />
          </div>
          <div className={styles.option}>
            {formikData.map((item: any) => (
              <div
                onClick={() =>
                  handleSelected({ value: item.value, name: item.name })
                }
                key={item.value}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.selected}>
          {currentOrganization && selected.value > -1 && (
            <Create value={selected.value} organization={currentOrganization} />
          )}
        </div>
      </div>
    </div>
  );
}
