import { AlignJustify } from 'lucide-react';
import './header.css';

type HeaderProps = {
	onMenuClick: () => void;
};

const Header = ({ onMenuClick }: HeaderProps) => {
	return (
		<header className="text-white h-16">
			<div className="h-full px-4 flex items-center align-middle md:justify-start">
				<div>
					{/* Mobile menu button */}
					<button
						className="md:hidden p-2 rounded-md hover:bg-indigo-700"
						onClick={onMenuClick}
					>
						<AlignJustify />
					</button>
				</div>
				<div className="flex-1">
					<h1 className="text-xl font-bold text-center md:text-3xl md:text-start">
						Moonarch Demo
					</h1>
				</div>
			</div>
		</header>
	);
};

export default Header;
