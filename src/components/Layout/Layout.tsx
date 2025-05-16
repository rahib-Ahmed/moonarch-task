import { useState } from 'react';
import { Outlet } from 'react-router';
import { Header } from '../../ui/Header';
import Navbar from '../../ui/NavBar/NavBar';

const Layout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="flex flex-1 flex-col h-screen">
			{/* Fixed Header - always visible */}
			<Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

			<div className="flex flex-1 overflow-hidden">
				{/* Mobile sidebar - overlay when open */}
				<div
					className={`fixed inset-0 bg-opacity-50 z-20 md:hidden transition-opacity duration-300 ${
						sidebarOpen
							? 'opacity-100'
							: 'opacity-0 pointer-events-none'
					}`}
					onClick={() => setSidebarOpen(false)}
				/>

				{/* Sidebar */}
				<div
					className={`fixed md:static w-64 z-30 h-[calc(100vh-64px)] top-16 bg-white shadow-lg transform transition-transform duration-300 rounded-lg ${
						sidebarOpen
							? 'translate-x-0'
							: '-translate-x-full md:translate-x-0'
					}`}
				>
					<Navbar onLinkClick={() => setSidebarOpen(false)} />
				</div>

				{/* Main Content - scrollable */}
				<main className="flex-1 overflow-y-auto px-4 md:px-6 md:ml-0">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default Layout;
