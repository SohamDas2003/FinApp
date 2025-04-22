import React, { useState, useEffect } from "react";
import {
	FaRegCalendarAlt,
	FaPlus,
	FaArrowDown,
	FaFilter,
} from "react-icons/fa";
import { Pie, Bar } from "react-chartjs-2";
import "../styles/App.css";

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
		<>
			{/* Header */}
			<div className="header">
				<h1>Expense Management</h1>
				<div className="user-info">
					<h3>{user.name}</h3>
					<img
						src={user.profilePic}
						alt="Profile"
						className="profile-image-small"
					/>
				</div>
			</div>

			{/* Tab Menu */}
			<div className="tab-menu">
				<div
					className={`tab ${activeTab === "expenses" ? "active" : ""}`}
					onClick={() => setActiveTab("expenses")}
				>
					All Expenses
				</div>
				<div
					className={`tab ${activeTab === "categories" ? "active" : ""}`}
					onClick={() => setActiveTab("categories")}
				>
					By Category
				</div>
				<div
					className={`tab ${activeTab === "analysis" ? "active" : ""}`}
					onClick={() => setActiveTab("analysis")}
				>
					Analysis
				</div>
				<div className="tab-spacer"></div>
				<button
					className="add-button"
					onClick={() => setShowAddForm(!showAddForm)}
					style={{
						background: "#ff6384",
						border: "none",
						borderRadius: "5px",
						padding: "8px 15px",
						color: "white",
						display: "flex",
						alignItems: "center",
						cursor: "pointer",
						fontWeight: "bold",
					}}>
					<FaPlus style={{ marginRight: "5px" }} />
					Add Expense
				</button>
			</div>

			{/* Finance Analytics */}
			<div className="finance-analytics">
				{/* Add Expense Form */}
				{showAddForm && (
					<div className="dashboard-card card-full" style={{ marginBottom: "20px" }}>
						<h3 className="card-title">Add New Expense</h3>
						<form onSubmit={handleAddExpense}>
							<div
								style={{
									display: "grid",
									gridTemplateColumns: "1fr 1fr 1fr 1fr",
									gap: "15px",
								}}>
								<div>
									<label
										htmlFor="category"
										style={{ display: "block", marginBottom: "5px" }}>
										Category
									</label>
									<select
										id="category"
										name="category"
										value={newExpense.category}
										onChange={handleInputChange}
										required
										style={{
											width: "100%",
											padding: "8px",
											borderRadius: "4px",
											border: "1px solid var(--border-color)",
											backgroundColor: "#2a2a2a",
											color: "#fff",
										}}>
										<option value="">Select Category</option>
										<option value="Food">Food</option>
										<option value="Transportation">Transportation</option>
										<option value="Utilities">Utilities</option>
										<option value="Housing">Housing</option>
										<option value="Entertainment">Entertainment</option>
										<option value="Health">Health</option>
										<option value="Shopping">Shopping</option>
										<option value="Education">Education</option>
										<option value="Other">Other</option>
									</select>
								</div>
								<div>
									<label
										htmlFor="amount"
										style={{ display: "block", marginBottom: "5px" }}>
										Amount
									</label>
									<input
										type="number"
										id="amount"
										name="amount"
										value={newExpense.amount}
										onChange={handleInputChange}
										required
										style={{
											width: "100%",
											padding: "8px",
											borderRadius: "4px",
											border: "1px solid var(--border-color)",
											backgroundColor: "#2a2a2a",
											color: "#fff",
										}}
									/>
								</div>
								<div>
									<label
										htmlFor="date"
										style={{ display: "block", marginBottom: "5px" }}>
										Date
									</label>
									<input
										type="date"
										id="date"
										name="date"
										value={newExpense.date}
										onChange={handleInputChange}
										required
										style={{
											width: "100%",
											padding: "8px",
											borderRadius: "4px",
											border: "1px solid var(--border-color)",
											backgroundColor: "#2a2a2a",
											color: "#fff",
										}}
									/>
								</div>
								<div>
									<label
										htmlFor="description"
										style={{ display: "block", marginBottom: "5px" }}>
										Description
									</label>
									<input
										type="text"
										id="description"
										name="description"
										value={newExpense.description}
										onChange={handleInputChange}
										style={{
											width: "100%",
											padding: "8px",
											borderRadius: "4px",
											border: "1px solid var(--border-color)",
											backgroundColor: "#2a2a2a",
											color: "#fff",
										}}
									/>
								</div>
							</div>
							<div style={{ marginTop: "15px", textAlign: "right" }}>
								<button
									type="submit"
									style={{
										backgroundColor: "#ff6384",
										color: "white",
										border: "none",
										borderRadius: "4px",
										padding: "8px 15px",
										cursor: "pointer",
										fontWeight: "bold",
									}}>
									Add Expense
								</button>
							</div>
						</form>
					</div>
				)}

				{/* Dashboard Grid */}
				<div className="dashboard-grid">
					<div className="dashboard-card card-wide">
						<h3 className="card-title">Total Expenses</h3>
						<div className="balance-amount" style={{ color: "#ff6384" }}>
							{formatCurrency(calculateTotal())}
						</div>
						<div className="balance-label">Total for all time</div>
					</div>

					<div className="dashboard-card card-wide">
						<h3 className="card-title">Recent Spending</h3>
						<div className="balance-amount" style={{ color: "#ff6384" }}>
							{formatCurrency(
								expenseData
									.filter(
										(expense) =>
											new Date(expense.date) >
											new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
									)
									.reduce((total, expense) => total + expense.amount, 0)
							)}
						</div>
						<div className="balance-label">Last 30 days</div>
					</div>

					<div className="dashboard-card card-wide">
						<h3 className="card-title">Top Category</h3>
						<div className="balance-amount">
							{Object.entries(getExpensesByCategory()).length > 0
								? Object.entries(getExpensesByCategory()).sort(
										(a, b) => b[1] - a[1]
									)[0][0]
								: "N/A"}
						</div>
						<div className="balance-label">
							{Object.entries(getExpensesByCategory()).length > 0
								? formatCurrency(
										Object.entries(getExpensesByCategory()).sort(
											(a, b) => b[1] - a[1]
										)[0][1]
									)
								: "No expenses yet"}
						</div>
					</div>

					{/* Expense Charts */}
					<div className="dashboard-card card-full">
						<h3 className="card-title">Monthly Expenses</h3>
						<div style={{ height: "300px", position: "relative" }}>
							<Bar data={prepareBarChartData()} options={barChartOptions} />
						</div>
					</div>

					<div className="dashboard-card card-full">
						<h3 className="card-title">Expenses by Category</h3>
						<div style={{ height: "300px", position: "relative" }}>
							<Pie data={preparePieChartData()} options={pieChartOptions} />
						</div>
					</div>

					{/* Expense List */}
					<div className="dashboard-card card-full">
						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
							<h3 className="card-title">Expense History</h3>
							<div style={{ display: "flex", alignItems: "center" }}>
								<FaFilter style={{ marginRight: "5px", color: "#b3b3b3" }} />
								<select
									value={filterCategory}
									onChange={(e) => setFilterCategory(e.target.value)}
									style={{
										padding: "5px 10px",
										backgroundColor: "#2a2a2a",
										color: "#b3b3b3",
										border: "1px solid var(--border-color)",
										borderRadius: "4px",
									}}>
									{getCategories().map((category) => (
										<option key={category} value={category}>
											{category.charAt(0).toUpperCase() + category.slice(1)}
										</option>
									))}
								</select>
							</div>
						</div>
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
											Action
										</th>
									</tr>
								</thead>
								<tbody>
									{getFilteredExpenses().length > 0 ? (
										getFilteredExpenses()
											.sort((a, b) => new Date(b.date) - new Date(a.date))
											.map((expense) => (
												<tr key={expense.id}>
													<td
														style={{
															padding: "10px",
															borderBottom:
																"1px solid var(--border-color)",
														}}>
														{new Date(expense.date).toLocaleDateString()}
													</td>
													<td
														style={{
															padding: "10px",
															borderBottom:
																"1px solid var(--border-color)",
														}}>
														{expense.category}
													</td>
													<td
														style={{
															padding: "10px",
															borderBottom:
																"1px solid var(--border-color)",
														}}>
														{expense.description || "-"}
													</td>
													<td
														style={{
															textAlign: "right",
															padding: "10px",
															borderBottom:
																"1px solid var(--border-color)",
															color: "#ff6384",
															fontWeight: "bold",
														}}>
														{formatCurrency(expense.amount)}
													</td>
													<td
														style={{
															textAlign: "center",
															padding: "10px",
															borderBottom:
																"1px solid var(--border-color)",
														}}>
														<div
															style={{
																display: "flex",
																alignItems: "center",
																justifyContent: "center",
															}}>
															<button
																onClick={() =>
																	handleDeleteExpense(expense.id)
																}
																style={{
																	background: "none",
																	border: "none",
																	color: "#ff5252",
																	cursor: "pointer",
																	fontSize: "14px",
																}}>
																Delete
															</button>
														</div>
													</td>
												</tr>
											))
									) : (
										<tr>
											<td
												colSpan="5"
												style={{
													textAlign: "center",
													padding: "20px",
													color: "var(--text-secondary)",
												}}>
												No expense records found. Add your first expense!
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Expenses;
