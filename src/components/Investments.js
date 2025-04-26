import React, { useState, useEffect } from "react";
import {
	FaPlus,
	FaArrowUp,
	FaArrowDown,
	FaMoneyBillWave,
	FaPercentage,
} from "react-icons/fa";
import { Pie, Line } from "react-chartjs-2";
import "../styles/App.css";
import News from "./News";

const Investments = ({ user }) => {
	const [activeTab, setActiveTab] = useState("investments");
	const [investmentData, setInvestmentData] = useState([]);
	const [newInvestment, setNewInvestment] = useState({
		name: "",
		type: "",
		amount: "",
		date: "",
		description: "",
	});
	const [showAddForm, setShowAddForm] = useState(false);

	useEffect(() => {
		// Load any saved investment data
		const storedUser = JSON.parse(localStorage.getItem("finapp_user"));
		if (storedUser && storedUser.investmentData) {
			setInvestmentData(storedUser.investmentData);
		}
	}, []);

	// Format currency
	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
			maximumFractionDigits: 0,
		}).format(amount);
	};

	// Handle form input changes
	const handleInputChange = (e) => {
		setNewInvestment({
			...newInvestment,
			[e.target.name]: e.target.value,
		});
	};

	// Add new investment entry
	const handleAddInvestment = (e) => {
		e.preventDefault();

		if (!newInvestment.name || !newInvestment.type || !newInvestment.amount || !newInvestment.date) {
			alert("Please fill all required fields");
			return;
		}

		const updatedInvestmentData = [
			...investmentData,
			{
				id: `investment-${Date.now()}`,
				...newInvestment,
				amount: parseFloat(newInvestment.amount),
				returns: calculateRandomReturns(parseFloat(newInvestment.amount)),
			},
		];

		setInvestmentData(updatedInvestmentData);

		// Save to localStorage
		const storedUser = JSON.parse(localStorage.getItem("finapp_user"));
		if (storedUser) {
			storedUser.investmentData = updatedInvestmentData;
			localStorage.setItem("finapp_user", JSON.stringify(storedUser));
		}

		// Reset form
		setNewInvestment({
			name: "",
			type: "",
			amount: "",
			date: "",
			description: "",
		});
		setShowAddForm(false);
	};

	// Delete investment entry
	const handleDeleteInvestment = (id) => {
		const updatedInvestmentData = investmentData.filter((item) => item.id !== id);
		setInvestmentData(updatedInvestmentData);

		// Save to localStorage
		const storedUser = JSON.parse(localStorage.getItem("finapp_user"));
		if (storedUser) {
			storedUser.investmentData = updatedInvestmentData;
			localStorage.setItem("finapp_user", JSON.stringify(storedUser));
		}
	};

	// Calculate random returns for demo purposes
	const calculateRandomReturns = (amount) => {
		const randomPercentage = -5 + Math.random() * 25; // Between -5% and +20%
		return (amount * randomPercentage) / 100;
	};

	// Get investments by type
	const getInvestmentsByType = () => {
		const types = {};
		investmentData.forEach((investment) => {
			if (!types[investment.type]) {
				types[investment.type] = 0;
			}
			types[investment.type] += investment.amount;
		});
		return types;
	};

	// Prepare data for pie chart
	const preparePieChartData = () => {
		const types = getInvestmentsByType();
		return {
			labels: Object.keys(types),
			datasets: [
				{
					data: Object.values(types),
					backgroundColor: [
						"#4CAF50",
						"#2196F3",
						"#FF9800",
						"#673AB7",
						"#E91E63",
						"#00BCD4",
					],
					borderWidth: 0,
				},
			],
		};
	};

	// Prepare data for returns chart
	const prepareReturnsChartData = () => {
		// Calculate total investment and returns by month
		const monthlyData = {};
		
		investmentData.forEach((investment) => {
			const month = investment.date.substring(0, 7); // YYYY-MM format
			if (!monthlyData[month]) {
				monthlyData[month] = { investment: 0, returns: 0 };
			}
			monthlyData[month].investment += investment.amount;
			monthlyData[month].returns += investment.returns;
		});

		const sortedMonths = Object.keys(monthlyData).sort();
		const formattedMonths = sortedMonths.map((month) => {
			const date = new Date(`${month}-01`);
			return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
		});

		// Calculate cumulative data
		let cumulativeInvestment = 0;
		let cumulativeReturns = 0;
		const investmentValues = [];
		const returnsValues = [];

		sortedMonths.forEach((month) => {
			cumulativeInvestment += monthlyData[month].investment;
			cumulativeReturns += monthlyData[month].returns;
			investmentValues.push(cumulativeInvestment);
			returnsValues.push(cumulativeReturns);
		});

		return {
			labels: formattedMonths,
			datasets: [
				{
					label: "Investments",
					data: investmentValues,
					borderColor: "#2196F3",
					backgroundColor: "rgba(33, 150, 243, 0.1)",
					tension: 0.4,
				},
				{
					label: "Returns",
					data: returnsValues.map((value, index) => investmentValues[index] + value),
					borderColor: "#4CAF50",
					backgroundColor: "rgba(76, 175, 80, 0.1)",
					tension: 0.4,
				},
			],
		};
	};

	// Chart options
	const pieChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "right",
				labels: {
					color: "#b3b3b3",
					usePointStyle: true,
				},
			},
			tooltip: {
				callbacks: {
					label: function (context) {
						const value = context.raw;
						const total = context.dataset.data.reduce((a, b) => a + b, 0);
						const percentage = Math.round((value / total) * 100);
						return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
					},
				},
			},
		},
	};

	const lineChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: true,
				position: "top",
				labels: {
					color: "#b3b3b3",
					usePointStyle: true,
				},
			},
			tooltip: {
				callbacks: {
					label: function (context) {
						return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
					},
				},
			},
		},
		scales: {
			y: {
				ticks: {
					callback: (value) => formatCurrency(value),
					color: "#b3b3b3",
				},
				grid: {
					color: "rgba(255, 255, 255, 0.1)",
				},
			},
			x: {
				ticks: {
					color: "#b3b3b3",
				},
				grid: {
					color: "rgba(255, 255, 255, 0.1)",
				},
			},
		},
	};

	// Calculate total investments and returns
	const calculateTotals = () => {
		let totalInvestment = 0;
		let totalReturns = 0;

		investmentData.forEach((investment) => {
			totalInvestment += investment.amount;
			totalReturns += investment.returns;
		});

		return { totalInvestment, totalReturns };
	};

	const { totalInvestment, totalReturns } = calculateTotals();

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

				{/* News Section */}
				<News />
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
