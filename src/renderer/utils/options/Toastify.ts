/* eslint-disable @typescript-eslint/ban-types */
import { ToastOptions } from 'react-toastify';

// eslint-disable-next-line import/prefer-default-export
export const toastOptions: ToastOptions<{}> = {
  position: 'bottom-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
  pauseOnFocusLoss: false,
};
