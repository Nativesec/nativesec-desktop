import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.sass';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);
window.electron.ipcRenderer.sendMessage('initialData', []);
