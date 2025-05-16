import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Dashboard />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
