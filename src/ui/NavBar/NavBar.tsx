import { Bolt, FolderKanban, LayoutDashboard } from 'lucide-react';
import { NavLink } from 'react-router';

type NavbarProps = {
	onLinkClick: () => void;
};

const Navbar = ({ onLinkClick }: NavbarProps) => {
	return (
		<nav className="p-4 h-full rounded-lg bg-light-black">
			<ul className="space-y-2">
				<li>
					<NavLink
						to="/"
						className={({ isActive }) =>
							`flex items-center gap-2.5 p-2 rounded-lg ${isActive ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`
						}
						onClick={onLinkClick}
					>
						<LayoutDashboard />
						Dashboard
					</NavLink>
				</li>
				<li>
					<NavLink
						to="/projects"
						className={({ isActive }) =>
							`flex items-center gap-2.5 p-2 rounded-lg ${isActive ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100 hover:text-black'}`
						}
						onClick={onLinkClick}
					>
						<FolderKanban />
						Projects
					</NavLink>
				</li>
				<li>
					<NavLink
						to="/settings"
						className={({ isActive }) =>
							`flex items-center gap-2.5 p-2 rounded-lg ${isActive ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100 hover:text-black'}`
						}
						onClick={onLinkClick}
					>
						<Bolt />
						Settings
					</NavLink>
				</li>
			</ul>
		</nav>
	);
};

export default Navbar;
