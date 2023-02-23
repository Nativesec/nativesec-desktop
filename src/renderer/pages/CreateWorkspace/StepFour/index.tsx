/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { validateEmail } from 'main/crypto/utils';
import { useState } from 'react';
import Badge from 'renderer/components/Badge';
import Button from 'renderer/components/Buttons/Button';
import ToggleSwitch from 'renderer/components/Buttons/ToggleSwitch';
import InputAnimated from 'renderer/components/Inputs/InputAnimated';
import { StepFourProps } from '../types';
import styles from './styles.module.sass';

const StepFour = ({ users, setUsers, currentTheme }: StepFourProps) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [emailIsValid, setEmailIsValid] = useState<boolean>(true);

  const handleSetEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleAddUser = () => {
    if (validateEmail(email)) {
      if (users.length > 0) {
        users.map((user) => {
          if (user.email === email) {
            setEmailIsValid(false);
          } else {
            setUsers([...users, { email, isAdmin }]);
            setEmail('');
            setEmailIsValid(true);
          }
        });
      } else {
        setUsers([...users, { email, isAdmin }]);
        setEmail('');
        setEmailIsValid(true);
      }
    } else {
      setEmailIsValid(false);
    }
  };

  const handleDeleteUser = (email: string) => {
    const filter = users.filter((user) => {
      if (user.email !== email) {
        return user;
      }
      return undefined;
    });
    setUsers(filter);
  };

  return (
    <div
      className={`${styles.stepFour} ${
        currentTheme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <h3>Convide os membros de seu Workspace</h3>

      <div className={styles.list}>
        <div>
          <h4>Participantes</h4>
          <h4>Administradores</h4>
        </div>
        <div className={styles.emails_container}>
          <div className={styles.emails_list}>
            {users.map((user) => {
              if (user.isAdmin === false) {
                return (
                  <Badge
                    key={user.email}
                    text={user.email}
                    onClick={() => handleDeleteUser(user.email)}
                  />
                );
              }
            })}
          </div>
          <div className={styles.emails_list}>
            {users.map((user) => {
              if (user.isAdmin === true) {
                return (
                  <Badge
                    key={user.email}
                    text={user.email}
                    onClick={() => handleDeleteUser(user.email)}
                  />
                );
              }
            })}
          </div>
        </div>
      </div>
      <div className={styles.email}>
        <div>
          <InputAnimated
            text="Email"
            onChange={handleSetEmail}
            isValid={emailIsValid}
            value={email}
          />
          <div className={styles.email_switch}>
            <ToggleSwitch onChange={(e) => setIsAdmin(e.target.checked)} />
            <p>{isAdmin === true ? 'Administrador' : 'Participante'}</p>
          </div>
          {!emailIsValid && <p className={styles.error}>Email Invalido</p>}
        </div>
        <Button text="Adicionar Membro" onClick={handleAddUser} />
      </div>
    </div>
  );
};

export default StepFour;
