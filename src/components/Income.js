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
} from "react-icons/fa";
import { Line } from "react-chartjs-2";
import "../styles/App.css";
import News from "./News";

const Income = ({ user, onLogout, onNavigate }) => {
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
		} else if (user.financialDetails) {
			// Generate some example income data based on user's financial details
			const monthlyIncome = user.financialDetails.monthlyIncome || 0;
			const salary = user.financialDetails.salary?.amount || 0;

			const today = new Date();
			const last6Months = Array.from({ length: 6 }, (_, i) => {
				const date = new Date();
				date.setMonth(today.getMonth() - i);
				return date.toISOString().slice(0, 7); // YYYY-MM format
			}).reverse();

			const generatedData = [
				{
					source: "Salary",
					amount: salary || monthlyIncome * 0.8,
					date: today.toISOString().slice(0, 10),
					recurring: true,
				},
			];

			// Add some past income entries
			last6Months.forEach((monthDate, index) => {
				const pastDate = new Date(monthDate + "-01");
				pastDate.setDate(Math.floor(Math.random() * 28) + 1);

				generatedData.push({
					source: "Salary",
					amount: (salary || monthlyIncome * 0.8) * (0.95 + index * 0.01),
					date: pastDate.toISOString().slice(0, 10),
					recurring: true,
				});

				// Add occasional additional income
				if (index % 2 === 0) {
					const bonusDate = new Date(monthDate + "-01");
					bonusDate.setDate(Math.floor(Math.random() * 28) + 1);

					generatedData.push({
						source: "Side Project",
						amount: monthlyIncome * 0.1 * (1 + Math.random() * 0.4),
						date: bonusDate.toISOString().slice(0, 10),
						recurring: false,
					});
				}
			});

			setIncomeData(generatedData);

			// Save this data
			const updatedUser = {
				...storedUser,
				incomeData: generatedData,
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
		setNewIncome({
			...newIncome,
			[name]: value,
		});
	};

	const handleAddIncome = (e) => {
		e.preventDefault();

		if (!newIncome.source || !newIncome.amount || !newIncome.date) {
			alert("Please fill in all fields");
			return;
		}

		const incomeEntry = {
			...newIncome,
			amount: parseFloat(newIncome.amount),
			recurring: false,
		};

		const updatedIncomeData = [...incomeData, incomeEntry];
		setIncomeData(updatedIncomeData);

		// Save to localStorage
		const storedUser = JSON.parse(localStorage.getItem("finapp_user"));
		const updatedUser = {
			...storedUser,
			incomeData: updatedIncomeData,
		};
		localStorage.setItem("finapp_user", JSON.stringify(updatedUser));

		// Reset form
		setNewIncome({
			source: "",
			amount: "",
			date: "",
		});
		setShowAddForm(false);
	};

	// Prepare chart data
	const prepareChartData = () => {
		// Group by month
		const sortedData = [...incomeData].sort(
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
					label: "Monthly Income",
					data: data,
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
