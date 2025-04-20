import React, { useState } from "react";
import { FaUser, FaLock, FaEnvelope, FaArrowRight } from "react-icons/fa";
import "../styles/Auth.css";

// Default profile image
const defaultProfileImage =
	"https://th.bing.com/th/id/R.95c74e73a0802296ef631dd71dfa09d2?rik=eIiF8VmPmhhzXw&riu=http%3a%2f%2fwww.pngall.com%2fwp-content%2fuploads%2f5%2fUser-Profile-PNG-Image.png&ehk=YvjAOG2T71oFU41G13CCoak98yJU3f0YK669MQiOROg%3d&risl=&pid=ImgRaw&r=0";

const Register = ({ onRegister, switchToLogin }) => {
	const [userData, setUserData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [error, setError] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setUserData({
			...userData,
			[name]: value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		// Basic validation
		if (
			!userData.name ||
			!userData.email ||
			!userData.password ||
			!userData.confirmPassword
		) {
			setError("Please fill in all fields");
			return;
		}

		if (userData.password !== userData.confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (userData.password.length < 6) {
			setError("Password must be at least 6 characters long");
			return;
		}

		// Check if user already exists
		const registeredUsers = JSON.parse(
			localStorage.getItem("finapp_users") || "[]"
		);
		const userExists = registeredUsers.some(
			(user) => user.email === userData.email
		);

		if (userExists) {
			setError("This email is already registered");
			return;
		}

		// Create user object with credentials for login
		const newUser = {
			name: userData.name,
			email: userData.email,
			password: userData.password, // In a real app, this would be hashed
			profilePic: defaultProfileImage,
		};

		// Store in "database" (localStorage)
		registeredUsers.push(newUser);
		localStorage.setItem("finapp_users", JSON.stringify(registeredUsers));

		// Login the user (but don't include password in the session data)
		const userSession = {
			name: userData.name,
			email: userData.email,
			profilePic: defaultProfileImage,
		};

		onRegister(userSession);
	};

	return (
		<div className="auth-container">
			<div className="auth-card">
				<div className="auth-header">
					<h2>Create Account</h2>
					<p>Register for a new FinApp account</p>
				</div>

				{error && <div className="auth-error">{error}</div>}

				<form
					onSubmit={handleSubmit}
					className="auth-form">
					<div className="input-group">
						<FaUser className="input-icon" />
						<input
							type="text"
							name="name"
							value={userData.name}
							onChange={handleChange}
							placeholder="Full Name"
							className="auth-input"
						/>
					</div>

					<div className="input-group">
						<FaEnvelope className="input-icon" />
						<input
							type="email"
							name="email"
							value={userData.email}
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
							value={userData.password}
							onChange={handleChange}
							placeholder="Password"
							className="auth-input"
						/>
					</div>

					<div className="input-group">
						<FaLock className="input-icon" />
						<input
							type="password"
							name="confirmPassword"
							value={userData.confirmPassword}
							onChange={handleChange}
							placeholder="Confirm Password"
							className="auth-input"
						/>
					</div>

					<div className="auth-options">
						<label className="remember-me">
							<input
								type="checkbox"
								required
							/>
							<span>I agree to the Terms & Conditions</span>
						</label>
					</div>

					<button
						type="submit"
						className="auth-button">
						Create Account
						<FaArrowRight />
					</button>
				</form>

				<div className="auth-footer">
					<p>
						Already have an account?{" "}
						<button
							onClick={switchToLogin}
							className="auth-link">
							Sign In
						</button>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Register;
