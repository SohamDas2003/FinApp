import React, { useState, useEffect } from "react";
import {
	FaChartLine,
	FaWallet,
	FaExchangeAlt,
	FaRegCreditCard,
	FaCog,
	FaRegCalendarAlt,
	FaArrowUp,
	FaArrowDown,
	FaLightbulb,
} from "react-icons/fa";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import "./styles/App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Income from "./components/Income";
import Expenses from "./components/Expenses";
import Investments from "./components/Investments";
import Goals from "./components/Goals";
import Settings from "./components/Settings";
import ProfileSetup from "./components/ProfileSetup";
import Cards from "./components/Cards";
import Account from "./components/Account";

// Register ChartJS components
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend
);

// Profile image placeholder
const defaultProfileImage =
	"https://th.bing.com/th/id/R.95c74e73a0802296ef631dd71dfa09d2?rik=eIiF8VmPmhhzXw&riu=http%3a%2f%2fwww.pngall.com%2fwp-content%2fuploads%2f5%2fUser-Profile-PNG-Image.png&ehk=YvjAOG2T71oFU41G13CCoak98yJU3f0YK669MQiOROg%3d&risl=&pid=ImgRaw&r=0";

// Shared Layout component
const SharedLayout = ({ user, onLogout, onNavigate, currentPage, children }) => {
	return (
		<div className="dashboard-container">
			{/* Sidebar */}
			<div className="sidebar">
				<div className="sidebar-header">
					<h2>FinApp</h2>
				</div>
				<div className="profile-section">
					<img
						src={user.profilePic}
						alt="Profile"
						className="profile-image"
					/>
					<h3>{user.name}</h3>
					<p>{user.email}</p>
				</div>
				<div className="menu-items">
					<div
						className={`menu-item ${currentPage === "dashboard" ? "active" : ""}`}
						onClick={() => onNavigate("dashboard")}
					>
						<FaChartLine />
						<span>Dashboard</span>
					</div>
					<div
						className={`menu-item ${currentPage === "income" ? "active" : ""}`}
						onClick={() => onNavigate("income")}
					>
						<FaWallet />
						<span>Income</span>
					</div>
					<div
						className={`menu-item ${currentPage === "expenses" ? "active" : ""}`}
						onClick={() => onNavigate("expenses")}
					>
						<FaExchangeAlt />
						<span>Expenses</span>
					</div>
					<div
						className={`menu-item ${currentPage === "cards" ? "active" : ""}`}
						onClick={() => onNavigate("cards")}
					>
						<FaRegCreditCard />
						<span>Cards</span>
					</div>
					<div
						className={`menu-item ${currentPage === "investments" ? "active" : ""}`}
						onClick={() => onNavigate("investments")}
					>
						<FaWallet />
						<span>Investments</span>
					</div>
					<div
						className={`menu-item ${currentPage === "account" ? "active" : ""}`}
						onClick={() => onNavigate("account")}
					>
						<FaCog />
						<span>Account</span>
					</div>
				</div>
				<div className="logout-button" onClick={onLogout}>
					<FaSignOutAlt />
					<span>Logout</span>
				</div>
			</div>
			
			{/* Main Content */}
			<div className="main-content">
				{children}
			</div>
		</div>
	);
};

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [showLogin, setShowLogin] = useState(true);
	const [currentUser, setCurrentUser] = useState(null);
	const [currentPage, setCurrentPage] = useState("dashboard");
	const [activeTab, setActiveTab] = useState("overview");
	const [activeFilter, setActiveFilter] = useState("all");
	const [needsProfileSetup, setNeedsProfileSetup] = useState(false);

	const handleLogin = (userData) => {
		// Ensure profile image is set
		const userWithProfile = {
			...userData,
			profilePic: userData.profilePic || defaultProfileImage,
		};

		// Check if user has completed profile setup
		const registeredUsers = JSON.parse(
			localStorage.getItem("finapp_users") || "[]"
		);
		const user = registeredUsers.find((u) => u.email === userWithProfile.email);

		if (user && user.financialDetails) {
			// User has completed profile setup
			setCurrentUser({
				...userWithProfile,
				financialDetails: user.financialDetails,
			});
			setIsAuthenticated(true);
			setNeedsProfileSetup(false);
		} else {
			// User needs to complete profile setup
			setCurrentUser(userWithProfile);
			setIsAuthenticated(false);
			setNeedsProfileSetup(true);
		}

		// Store user data in localStorage for persistence
		localStorage.setItem("finapp_user", JSON.stringify(userWithProfile));
	};

	const handleRegister = (userData) => {
		// Ensure profile image is set for new registrations
		const userWithProfile = {
			...userData,
			profilePic: userData.profilePic || defaultProfileImage,
		};

		setCurrentUser(userWithProfile);
		setIsAuthenticated(false);
		setNeedsProfileSetup(true);

		// Store user data in localStorage
		localStorage.setItem("finapp_user", JSON.stringify(userWithProfile));
	};

	const handleProfileSetupComplete = (updatedUserData) => {
		setCurrentUser(updatedUserData);
		setIsAuthenticated(true);
		setNeedsProfileSetup(false);
	};

	const handleLogout = () => {
		setCurrentUser(null);
		setIsAuthenticated(false);
		setNeedsProfileSetup(false);
		// Clear user data from localStorage
		localStorage.removeItem("finapp_user");
	};

	const handleNavigate = (page) => {
		setCurrentPage(page);
	};

	// Check if user is already logged in (from localStorage)
	useEffect(() => {
		const storedUser = localStorage.getItem("finapp_user");
		if (storedUser) {
			const userData = JSON.parse(storedUser);

			// Ensure profile image is set for stored user data
			const userWithProfile = {
				...userData,
				profilePic: userData.profilePic || defaultProfileImage,
			};

			// First check if the user data already has financialDetails directly
			if (userWithProfile.financialDetails) {
				setCurrentUser(userWithProfile);
				setIsAuthenticated(true);
				setNeedsProfileSetup(false);
				// Update localStorage with profile image if needed
				if (!userData.profilePic) {
					localStorage.setItem("finapp_user", JSON.stringify(userWithProfile));
				}
				return;
			}

			// Otherwise check in the registered users
			const registeredUsers = JSON.parse(
				localStorage.getItem("finapp_users") || "[]"
			);
			const user = registeredUsers.find(
				(u) => u.email === userWithProfile.email
			);

			if (user && user.financialDetails) {
				// User has completed profile setup
				const updatedUser = {
					...userWithProfile,
					financialDetails: user.financialDetails,
				};
				setCurrentUser(updatedUser);
				setIsAuthenticated(true);
				setNeedsProfileSetup(false);
				// Update localStorage with profile image if needed
				if (!userData.profilePic) {
					localStorage.setItem("finapp_user", JSON.stringify(updatedUser));
				}
			} else {
				// User needs to complete profile setup
				setCurrentUser(userWithProfile);
				setIsAuthenticated(false);
				setNeedsProfileSetup(true);
				// Update localStorage with profile image if needed
				if (!userData.profilePic) {
					localStorage.setItem("finapp_user", JSON.stringify(userWithProfile));
				}
			}
		}
	}, []);

	// Debug log to track state (remove in production)
	console.log({
		isAuthenticated,
		needsProfileSetup,
		currentUser: currentUser?.email,
		currentPage,
	});

	// Determine which component to show
	if (currentUser && needsProfileSetup) {
		return (
			<ProfileSetup
				user={currentUser}
				onComplete={handleProfileSetupComplete}
			/>
		);
	}

	if (isAuthenticated && currentUser) {
		let pageContent;
		
		switch (currentPage) {
			case "income":
				pageContent = <Income user={currentUser} />;
				break;
			case "expenses":
				pageContent = <Expenses user={currentUser} />;
				break;
			case "investments":
				return (
					<Investments
						user={currentUser}
						onLogout={handleLogout}
						onNavigate={handleNavigate}
					/>
				);
			case "dashboard":
			default:
				pageContent = <Dashboard user={currentUser} />;
				break;
		}
		
		return (
			<SharedLayout 
				user={currentUser} 
				onLogout={handleLogout} 
				onNavigate={handleNavigate}
				currentPage={currentPage}
			>
				{pageContent}
			</SharedLayout>
		);
	}

	// Show either login or register form
	return showLogin ? (
		<Login
			onLogin={handleLogin}
			switchToRegister={() => setShowLogin(false)}
		/>
	) : (
		<Register
			onRegister={handleRegister}
			switchToLogin={() => setShowLogin(true)}
		/>
	);
}

export default App;
