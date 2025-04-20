import React, { useState } from "react";
import { FaUser, FaLock, FaArrowRight } from "react-icons/fa";
import "../styles/Auth.css";

// Default profile image
const defaultProfileImage =
	"https://th.bing.com/th/id/R.95c74e73a0802296ef631dd71dfa09d2?rik=eIiF8VmPmhhzXw&riu=http%3a%2f%2fwww.pngall.com%2fwp-content%2fuploads%2f5%2fUser-Profile-PNG-Image.png&ehk=YvjAOG2T71oFU41G13CCoak98yJU3f0YK669MQiOROg%3d&risl=&pid=ImgRaw&r=0";

const Login = ({ onLogin, switchToRegister }) => {
	const [credentials, setCredentials] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setCredentials({
			...credentials,
			[name]: value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		// Basic validation
		if (!credentials.email || !credentials.password) {
			setError("Please fill in all fields");
			return;
		}

		// Check in our "database" (localStorage)
		const registeredUsers = JSON.parse(
			localStorage.getItem("finapp_users") || "[]"
		);

		// Add demo user if it doesn't exist
		if (!registeredUsers.some((user) => user.email === "demo@example.com")) {
			registeredUsers.push({
				name: "Demo User",
				email: "demo@example.com",
				password: "password",
				profilePic: defaultProfileImage,
				// Add financialDetails to demo user so it doesn't need profile setup
				financialDetails: {
					monthlyIncome: 120000,
					savingsGoal: 30000,
					majorExpenses: 50000,
					accountBalance: 985653,
					salary: {
						amount: 120000,
						payDay: "1st",
					},
					budgetCategories: [
						{ name: "Housing", percentage: 30 },
						{ name: "Food", percentage: 15 },
						{ name: "Transportation", percentage: 10 },
						{ name: "Utilities", percentage: 10 },
						{ name: "Entertainment", percentage: 5 },
						{ name: "Savings", percentage: 20 },
						{ name: "Others", percentage: 10 },
					],
				},
			});
			localStorage.setItem("finapp_users", JSON.stringify(registeredUsers));
		}

		// Find user with matching credentials
		const user = registeredUsers.find(
			(user) =>
				user.email === credentials.email &&
				user.password === credentials.password
		);

		if (user) {
			// Login successful - create session without password
			const userSession = {
				name: user.name,
				email: user.email,
				profilePic: user.profilePic || defaultProfileImage,
			};

			// If user has financialDetails, include them in the session
			if (user.financialDetails) {
				userSession.financialDetails = user.financialDetails;
			}

			onLogin(userSession);
		} else {
			setError("Invalid email or password");
		}
	};

	return (
		<div className="auth-container">
			<div className="auth-card">
				<div className="auth-header">
					<h2>Welcome Back</h2>
					<p>Sign in to your FinApp account</p>
				</div>

				{error && <div className="auth-error">{error}</div>}

				<form
					onSubmit={handleSubmit}
					className="auth-form">
					<div className="input-group">
						<FaUser className="input-icon" />
						<input
							type="email"
							name="email"
							value={credentials.email}
							onChange={handleChange}
							placeholder="Email Address"
							className="auth-input"
						/>
					</div>

					<div className="input-group">
						<FaLock className="input-icon" />
						<input
							type="password"
							name="password"
							value={credentials.password}
							onChange={handleChange}
							placeholder="Password"
							className="auth-input"
						/>
					</div>

					<div className="auth-options">
						<label className="remember-me">
							<input type="checkbox" />
							<span>Remember me</span>
						</label>
						<a
							href="#forgot"
							className="forgot-password">
							Forgot password?
						</a>
					</div>

					<button
						type="submit"
						className="auth-button">
						Sign In
						<FaArrowRight />
					</button>
				</form>

				<div
					className="auth-info"
					style={{
						marginTop: "15px",
						textAlign: "center",
						fontSize: "14px",
						color: "var(--text-secondary)",
					}}>
					<p>Demo Account: demo@example.com / password</p>
				</div>

				<div className="auth-footer">
					<p>
						Don't have an account?{" "}
						<button
							onClick={switchToRegister}
							className="auth-link">
							Register
						</button>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
