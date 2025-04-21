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
} from "react-icons/fa";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import News from "./News";
import "../styles/App.css";

const Expenses = ({ user, onLogout, onNavigate }) => {
	const [activeTab, setActiveTab] = useState("expenses");
	const [expenseData, setExpenseData] = useState([]);
	const [newExpense, setNewExpense] = useState({
		category: "",
		amount: "",
		date: "",
		description: "",
	});
	const [showAddForm, setShowAddForm] = useState(false);

	useEffect(() => {
		// Load any saved expense data
		const storedUser = JSON.parse(localStorage.getItem("finapp_user"));
		if (storedUser && storedUser.expenseData) {
			setExpenseData(storedUser.expenseData);
		} else if (user.financialDetails) {
			// Generate some example expense data based on user's financial details
			const monthlyIncome = user.financialDetails.monthlyIncome || 0;
			const majorExpenses =
				user.financialDetails.majorExpenses || monthlyIncome * 0.4;
			const budgetCategories = user.financialDetails.budgetCategories || [];

			const today = new Date();
			const last6Months = Array.from({ length: 6 }, (_, i) => {
				const date = new Date();
				date.setMonth(today.getMonth() - i);
				return date.toISOString().slice(0, 7); // YYYY-MM format
			}).reverse();

			let generatedData = [];

			// Create expense entries for each month
			last6Months.forEach((monthDate, monthIndex) => {
				const daysInMonth = new Date(
					parseInt(monthDate.slice(0, 4)),
					parseInt(monthDate.slice(5, 7)),
					0
				).getDate();

				// Create expenses based on budget categories
				budgetCategories.forEach((category, catIndex) => {
					const categoryExpenseTotal =
						((majorExpenses * category.percentage) / 100) *
						(0.9 + Math.random() * 0.2);
					const numberOfExpenses = 1 + Math.floor(Math.random() * 3); // 1-3 expenses per category per month

					// Split the total into separate expenses
					for (let i = 0; i < numberOfExpenses; i++) {
						const expenseDay = Math.floor(Math.random() * daysInMonth) + 1;
						const expenseDate = new Date(
							monthDate + `-${expenseDay.toString().padStart(2, "0")}`
						);

						generatedData.push({
							category: category.name,
							amount: categoryExpenseTotal / numberOfExpenses,
							date: expenseDate.toISOString().slice(0, 10),
							description: `${category.name} expense`,
							recurring: catIndex < 3, // First few categories are usually recurring
						});
					}
				});

				// Add a few random one-time expenses
				if (monthIndex % 2 === 0) {
					const randomDay = Math.floor(Math.random() * daysInMonth) + 1;
					const randomDate = new Date(
						monthDate + `-${randomDay.toString().padStart(2, "0")}`
					);

					generatedData.push({
						category: "Miscellaneous",
						amount: majorExpenses * 0.05 * (1 + Math.random()),
						date: randomDate.toISOString().slice(0, 10),
						description: "Unexpected expense",
						recurring: false,
					});
				}
			});

			setExpenseData(generatedData);

			// Save this data
			const updatedUser = {
				...storedUser,
				expenseData: generatedData,
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
		setNewExpense({
			...newExpense,
			[name]: value,
		});
	};

	const handleAddExpense = (e) => {
		e.preventDefault();

		if (!newExpense.category || !newExpense.amount || !newExpense.date) {
			alert("Please fill in all required fields");
			return;
		}

		const expenseEntry = {
			...newExpense,
			amount: parseFloat(newExpense.amount),
			recurring: false,
		};

		const updatedExpenseData = [...expenseData, expenseEntry];
		setExpenseData(updatedExpenseData);

		// Save to localStorage
		const storedUser = JSON.parse(localStorage.getItem("finapp_user"));
		const updatedUser = {
			...storedUser,
			expenseData: updatedExpenseData,
		};
		localStorage.setItem("finapp_user", JSON.stringify(updatedUser));

		// Reset form
		setNewExpense({
			category: "",
			amount: "",
			date: "",
			description: "",
		});
		setShowAddForm(false);
	};

	// Prepare chart data for monthly expense trend
	const prepareChartData = () => {
		// Group by month
		const sortedData = [...expenseData].sort(
			(a, b) => new Date(a.date) - new Date(b.date)
		);

		const monthlyTotals = {};
		sortedData.forEach((item) => {
			const month = item.date.slice(0, 7); // YYYY-MM
			monthlyTotals[month] = (monthlyTotals[month] || 0) + item.amount;
		});

		const labels = Object.keys(monthlyTotals).sort();
		const data = labels.map((month) => monthlyTotals[month]);

		// Get month names for display
		const monthNames = labels.map((month) => {
			const date = new Date(month + "-01");
			return date.toLocaleString("default", {
				month: "short",
				year: "numeric",
			});
		});

		return {
			labels: monthNames,
			datasets: [
				{
					label: "Monthly Expenses",
					data: data,
					borderColor: "#ff5252",
					backgroundColor: "rgba(255, 82, 82, 0.1)",
					tension: 0.4,
					fill: true,
				},
			],
		};
	};

	// Prepare category distribution data for pie chart
	const prepareCategoryData = () => {
		const categoryTotals = {};

		expenseData.forEach((item) => {
			categoryTotals[item.category] =
				(categoryTotals[item.category] || 0) + item.amount;
		});

		const categories = Object.keys(categoryTotals);
		const data = categories.map((cat) => categoryTotals[cat]);

		// Generate colors
		const backgroundColors = [
			"#ff5252",
			"#ff9f43",
			"#5e5ce6",
			"#28c76f",
			"#7367f0",
			"#ea5455",
			"#3bafda",
			"#4bc0c0",
			"#a78bfa",
			"#f6ad55",
		];

		return {
			labels: categories,
			datasets: [
				{
					data: data,
					backgroundColor: backgroundColors.slice(0, categories.length),
					borderWidth: 0,
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

	const pieOptions = {
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
					font: {
						size: 11,
					},
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

	// Calculate total and average expenses
	const calculateStats = () => {
		if (expenseData.length === 0)
			return { total: 0, average: 0, largest: { amount: 0, category: "N/A" } };

		const total = expenseData.reduce(
			(sum, item) => sum + parseFloat(item.amount),
			0
		);

		// Get unique months
		const months = new Set(expenseData.map((item) => item.date.slice(0, 7)));
		const average = total / months.size;

		// Find largest expense category
		const categoryTotals = {};
		expenseData.forEach((item) => {
			categoryTotals[item.category] =
				(categoryTotals[item.category] || 0) + item.amount;
		});

		let largestCategory = { amount: 0, category: "N/A" };
		for (const [category, amount] of Object.entries(categoryTotals)) {
			if (amount > largestCategory.amount) {
				largestCategory = { amount, category };
			}
		}

		return { total, average, largest: largestCategory };
	};

	const { total, average, largest } = calculateStats();

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
