import React, { useState, useEffect } from "react";
import {
	FaChartLine,
	FaWallet,
	FaExchangeAlt,
	FaRegCreditCard,
	FaCog,
	FaRegCalendarAlt,
	FaSignOutAlt,
	FaPlus,
	FaArrowUp,
	FaArrowDown,
	FaMoneyBillWave,
	FaPercentage,
} from "react-icons/fa";
import { Line, Doughnut } from "react-chartjs-2";
import "../styles/App.css";

const Investments = ({ user, onLogout, onNavigate }) => {
	const [activeTab, setActiveTab] = useState("investments");
	const [investmentData, setInvestmentData] = useState([]);
	const [newInvestment, setNewInvestment] = useState({
		name: "",
		category: "",
		initialAmount: "",
		currentAmount: "",
		date: "",
		returns: "",
	});
	const [showAddForm, setShowAddForm] = useState(false);

	// Investment categories
	const investmentCategories = [
		{ name: "Stocks", color: "#36f9ae" },
		{ name: "Mutual Funds", color: "#5e5ce6" },
		{ name: "Fixed Deposits", color: "#ff9f43" },
		{ name: "Real Estate", color: "#7367f0" },
		{ name: "Gold", color: "#ffda6a" },
		{ name: "Cryptocurrency", color: "#ea5455" },
		{ name: "Others", color: "#4bc0c0" },
	];

	useEffect(() => {
		// Load any saved investment data
		const storedUser = JSON.parse(localStorage.getItem("finapp_user"));
		if (storedUser && storedUser.investmentData) {
			setInvestmentData(storedUser.investmentData);
		} else if (user.financialDetails) {
			// Generate some example investment data
			const monthlyIncome = user.financialDetails.monthlyIncome || 0;

			// Create some sample investments
			const generatedData = [
				{
					name: "Equity Mutual Fund",
					category: "Mutual Funds",
					initialAmount: monthlyIncome * 3,
					currentAmount: monthlyIncome * 3 * 1.12,
					date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
						.toISOString()
						.slice(0, 10),
					returns: 12,
				},
				{
					name: "Fixed Deposit",
					category: "Fixed Deposits",
					initialAmount: monthlyIncome * 6,
					currentAmount: monthlyIncome * 6 * 1.065,
					date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
						.toISOString()
						.slice(0, 10),
					returns: 6.5,
				},
				{
					name: "Company Stock",
					category: "Stocks",
					initialAmount: monthlyIncome * 2,
					currentAmount: monthlyIncome * 2 * 1.15,
					date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000)
						.toISOString()
						.slice(0, 10),
					returns: 15,
				},
				{
					name: "Gold ETF",
					category: "Gold",
					initialAmount: monthlyIncome * 1,
					currentAmount: monthlyIncome * 1 * 1.08,
					date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
						.toISOString()
						.slice(0, 10),
					returns: 8,
				},
			];

			setInvestmentData(generatedData);

			// Save this data
			const updatedUser = {
				...storedUser,
				investmentData: generatedData,
			};
			localStorage.setItem("finapp_user", JSON.stringify(updatedUser));
		}
	}, [user]);

	// Format numbers to currency format
	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
			maximumFractionDigits: 0,
		}).format(amount);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewInvestment({
			...newInvestment,
			[name]: value,
		});
	};

	const handleAddInvestment = (e) => {
		e.preventDefault();

		if (
			!newInvestment.name ||
			!newInvestment.category ||
			!newInvestment.initialAmount ||
			!newInvestment.date
		) {
			alert("Please fill in all required fields");
			return;
		}

		// Calculate current amount if not provided
		const initialAmount = parseFloat(newInvestment.initialAmount);
		const returns = parseFloat(newInvestment.returns || 0);
		const currentAmount = newInvestment.currentAmount
			? parseFloat(newInvestment.currentAmount)
			: initialAmount * (1 + returns / 100);

		const investmentEntry = {
			...newInvestment,
			initialAmount: initialAmount,
			currentAmount: currentAmount,
			returns:
				returns || ((currentAmount - initialAmount) / initialAmount) * 100,
		};

		const updatedInvestmentData = [...investmentData, investmentEntry];
		setInvestmentData(updatedInvestmentData);

		// Save to localStorage
		const storedUser = JSON.parse(localStorage.getItem("finapp_user"));
		const updatedUser = {
			...storedUser,
			investmentData: updatedInvestmentData,
		};
		localStorage.setItem("finapp_user", JSON.stringify(updatedUser));

		// Reset form
		setNewInvestment({
			name: "",
			category: "",
			initialAmount: "",
			currentAmount: "",
			date: "",
			returns: "",
		});
		setShowAddForm(false);
	};

	// Portfolio allocation chart data
	const prepareAllocationData = () => {
		const categoryTotals = {};

		investmentData.forEach((item) => {
			categoryTotals[item.category] =
				(categoryTotals[item.category] || 0) + item.currentAmount;
		});

		const labels = Object.keys(categoryTotals);
		const data = labels.map((cat) => categoryTotals[cat]);

		// Match colors with categories
		const colors = labels.map((cat) => {
			const categoryMatch = investmentCategories.find((c) => c.name === cat);
			return categoryMatch ? categoryMatch.color : "#4bc0c0";
		});

		return {
			labels: labels,
			datasets: [
				{
					data: data,
					backgroundColor: colors,
					borderWidth: 0,
				},
			],
		};
	};

	// Calculate investment statistics
	const calculateStats = () => {
		if (investmentData.length === 0) {
			return {
				totalInvested: 0,
				currentValue: 0,
				totalReturns: 0,
				totalGrowth: 0,
				bestPerformer: null,
				worstPerformer: null,
			};
		}

		const totalInvested = investmentData.reduce(
			(sum, item) => sum + parseFloat(item.initialAmount),
			0
		);
		const currentValue = investmentData.reduce(
			(sum, item) => sum + parseFloat(item.currentAmount),
			0
		);
		const totalReturns = currentValue - totalInvested;
		const totalGrowth = (totalReturns / totalInvested) * 100;

		// Find best and worst performers
		let bestPerformer = investmentData[0];
		let worstPerformer = investmentData[0];

		investmentData.forEach((investment) => {
			const returns = parseFloat(investment.returns);
			if (returns > parseFloat(bestPerformer.returns)) {
				bestPerformer = investment;
			}
			if (returns < parseFloat(worstPerformer.returns)) {
				worstPerformer = investment;
			}
		});

		return {
			totalInvested,
			currentValue,
			totalReturns,
			totalGrowth,
			bestPerformer,
			worstPerformer,
		};
	};

	const stats = calculateStats();

	// Chart options
	const doughnutOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: true,
				position: "right",
				labels: {
					color: "#b3b3b3",
					usePointStyle: true,
					padding: 15,
					font: { size: 11 },
				},
			},
			tooltip: {
				callbacks: {
					label: function (context) {
						const total = context.dataset.data.reduce((a, b) => a + b, 0);
						const percentage = Math.round((context.raw / total) * 100);
						return `${context.label}: ${formatCurrency(
							context.raw
						)} (${percentage}%)`;
					},
				},
			},
		},
	};

	return (
		<div className="app-container">
			{/* Sidebar */}
			<div className="sidebar">
				<div className="profile">
					<img
						src={user.profilePic}
						alt="Profile"
						className="profile-image"
					/>
					<h3 className="profile-name">{user.name}</h3>
					<p className="profile-subtitle">Personal Budget</p>
				</div>

				<ul className="nav-menu">
					<li
						className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
						onClick={() => onNavigate("dashboard")}>
						<FaChartLine className="nav-icon" />
						<span className="nav-text">Dashboard</span>
					</li>
					<li
						className={`nav-item ${activeTab === "income" ? "active" : ""}`}
						onClick={() => onNavigate("income")}>
						<FaWallet className="nav-icon" />
						<span className="nav-text">Income</span>
					</li>
					<li
						className={`nav-item ${activeTab === "expenses" ? "active" : ""}`}
						onClick={() => onNavigate("expenses")}>
						<FaExchangeAlt className="nav-icon" />
						<span className="nav-text">Expenses</span>
					</li>
					<li
						className={`nav-item ${
							activeTab === "investments" ? "active" : ""
						}`}
						onClick={() => setActiveTab("investments")}>
						<FaMoneyBillWave className="nav-icon" />
						<span className="nav-text">Investments</span>
					</li>
					<li
						className={`nav-item ${activeTab === "cards" ? "active" : ""}`}
						onClick={() => onNavigate("cards")}>
						<FaRegCreditCard className="nav-icon" />
						<span className="nav-text">Cards & Accounts</span>
					</li>
					<li
						className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
						onClick={() => onNavigate("settings")}>
						<FaCog className="nav-icon" />
						<span className="nav-text">Settings</span>
					</li>
					<li
						className="nav-item logout-item"
						onClick={onLogout}>
						<FaSignOutAlt className="nav-icon" />
						<span className="nav-text">Logout</span>
					</li>
				</ul>
			</div>

			{/* Main Content */}
			<div className="main-content">
				<div className="finance-analytics">
					{/* Header */}
					<div className="header">
						<h2 className="header-title">Investment Portfolio</h2>
						<div className="header-right">
							<button
								className="add-button"
								onClick={() => setShowAddForm(!showAddForm)}
								style={{
									background: "var(--primary-color)",
									border: "none",
									borderRadius: "5px",
									padding: "8px 15px",
									color: "#000",
									display: "flex",
									alignItems: "center",
									cursor: "pointer",
									fontWeight: "bold",
								}}>
								<FaPlus style={{ marginRight: "5px" }} />
								Add Investment
							</button>
						</div>
					</div>

					{/* Dashboard Grid */}
					<div className="dashboard-grid">
						{/* Add Investment Form */}
						{showAddForm && (
							<div
								className="dashboard-card card-full"
								style={{ padding: "20px" }}>
								<h3 className="card-title">Add New Investment</h3>
								<form
									onSubmit={handleAddInvestment}
									className="investment-form">
									<div
										className="form-row"
										style={{
											display: "flex",
											gap: "15px",
											marginBottom: "15px",
										}}>
										<div
											className="form-group"
											style={{ flex: 1 }}>
											<label>Investment Name</label>
											<input
												type="text"
												name="name"
												value={newInvestment.name}
												onChange={handleInputChange}
												style={{
													width: "100%",
													padding: "10px",
													backgroundColor: "#2d2d2d",
													border: "1px solid var(--border-color)",
													borderRadius: "5px",
													color: "var(--text-light)",
												}}
												placeholder="Stock name, fund name, etc."
											/>
										</div>
										<div
											className="form-group"
											style={{ flex: 1 }}>
											<label>Category</label>
											<select
												name="category"
												value={newInvestment.category}
												onChange={handleInputChange}
												style={{
													width: "100%",
													padding: "10px",
													backgroundColor: "#2d2d2d",
													border: "1px solid var(--border-color)",
													borderRadius: "5px",
													color: "var(--text-light)",
												}}>
												<option value="">Select Category</option>
												{investmentCategories.map((cat, index) => (
													<option
														key={index}
														value={cat.name}>
														{cat.name}
													</option>
												))}
											</select>
										</div>
										<div
											className="form-group"
											style={{ flex: 1 }}>
											<label>Purchase Date</label>
											<input
												type="date"
												name="date"
												value={newInvestment.date}
												onChange={handleInputChange}
												style={{
													width: "100%",
													padding: "10px",
													backgroundColor: "#2d2d2d",
													border: "1px solid var(--border-color)",
													borderRadius: "5px",
													color: "var(--text-light)",
												}}
											/>
										</div>
									</div>
									<div
										className="form-row"
										style={{
											display: "flex",
											gap: "15px",
											marginBottom: "20px",
										}}>
										<div
											className="form-group"
											style={{ flex: 1 }}>
											<label>Initial Investment</label>
											<input
												type="number"
												name="initialAmount"
												value={newInvestment.initialAmount}
												onChange={handleInputChange}
												style={{
													width: "100%",
													padding: "10px",
													backgroundColor: "#2d2d2d",
													border: "1px solid var(--border-color)",
													borderRadius: "5px",
													color: "var(--text-light)",
												}}
												placeholder="Amount invested"
											/>
										</div>
										<div
											className="form-group"
											style={{ flex: 1 }}>
											<label>Current Value (Optional)</label>
											<input
												type="number"
												name="currentAmount"
												value={newInvestment.currentAmount}
												onChange={handleInputChange}
												style={{
													width: "100%",
													padding: "10px",
													backgroundColor: "#2d2d2d",
													border: "1px solid var(--border-color)",
													borderRadius: "5px",
													color: "var(--text-light)",
												}}
												placeholder="Current value"
											/>
										</div>
										<div
											className="form-group"
											style={{ flex: 1 }}>
											<label>Returns % (Optional)</label>
											<input
												type="number"
												name="returns"
												value={newInvestment.returns}
												onChange={handleInputChange}
												style={{
													width: "100%",
													padding: "10px",
													backgroundColor: "#2d2d2d",
													border: "1px solid var(--border-color)",
													borderRadius: "5px",
													color: "var(--text-light)",
												}}
												placeholder="Return percentage"
											/>
										</div>
									</div>
									<div
										className="form-buttons"
										style={{
											display: "flex",
											justifyContent: "flex-end",
											gap: "10px",
										}}>
										<button
											type="button"
											onClick={() => setShowAddForm(false)}
											style={{
												padding: "10px 20px",
												backgroundColor: "#3d3d3d",
												border: "none",
												borderRadius: "5px",
												color: "var(--text-light)",
												cursor: "pointer",
											}}>
											Cancel
										</button>
										<button
											type="submit"
											style={{
												padding: "10px 20px",
												backgroundColor: "var(--primary-color)",
												border: "none",
												borderRadius: "5px",
												color: "#000",
												cursor: "pointer",
												fontWeight: "bold",
											}}>
											Save Investment
										</button>
									</div>
								</form>
							</div>
						)}

						{/* Portfolio Overview Cards */}
						<div className="dashboard-card card-wide">
							<h3 className="card-title">Total Investment</h3>
							<div className="balance-amount">
								{formatCurrency(stats.totalInvested)}
							</div>
							<div className="balance-label">Initial investment amount</div>
						</div>

						<div className="dashboard-card card-wide">
							<h3 className="card-title">Current Value</h3>
							<div className="balance-amount profit">
								{formatCurrency(stats.currentValue)}
							</div>
							<div className="balance-label">Current portfolio value</div>
						</div>

						<div className="dashboard-card card-wide">
							<h3 className="card-title">Total Returns</h3>
							<div
								className="balance-amount"
								style={{
									color:
										stats.totalReturns >= 0
											? "var(--primary-color)"
											: "#ff5252",
								}}>
								{formatCurrency(stats.totalReturns)}
								<span style={{ fontSize: "1rem", marginLeft: "5px" }}>
									({stats.totalGrowth.toFixed(2)}%)
								</span>
							</div>
							<div className="balance-label">Overall portfolio performance</div>
						</div>

						{/* Portfolio Allocation Chart */}
						<div className="dashboard-card card-wide">
							<h3 className="card-title">Portfolio Allocation</h3>
							<div
								style={{
									height: "300px",
									position: "relative",
									display: "flex",
									justifyContent: "center",
								}}>
								<Doughnut
									data={prepareAllocationData()}
									options={doughnutOptions}
								/>
							</div>
						</div>

						{/* Best and Worst Performers */}
						<div className="dashboard-card card-wide">
							<h3 className="card-title">Best Performer</h3>
							{stats.bestPerformer ? (
								<>
									<div
										className="balance-amount profit"
										style={{ fontSize: "1.5rem" }}>
										{stats.bestPerformer.name}
									</div>
									<div
										className="balance-amount profit"
										style={{ fontSize: "1.2rem" }}>
										{stats.bestPerformer.returns.toFixed(2)}%
									</div>
									<div className="balance-label">
										{stats.bestPerformer.category} • Initial:{" "}
										{formatCurrency(stats.bestPerformer.initialAmount)}
									</div>
								</>
							) : (
								<div className="balance-label">No investments yet</div>
							)}
						</div>

						<div className="dashboard-card card-wide">
							<h3 className="card-title">Worst Performer</h3>
							{stats.worstPerformer ? (
								<>
									<div
										className="balance-amount"
										style={{ fontSize: "1.5rem", color: "#ff5252" }}>
										{stats.worstPerformer.name}
									</div>
									<div
										className="balance-amount"
										style={{ fontSize: "1.2rem", color: "#ff5252" }}>
										{stats.worstPerformer.returns.toFixed(2)}%
									</div>
									<div className="balance-label">
										{stats.worstPerformer.category} • Initial:{" "}
										{formatCurrency(stats.worstPerformer.initialAmount)}
									</div>
								</>
							) : (
								<div className="balance-label">No investments yet</div>
							)}
						</div>

						{/* Investment List */}
						<div className="dashboard-card card-full">
							<h3 className="card-title">Investment Portfolio</h3>
							<div className="investment-list">
								<table style={{ width: "100%", borderCollapse: "collapse" }}>
									<thead>
										<tr>
											<th
												style={{
													textAlign: "left",
													padding: "10px",
													borderBottom: "1px solid var(--border-color)",
												}}>
												Name
											</th>
											<th
												style={{
													textAlign: "left",
													padding: "10px",
													borderBottom: "1px solid var(--border-color)",
												}}>
												Category
											</th>
											<th
												style={{
													textAlign: "right",
													padding: "10px",
													borderBottom: "1px solid var(--border-color)",
												}}>
												Initial Investment
											</th>
											<th
												style={{
													textAlign: "right",
													padding: "10px",
													borderBottom: "1px solid var(--border-color)",
												}}>
												Current Value
											</th>
											<th
												style={{
													textAlign: "right",
													padding: "10px",
													borderBottom: "1px solid var(--border-color)",
												}}>
												Returns
											</th>
											<th
												style={{
													textAlign: "left",
													padding: "10px",
													borderBottom: "1px solid var(--border-color)",
												}}>
												Purchase Date
											</th>
										</tr>
									</thead>
									<tbody>
										{investmentData.map((investment, index) => (
											<tr key={index}>
												<td
													style={{
														padding: "10px",
														borderBottom: "1px solid var(--border-color)",
													}}>
													{investment.name}
												</td>
												<td
													style={{
														padding: "10px",
														borderBottom: "1px solid var(--border-color)",
													}}>
													{investment.category}
												</td>
												<td
													style={{
														textAlign: "right",
														padding: "10px",
														borderBottom: "1px solid var(--border-color)",
													}}>
													{formatCurrency(investment.initialAmount)}
												</td>
												<td
													style={{
														textAlign: "right",
														padding: "10px",
														borderBottom: "1px solid var(--border-color)",
													}}>
													{formatCurrency(investment.currentAmount)}
												</td>
												<td
													style={{
														textAlign: "right",
														padding: "10px",
														borderBottom: "1px solid var(--border-color)",
														color:
															parseFloat(investment.returns) >= 0
																? "var(--primary-color)"
																: "#ff5252",
													}}>
													{parseFloat(investment.returns).toFixed(2)}%
												</td>
												<td
													style={{
														padding: "10px",
														borderBottom: "1px solid var(--border-color)",
													}}>
													{new Date(investment.date).toLocaleDateString()}
												</td>
											</tr>
										))}
										{investmentData.length === 0 && (
											<tr>
												<td
													colSpan="6"
													style={{ textAlign: "center", padding: "20px" }}>
													No investments added yet
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Investments;
