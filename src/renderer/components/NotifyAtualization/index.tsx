import ReactModal from 'react-modal';
import { BsFillExclamationCircleFill } from 'react-icons/bs';
import { INotifyAtualizationProps } from './types';
import styles from './styles.module.sass';
import Button from '../Buttons/Button';

const NotifyAtualization = ({
  onRequestClose,
  isOpen,
  handleSetUpdateTimer,
}: INotifyAtualizationProps) => {
  const handleQuitAndInstall = () => {
    window.electron.ipcRenderer.sendMessage('updateQuitAndInstall', []);
  };

  const handleLater = () => {
    handleSetUpdateTimer();
    onRequestClose();
  };

  return (
    <ReactModal
      onRequestClose={onRequestClose}
      isOpen={isOpen}
      overlayClassName={styles.reactModalOverlay}
      className={styles.reactModalContent}
      shouldCloseOnOverlayClick={false}
    >
      <div className={styles.notify}>
        <BsFillExclamationCircleFill />
        <h2>Atualização disponivel para instalação.</h2>
        <div className={styles.buttons}>
          <Button text="Reiniciar agora" onClick={handleQuitAndInstall} />
          <Button text="Reiniciar mais tarde" onClick={handleLater} />
        </div>
      </div>
    </ReactModal>
  );
};

export default NotifyAtualization;
