const Loading = () => {
	return (
		<div className="flex items-center justify-center h-screen">
			<svg
				className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
			>
				<circle
					className="opacity-25"
					cx="12"
					cy="12"
					r="10"
					fill="none"
					stroke="currentColor"
					strokeWidth="4"
				/>
				<path
					className="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12zm2.5-1h9a2.5 2.5 0 1 1-9 0z"
				/>
			</svg>
		</div>
	);
};
export default Loading;
