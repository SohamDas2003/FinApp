import React, { useState, useEffect } from "react";
import {
	FaRegCalendarAlt,
	FaPlus,
	FaArrowUp,
	FaArrowDown,
} from "react-icons/fa";
import { Line } from "react-chartjs-2";
import "../styles/App.css";

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
		<>
			{/* Header */}
			<div className="header">
				<h1>Income Management</h1>
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
					className={`tab ${activeTab === "income" ? "active" : ""}`}
					onClick={() => setActiveTab("income")}
				>
					All Income
				</div>
				<div
					className={`tab ${activeTab === "recurring" ? "active" : ""}`}
					onClick={() => setActiveTab("recurring")}
				>
					Recurring
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
						background: "#36f9ae",
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

			{/* Finance Analytics */}
			<div className="finance-analytics">
				{/* Add Income Form */}
				{showAddForm && (
					<div className="dashboard-card card-full" style={{ marginBottom: "20px" }}>
						<h3 className="card-title">Add New Income</h3>
						<form onSubmit={handleAddIncome}>
							<div
								style={{
									display: "grid",
									gridTemplateColumns: "1fr 1fr 1fr auto",
									gap: "15px",
								}}>
								<div>
									<label
										htmlFor="source"
										style={{ display: "block", marginBottom: "5px" }}>
										Source
									</label>
									<input
										type="text"
										id="source"
										name="source"
										value={newIncome.source}
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
										htmlFor="amount"
										style={{ display: "block", marginBottom: "5px" }}>
										Amount
									</label>
									<input
										type="number"
										id="amount"
										name="amount"
										value={newIncome.amount}
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
										value={newIncome.date}
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
								<div style={{ alignSelf: "end" }}>
									<button
										type="submit"
										style={{
											backgroundColor: "#36f9ae",
											color: "#000",
											border: "none",
											borderRadius: "4px",
											padding: "8px 15px",
											cursor: "pointer",
											fontWeight: "bold",
										}}>
										Add Income
									</button>
								</div>
							</div>
						</form>
					</div>
				)}

				{/* Dashboard Grid */}
				<div className="dashboard-grid">
					<div className="dashboard-card card-wide">
						<h3 className="card-title">Total Income</h3>
						<div className="balance-amount">{formatCurrency(total)}</div>
						<div className="balance-label">Total income recorded</div>
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
									{incomeData.length > 0 ? (
										incomeData
											.sort((a, b) => new Date(b.date) - new Date(a.date))
											.map((income) => (
												<tr key={income.id}>
													<td
														style={{
															padding: "10px",
															borderBottom:
																"1px solid var(--border-color)",
														}}>
														{new Date(
															income.date
														).toLocaleDateString()}
													</td>
													<td
														style={{
															padding: "10px",
															borderBottom:
																"1px solid var(--border-color)",
														}}>
														{income.source}
													</td>
													<td
														style={{
															textAlign: "right",
															padding: "10px",
															borderBottom:
																"1px solid var(--border-color)",
															color: "#36f9ae",
															fontWeight: "bold",
														}}>
														{formatCurrency(income.amount)}
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
																gap: "5px",
															}}>
															<span
																style={{
																	backgroundColor:
																		"rgba(54, 249, 174, 0.2)",
																	color: "#36f9ae",
																	padding: "2px 8px",
																	borderRadius: "4px",
																	fontSize: "12px",
																	display: "flex",
																	alignItems: "center",
																}}>
																<FaArrowUp
																	style={{ marginRight: "3px" }}
																/>
																Received
															</span>
															<button
																onClick={() =>
																	handleDeleteIncome(income.id)
																}
																style={{
																	background: "none",
																	border: "none",
																	color: "#ff5252",
																	cursor: "pointer",
																	fontSize: "14px",
																	padding: "2px 5px",
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
												colSpan="4"
												style={{
													textAlign: "center",
													padding: "20px",
													color: "var(--text-secondary)",
												}}>
												No income records found. Add your first income!
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

export default Income;
