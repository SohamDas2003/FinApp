import React, { useState, useEffect } from "react";
import {
	FaRegCalendarAlt,
	FaPlus,
	FaArrowDown,
	FaMoneyBillWave,
} from "react-icons/fa";
import { Pie, Bar } from "react-chartjs-2";
import "../styles/App.css";
import AppLayout from "./AppLayout";

const Expenses = ({ user }) => {
	const [activeTab, setActiveTab] = useState("expenses");
	const [expenseData, setExpenseData] = useState([]);
	const [newExpense, setNewExpense] = useState({
		category: "",
		amount: "",
		date: "",
		description: "",
	});
	const [showAddForm, setShowAddForm] = useState(false);
	const [filterCategory, setFilterCategory] = useState("all");

	useEffect(() => {
		// Load any saved expense data
		const storedUser = JSON.parse(localStorage.getItem("finapp_user"));
		if (storedUser && storedUser.expenseData) {
			setExpenseData(storedUser.expenseData);
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
		setNewExpense({
			...newExpense,
			[e.target.name]: e.target.value,
		});
	};

	// Add new expense entry
	const handleAddExpense = (e) => {
		e.preventDefault();

		if (!newExpense.category || !newExpense.amount || !newExpense.date) {
			alert("Please fill all required fields");
			return;
		}

		const updatedExpenseData = [
			...expenseData,
			{
				id: `expense-${Date.now()}`,
				...newExpense,
				amount: parseFloat(newExpense.amount),
			},
		];

		setExpenseData(updatedExpenseData);

		// Save to localStorage
		const storedUser = JSON.parse(localStorage.getItem("finapp_user"));
		if (storedUser) {
			storedUser.expenseData = updatedExpenseData;
			localStorage.setItem("finapp_user", JSON.stringify(storedUser));
		}

		// Reset form
		setNewExpense({
			category: "",
			amount: "",
			date: "",
			description: "",
		});
		setShowAddForm(false);
	};

	// Delete expense entry
	const handleDeleteExpense = (id) => {
		const updatedExpenseData = expenseData.filter((item) => item.id !== id);
		setExpenseData(updatedExpenseData);

		// Save to localStorage
		const storedUser = JSON.parse(localStorage.getItem("finapp_user"));
		if (storedUser) {
			storedUser.expenseData = updatedExpenseData;
			localStorage.setItem("finapp_user", JSON.stringify(storedUser));
		}
	};

	// Calculate total expenses
	const calculateTotal = () => {
		return expenseData.reduce((total, expense) => total + expense.amount, 0);
	};

	// Get expenses by category
	const getExpensesByCategory = () => {
		const categories = {};
		expenseData.forEach((expense) => {
			if (!categories[expense.category]) {
				categories[expense.category] = 0;
			}
			categories[expense.category] += expense.amount;
		});
		return categories;
	};

	// Prepare data for pie chart
	const preparePieChartData = () => {
		const categories = getExpensesByCategory();
		return {
			labels: Object.keys(categories),
			datasets: [
				{
					data: Object.values(categories),
					backgroundColor: [
						"#FF6384",
						"#36A2EB",
						"#FFCE56",
						"#4BC0C0",
						"#9966FF",
						"#FF9F40",
						"#C9CBCF",
					],
					borderWidth: 0,
				},
			],
		};
	};

	// Prepare data for bar chart (monthly expenses)
	const prepareBarChartData = () => {
		const monthlyExpenses = {};
		expenseData.forEach((expense) => {
			const month = expense.date.substring(0, 7); // YYYY-MM format
			if (!monthlyExpenses[month]) {
				monthlyExpenses[month] = 0;
			}
			monthlyExpenses[month] += expense.amount;
		});

		const sortedMonths = Object.keys(monthlyExpenses).sort();
		const formattedMonths = sortedMonths.map((month) => {
			const date = new Date(`${month}-01`);
			return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
		});

		return {
			labels: formattedMonths,
			datasets: [
				{
					label: "Monthly Expenses",
					data: sortedMonths.map((month) => monthlyExpenses[month]),
					backgroundColor: "#FF6384",
					borderWidth: 0,
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

	const barChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				callbacks: {
					label: function (context) {
						return formatCurrency(context.raw);
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

	// Get expenses filtered by category
	const getFilteredExpenses = () => {
		if (filterCategory === "all") {
			return expenseData;
		}
		return expenseData.filter((expense) => expense.category === filterCategory);
	};

	// Get unique categories
	const getCategories = () => {
		const categories = new Set(expenseData.map((expense) => expense.category));
		return ["all", ...categories];
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
						onClick={() => setActiveTab("expenses")}>
						<FaExchangeAlt className="nav-icon" />
						<span className="nav-text">Expenses</span>
					</li>
					<li
						className={`nav-item ${
							activeTab === "investments" ? "active" : ""
						}`}
						onClick={() => onNavigate("investments")}>
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

				<News />
			</div>

			{/* Main Content */}
			<div className="main-content">
				<div className="finance-analytics">
					{/* Header */}
					<div className="header">
						<h2 className="header-title">Expense Tracker</h2>
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
								Add Expense
							</button>
						</div>
					</div>

					{/* Dashboard Grid */}
					<div className="dashboard-grid">
						{/* Add Expense Form */}
						{showAddForm && (
							<div
								className="dashboard-card card-full"
								style={{ padding: "20px" }}>
								<h3 className="card-title">Add New Expense</h3>
								<form
									onSubmit={handleAddExpense}
									className="expense-form">
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
											<label>Category</label>
											<input
												type="text"
												name="category"
												value={newExpense.category}
												onChange={handleInputChange}
												style={{
													width: "100%",
													padding: "10px",
													backgroundColor: "#2d2d2d",
													border: "1px solid var(--border-color)",
													borderRadius: "5px",
													color: "var(--text-light)",
												}}
												placeholder="Housing, Food, Transport, etc."
											/>
										</div>
										<div
											className="form-group"
											style={{ flex: 1 }}>
											<label>Amount</label>
											<input
												type="number"
												name="amount"
												value={newExpense.amount}
												onChange={handleInputChange}
												style={{
													width: "100%",
													padding: "10px",
													backgroundColor: "#2d2d2d",
													border: "1px solid var(--border-color)",
													borderRadius: "5px",
													color: "var(--text-light)",
												}}
												placeholder="Expense amount"
											/>
										</div>
										<div
											className="form-group"
											style={{ flex: 1 }}>
											<label>Date</label>
											<input
												type="date"
												name="date"
												value={newExpense.date}
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
										style={{ marginBottom: "20px" }}>
										<div
											className="form-group"
											style={{ flex: 1 }}>
											<label>Description (Optional)</label>
											<input
												type="text"
												name="description"
												value={newExpense.description}
												onChange={handleInputChange}
												style={{
													width: "100%",
													padding: "10px",
													backgroundColor: "#2d2d2d",
													border: "1px solid var(--border-color)",
													borderRadius: "5px",
													color: "var(--text-light)",
												}}
												placeholder="Brief description of the expense"
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
											Save Expense
										</button>
									</div>
								</form>
							</div>
						)}

						{/* Expense Stats Cards */}
						<div className="dashboard-card card-wide">
							<h3 className="card-title">Total Expenses</h3>
							<div
								className="balance-amount loss"
								style={{ color: "#ff5252" }}>
								{formatCurrency(total)}
							</div>
							<div className="balance-label">
								From {expenseData.length} transactions
							</div>
						</div>

						<div className="dashboard-card card-wide">
							<h3 className="card-title">Monthly Average</h3>
							<div
								className="balance-amount"
								style={{ color: "#ff9f43" }}>
								{formatCurrency(average)}
							</div>
							<div className="balance-label">Average monthly spending</div>
						</div>

						<div className="dashboard-card card-wide">
							<h3 className="card-title">Largest Category</h3>
							<div
								className="balance-amount"
								style={{ color: "#5e5ce6" }}>
								{formatCurrency(largest.amount)}
							</div>
							<div className="balance-label">{largest.category}</div>
						</div>

						{/* Expense Distribution Chart */}
						<div className="dashboard-card card-wide">
							<h3 className="card-title">Expense Distribution</h3>
							<div
								style={{
									height: "300px",
									position: "relative",
									display: "flex",
									justifyContent: "center",
								}}>
								<Pie
									data={prepareCategoryData()}
									options={pieOptions}
								/>
							</div>
						</div>

						{/* Expense Trend Chart */}
						<div className="dashboard-card card-wide">
							<h3 className="card-title">Monthly Expense Trend</h3>
							<div style={{ height: "300px", position: "relative" }}>
								<Line
									data={prepareChartData()}
									options={chartOptions}
								/>
							</div>
						</div>

						{/* Expense List */}
						<div className="dashboard-card card-full">
							<h3 className="card-title">Recent Expenses</h3>
							<div className="expense-list">
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
												Category
											</th>
											<th
												style={{
													textAlign: "left",
													padding: "10px",
													borderBottom: "1px solid var(--border-color)",
												}}>
												Description
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
										{[...expenseData]
											.sort((a, b) => new Date(b.date) - new Date(a.date))
											.slice(0, 10)
											.map((expense, index) => (
												<tr key={index}>
													<td
														style={{
															padding: "10px",
															borderBottom: "1px solid var(--border-color)",
														}}>
														{new Date(expense.date).toLocaleDateString()}
													</td>
													<td
														style={{
															padding: "10px",
															borderBottom: "1px solid var(--border-color)",
														}}>
														{expense.category}
													</td>
													<td
														style={{
															padding: "10px",
															borderBottom: "1px solid var(--border-color)",
														}}>
														{expense.description}
													</td>
													<td
														style={{
															textAlign: "right",
															padding: "10px",
															borderBottom: "1px solid var(--border-color)",
															color: "#ff5252",
														}}>
														{formatCurrency(expense.amount)}
													</td>
													<td
														style={{
															textAlign: "center",
															padding: "10px",
															borderBottom: "1px solid var(--border-color)",
														}}>
														{expense.recurring ? (
															<span
																style={{
																	color: "#ff5252",
																	display: "flex",
																	alignItems: "center",
																	justifyContent: "center",
																}}>
																<FaArrowDown style={{ marginRight: "5px" }} />{" "}
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
										{expenseData.length === 0 && (
											<tr>
												<td
													colSpan="5"
													style={{ textAlign: "center", padding: "20px" }}>
													No expense data available
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

export default Expenses;
