import React, { useState } from "react";
import {
	FaRupeeSign,
	FaUser,
	FaChartLine,
	FaArrowRight,
	FaMoneyBillWave,
	FaCalendarAlt,
	FaEnvelope,
	FaPhone,
} from "react-icons/fa";
import "../styles/Auth.css";

const defaultProfileImage = "https://example.com/path/to/default/profile/image.png";

const ProfileSetup = ({ user, onComplete }) => {
	const [step, setStep] = useState(1);
	const [financialDetails, setFinancialDetails] = useState({
		monthlyIncome: "",
		savingsGoal: "",
		majorExpenses: "",
		accountBalance: "",
		salary: {
			amount: "",
			payDay: "",
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
	});
	const [error, setError] = useState("");
	const [userDetails, setUserDetails] = useState({
		username: user?.username || "",
		email: user?.email || "",
		phoneNumber: "",
		profilePhoto: user?.profilePic || defaultProfileImage,
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name.includes(".")) {
			const [parent, child] = name.split(".");
			setFinancialDetails({
				...financialDetails,
				[parent]: {
					...financialDetails[parent],
					[child]: value,
				},
			});
		} else {
			setFinancialDetails({
				...financialDetails,
				[name]: value,
			});
		}
	};

	const handleCategoryChange = (index, field, value) => {
		const updatedCategories = [...financialDetails.budgetCategories];
		updatedCategories[index][field] =
			field === "percentage" ? parseInt(value) : value;
		setFinancialDetails({
			...financialDetails,
			budgetCategories: updatedCategories,
		});
	};

	const handleUserDetailsChange = (e) => {
		const { name, value } = e.target;
		setUserDetails({
			...userDetails,
			[name]: value,
		});
	};

	const handleNext = () => {
		// Basic validation for each step
		if (step === 1) {
			if (!financialDetails.monthlyIncome || !financialDetails.accountBalance) {
				setError("Please fill in all required fields");
				return;
			}
			if (
				isNaN(financialDetails.monthlyIncome) ||
				isNaN(financialDetails.accountBalance)
			) {
				setError("Please enter valid numbers");
				return;
			}
		} else if (step === 2) {
			if (!financialDetails.salary.amount || !financialDetails.salary.payDay) {
				setError("Please fill in all required fields");
				return;
			}
			if (isNaN(financialDetails.salary.amount)) {
				setError("Please enter a valid salary amount");
				return;
			}
		}

		setError("");
		if (step < 3) {
			setStep(step + 1);
		} else {
			// Convert string values to numbers where appropriate
			const processedFinancialDetails = {
				...financialDetails,
				monthlyIncome: Number(financialDetails.monthlyIncome),
				savingsGoal: Number(financialDetails.savingsGoal),
				majorExpenses: Number(financialDetails.majorExpenses),
				accountBalance: Number(financialDetails.accountBalance),
				salary: {
					...financialDetails.salary,
					amount: Number(financialDetails.salary.amount),
				},
			};

			// Save financial details to localStorage along with user data
			const userInfo = JSON.parse(localStorage.getItem("finapp_user") || "{}");
			const updatedUserInfo = {
				...userInfo,
				financialDetails: processedFinancialDetails,
				userDetails: userDetails,
			};
			localStorage.setItem("finapp_user", JSON.stringify(updatedUserInfo));

			// Update registered users with financial details too
			const registeredUsers = JSON.parse(
				localStorage.getItem("finapp_users") || "[]"
			);
			const updatedUsers = registeredUsers.map((registeredUser) => {
				if (registeredUser.email === user.email) {
					return {
						...registeredUser,
						financialDetails: processedFinancialDetails,
						userDetails: userDetails,
					};
				}
				return registeredUser;
			});
			localStorage.setItem("finapp_users", JSON.stringify(updatedUsers));

			// Complete the profile setup
			onComplete(updatedUserInfo);
		}
	};

	const totalPercentage = financialDetails.budgetCategories.reduce(
		(sum, category) => sum + parseInt(category.percentage || 0),
		0
	);

	const renderStep = () => {
		switch (step) {
			case 1:
				return (
					<>
						<div className="auth-header">
							<h2>Financial Overview</h2>
							<p>Let's set up your basic financial information</p>
						</div>

						{error && <div className="auth-error">{error}</div>}

						<div className="auth-form">
							<div className="input-group">
								<FaRupeeSign className="input-icon" />
								<input
									type="number"
									name="monthlyIncome"
									value={financialDetails.monthlyIncome}
									onChange={handleChange}
									placeholder="Monthly Income"
									className="auth-input"
								/>
							</div>

							<div className="input-group">
								<FaChartLine className="input-icon" />
								<input
									type="number"
									name="savingsGoal"
									value={financialDetails.savingsGoal}
									onChange={handleChange}
									placeholder="Monthly Savings Goal"
									className="auth-input"
								/>
							</div>

							<div className="input-group">
								<FaMoneyBillWave className="input-icon" />
								<input
									type="number"
									name="accountBalance"
									value={financialDetails.accountBalance}
									onChange={handleChange}
									placeholder="Current Account Balance"
									className="auth-input"
								/>
							</div>

							<div className="input-group">
								<FaUser className="input-icon" />
								<input
									type="text"
									name="username"
									value={userDetails.username}
									onChange={handleUserDetailsChange}
									placeholder="Username"
									className="auth-input"
								/>
							</div>

							<div className="input-group">
								<FaEnvelope className="input-icon" />
								<input
									type="email"
									name="email"
									value={userDetails.email}
									onChange={handleUserDetailsChange}
									placeholder="Email Address"
									className="auth-input"
								/>
							</div>

							<div className="input-group">
								<FaPhone className="input-icon" />
								<input
									type="tel"
									name="phoneNumber"
									value={userDetails.phoneNumber}
									onChange={handleUserDetailsChange}
									placeholder="Phone Number"
									className="auth-input"
								/>
							</div>

							<div className="input-group">
								<input
									type="file"
									name="profilePhoto"
									onChange={(e) =>
										setUserDetails({
											...userDetails,
											profilePhoto: URL.createObjectURL(e.target.files[0]),
										})
									}
									className="auth-input"
								/>
							</div>
						</div>
					</>
				);

			case 2:
				return (
					<>
						<div className="auth-header">
							<h2>Income Details</h2>
							<p>Add details about your income sources</p>
						</div>

						{error && <div className="auth-error">{error}</div>}

						<div className="auth-form">
							<div className="input-group">
								<FaRupeeSign className="input-icon" />
								<input
									type="number"
									name="salary.amount"
									value={financialDetails.salary.amount}
									onChange={handleChange}
									placeholder="Salary Amount"
									className="auth-input"
								/>
							</div>

							<div className="input-group">
								<FaCalendarAlt className="input-icon" />
								<input
									type="text"
									name="salary.payDay"
									value={financialDetails.salary.payDay}
									onChange={handleChange}
									placeholder="Salary Pay Day (e.g., 1st, 15th)"
									className="auth-input"
								/>
							</div>

							<div className="input-group">
								<FaMoneyBillWave className="input-icon" />
								<input
									type="number"
									name="majorExpenses"
									value={financialDetails.majorExpenses}
									onChange={handleChange}
									placeholder="Major Monthly Expenses (Rent, EMI, etc.)"
									className="auth-input"
								/>
							</div>
						</div>
					</>
				);

			case 3:
				return (
					<>
						<div className="auth-header">
							<h2>Budget Allocation</h2>
							<p>How would you like to allocate your budget?</p>
							<div
								style={{
									color:
										totalPercentage === 100
											? "var(--primary-color)"
											: "var(--danger-color)",
									marginTop: "10px",
								}}>
								Total: {totalPercentage}%{" "}
								{totalPercentage === 100 ? "(Balanced)" : "(Should be 100%)"}
							</div>
						</div>

						{error && <div className="auth-error">{error}</div>}

						<div
							className="auth-form"
							style={{ maxHeight: "300px", overflowY: "auto" }}>
							{financialDetails.budgetCategories.map((category, index) => (
								<div
									key={index}
									style={{
										display: "flex",
										marginBottom: "15px",
										alignItems: "center",
									}}>
									<input
										type="text"
										value={category.name}
										onChange={(e) =>
											handleCategoryChange(index, "name", e.target.value)
										}
										placeholder="Category"
										className="auth-input"
										style={{
											flex: 2,
											marginRight: "10px",
											padding: "10px 15px",
										}}
									/>
									<input
										type="number"
										value={category.percentage}
										onChange={(e) =>
											handleCategoryChange(index, "percentage", e.target.value)
										}
										placeholder="%"
										className="auth-input"
										style={{ flex: 1, padding: "10px 15px" }}
									/>
									<span style={{ marginLeft: "5px", width: "25px" }}>%</span>
								</div>
							))}
						</div>
					</>
				);

			default:
				return null;
		}
	};

	return (
		<div className="auth-container">
			<div
				className="auth-card"
				style={{ width: "450px" }}>
				{renderStep()}

				<div
					className="step-indicators"
					style={{
						display: "flex",
						justifyContent: "center",
						margin: "20px 0",
					}}>
					{[1, 2, 3].map((s) => (
						<div
							key={s}
							style={{
								width: "10px",
								height: "10px",
								borderRadius: "50%",
								backgroundColor:
									s === step ? "var(--primary-color)" : "var(--border-color)",
								margin: "0 5px",
								cursor: s < step ? "pointer" : "default",
							}}
							onClick={() => s < step && setStep(s)}
						/>
					))}
				</div>

				<button
					className="auth-button"
					onClick={handleNext}
					style={{ marginTop: "20px" }}>
					{step < 3 ? "Next" : "Complete Setup"}
					<FaArrowRight />
				</button>
			</div>
		</div>
	);
};

export default ProfileSetup;
