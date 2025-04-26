import React, { useState, useEffect } from "react";
import {
	FaRegCalendarAlt,
	FaPlus,
	FaArrowUp,
	FaArrowDown,
	FaTrash,
	FaEdit,
	FaFlag,
} from "react-icons/fa";
import { Line } from "react-chartjs-2";
import "../styles/App.css";
import News from "./News";

const Income = ({ user }) => {
	const [activeTab, setActiveTab] = useState("income");
	const [incomeData, setIncomeData] = useState([]);
	const [newIncome, setNewIncome] = useState({
		source: "",
		amount: "",
		date: "",
	});
	const [showAddForm, setShowAddForm] = useState(false);

	useEffect(() => {
		// Load any saved income data
		const storedUser = JSON.parse(localStorage.getItem("finapp_user"));
		if (storedUser && storedUser.incomeData) {
			setIncomeData(storedUser.incomeData);
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
		setNewIncome({
			...newIncome,
			[e.target.name]: e.target.value,
		});
	};

	// Add new income entry
	const handleAddIncome = (e) => {
		e.preventDefault();

		if (!newIncome.source || !newIncome.amount || !newIncome.date) {
			alert("Please fill all fields");
			return;
		}

		const updatedIncomeData = [
			...incomeData,
			{
				id: `income-${Date.now()}`,
				...newIncome,
				amount: parseFloat(newIncome.amount),
			},
		];

		setIncomeData(updatedIncomeData);

		// Save to localStorage
		const storedUser = JSON.parse(localStorage.getItem("finapp_user"));
		if (storedUser) {
			storedUser.incomeData = updatedIncomeData;
			localStorage.setItem("finapp_user", JSON.stringify(storedUser));
		}

		// Reset form
		setNewIncome({ source: "", amount: "", date: "" });
		setShowAddForm(false);
	};

	// Delete income entry
	const handleDeleteIncome = (id) => {
		const updatedIncomeData = incomeData.filter((item) => item.id !== id);
		setIncomeData(updatedIncomeData);

		// Save to localStorage
		const storedUser = JSON.parse(localStorage.getItem("finapp_user"));
		if (storedUser) {
			storedUser.incomeData = updatedIncomeData;
			localStorage.setItem("finapp_user", JSON.stringify(storedUser));
		}
	};

	// Prepare data for the chart
	const prepareChartData = () => {
		// Create a map to store income by month
		const monthlyIncome = new Map();

		// Group income by month and sum up
		incomeData.forEach((item) => {
			const month = item.date.substring(0, 7); // YYYY-MM format
			if (monthlyIncome.has(month)) {
				monthlyIncome.set(month, monthlyIncome.get(month) + item.amount);
			} else {
				monthlyIncome.set(month, item.amount);
			}
		});

		// Sort months chronologically
		const sortedMonths = Array.from(monthlyIncome.keys()).sort();

		// Format months for display (convert YYYY-MM to Month Year)
		const formattedMonths = sortedMonths.map((month) => {
			const date = new Date(`${month}-01`);
			return date.toLocaleDateString("en-US", {
				month: "short",
				year: "numeric",
			});
		});

		// Get amounts in the same order as the sorted months
		const amounts = sortedMonths.map((month) => monthlyIncome.get(month));

		// If we have less than 2 months of data, add some dummy data for better visualization
		if (sortedMonths.length < 2) {
			formattedMonths.unshift("Previous");
			amounts.unshift(0);
		}

		return {
			labels: formattedMonths,
			datasets: [
				{
					label: "Income",
					data: amounts,
					borderColor: "#36f9ae",
					backgroundColor: "rgba(54, 249, 174, 0.1)",
					tension: 0.4,
					fill: true,
				},
			],
		};
	};

	const chartOptions = {
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
				backgroundColor: "#1d1d1d",
				titleColor: "#ffffff",
				bodyColor: "#ffffff",
				callbacks: {
					label: function (context) {
						return formatCurrency(context.raw);
					},
				},
			},
		},
		scales: {
			x: {
				grid: {
					color: "rgba(255, 255, 255, 0.1)",
				},
				ticks: {
					color: "#b3b3b3",
				},
			},
			y: {
				grid: {
					color: "rgba(255, 255, 255, 0.1)",
				},
				ticks: {
					color: "#b3b3b3",
					callback: (value) => formatCurrency(value),
				},
			},
		},
	};

	// Calculate total and average income
	const calculateStats = () => {
		if (incomeData.length === 0) return { total: 0, average: 0 };

		const total = incomeData.reduce(
			(sum, item) => sum + parseFloat(item.amount),
			0
		);

		// Get unique months
		const months = new Set(incomeData.map((item) => item.date.slice(0, 7)));
		const average = total / months.size;

		return { total, average };
	};

	const { total, average } = calculateStats();

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
						onClick={() => setActiveTab("income")}>
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
						<h2 className="header-title">Income Management</h2>
						<div className="header-right">
							<div className="date-range">
								<FaRegCalendarAlt style={{ marginRight: "5px" }} />
								Last 6 Months
							</div>
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
								Add Income
							</button>
						</div>
					</div>

					{/* Dashboard Grid */}
					<div className="dashboard-grid">
						{/* Add Income Form */}
						{showAddForm && (
							<div
								className="dashboard-card card-full"
								style={{ padding: "20px" }}>
								<h3 className="card-title">Add New Income</h3>
								<form
									onSubmit={handleAddIncome}
									className="income-form">
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
											<label>Income Source</label>
											<input
												type="text"
												name="source"
												value={newIncome.source}
												onChange={handleInputChange}
												style={{
													width: "100%",
													padding: "10px",
													backgroundColor: "#2d2d2d",
													border: "1px solid var(--border-color)",
													borderRadius: "5px",
													color: "var(--text-light)",
												}}
												placeholder="Salary, Freelance, etc."
											/>
										</div>
										<div
											className="form-group"
											style={{ flex: 1 }}>
											<label>Amount</label>
											<input
												type="number"
												name="amount"
												value={newIncome.amount}
												onChange={handleInputChange}
												style={{
													width: "100%",
													padding: "10px",
													backgroundColor: "#2d2d2d",
													border: "1px solid var(--border-color)",
													borderRadius: "5px",
													color: "var(--text-light)",
												}}
												placeholder="Income amount"
											/>
										</div>
										<div
											className="form-group"
											style={{ flex: 1 }}>
											<label>Date</label>
											<input
												type="date"
												name="date"
												value={newIncome.date}
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
											Save Income
										</button>
									</div>
								</form>
							</div>
						)}

						{/* Income Stats Cards */}
						<div className="dashboard-card card-wide">
							<h3 className="card-title">Total Income</h3>
							<div className="balance-amount profit">
								{formatCurrency(total)}
							</div>
							<div className="balance-label">
								From {incomeData.length} transactions
							</div>
						</div>

						<div className="dashboard-card card-wide">
							<h3 className="card-title">Monthly Average</h3>
							<div className="balance-amount">{formatCurrency(average)}</div>
							<div className="balance-label">Average monthly income</div>
						</div>

						<div className="dashboard-card card-wide">
							<h3 className="card-title">Last Income</h3>
							<div className="balance-amount">
								{incomeData.length > 0
									? formatCurrency(
											incomeData.sort(
												(a, b) => new Date(b.date) - new Date(a.date)
											)[0].amount
									  )
									: "₹0"}
							</div>
							<div className="balance-label">
								{incomeData.length > 0
									? `On ${new Date(
											incomeData.sort(
												(a, b) => new Date(b.date) - new Date(a.date)
											)[0].date
									  ).toLocaleDateString()}`
									: "No records yet"}
							</div>
						</div>

						{/* Income Chart */}
						<div className="dashboard-card card-full">
							<h3 className="card-title">Income Trend</h3>
							<div style={{ height: "400px", position: "relative" }}>
								<Line
									data={prepareChartData()}
									options={chartOptions}
								/>
							</div>
						</div>

						{/* Income List */}
						<div className="dashboard-card card-full">
							<h3 className="card-title">Income History</h3>
							<div className="income-list">
								<table style={{ width: "100%", borderCollapse: "collapse" }}>
									<thead>
										<tr>
											<th
												style={{
													textAlign: "left",
													padding: "10px",
													borderBottom: "1px solid var(--border-color)",
												}}>
												Date
											</th>
											<th
												style={{
													textAlign: "left",
													padding: "10px",
													borderBottom: "1px solid var(--border-color)",
												}}>
												Source
											</th>
											<th
												style={{
													textAlign: "right",
													padding: "10px",
													borderBottom: "1px solid var(--border-color)",
												}}>
												Amount
											</th>
											<th
												style={{
													textAlign: "center",
													padding: "10px",
													borderBottom: "1px solid var(--border-color)",
												}}>
												Status
											</th>
										</tr>
									</thead>
									<tbody>
										{[...incomeData]
											.sort((a, b) => new Date(b.date) - new Date(a.date))
											.slice(0, 10)
											.map((income, index) => (
												<tr key={index}>
													<td
														style={{
															padding: "10px",
															borderBottom: "1px solid var(--border-color)",
														}}>
														{new Date(income.date).toLocaleDateString()}
													</td>
													<td
														style={{
															padding: "10px",
															borderBottom: "1px solid var(--border-color)",
														}}>
														{income.source}
													</td>
													<td
														style={{
															textAlign: "right",
															padding: "10px",
															borderBottom: "1px solid var(--border-color)",
														}}>
														{formatCurrency(income.amount)}
													</td>
													<td
														style={{
															textAlign: "center",
															padding: "10px",
															borderBottom: "1px solid var(--border-color)",
														}}>
														{income.recurring ? (
															<span
																style={{
																	color: "var(--primary-color)",
																	display: "flex",
																	alignItems: "center",
																	justifyContent: "center",
																}}>
																<FaArrowUp style={{ marginRight: "5px" }} />{" "}
																Recurring
															</span>
														) : (
															<span
																style={{
																	color: "#ff9f43",
																	display: "flex",
																	alignItems: "center",
																	justifyContent: "center",
																}}>
																One-time
															</span>
														)}
													</td>
												</tr>
											))}
										{incomeData.length === 0 && (
											<tr>
												<td
													colSpan="4"
													style={{ textAlign: "center", padding: "20px" }}>
													No income data available
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

export default Income;
