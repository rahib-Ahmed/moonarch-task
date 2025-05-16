import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';

import App from './App.tsx';
import { Provider } from 'react-redux';
import store from './store/index';
import { DashboardProvider } from './context/DashboardContext.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Provider store={store}>
			<DashboardProvider>
				<App />
			</DashboardProvider>
		</Provider>
	</StrictMode>
);
