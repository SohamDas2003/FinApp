import React, { useState, useEffect } from "react";
import {
	FaPlus,
	FaArrowUp,
	FaArrowDown,
	FaChartPie,
	FaRegCalendarAlt,
} from "react-icons/fa";
import { Pie, Line } from "react-chartjs-2";
import "../styles/App.css";

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
		<>
			{/* Header */}
			<div className="header">
				<h1>Investment Portfolio</h1>
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
					className={`tab ${activeTab === "investments" ? "active" : ""}`}
					onClick={() => setActiveTab("investments")}
				>
					All Investments
				</div>
				<div
					className={`tab ${activeTab === "portfolio" ? "active" : ""}`}
					onClick={() => setActiveTab("portfolio")}
				>
					Portfolio
				</div>
				<div
					className={`tab ${activeTab === "performance" ? "active" : ""}`}
					onClick={() => setActiveTab("performance")}
				>
					Performance
				</div>
				<div className="tab-spacer"></div>
				<button
					className="add-button"
					onClick={() => setShowAddForm(!showAddForm)}
					style={{
						background: "#4CAF50",
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
					Add Investment
				</button>
			</div>

			{/* Finance Analytics */}
			<div className="finance-analytics">
				{/* Add Investment Form */}
				{showAddForm && (
					<div className="dashboard-card card-full" style={{ marginBottom: "20px" }}>
						<h3 className="card-title">Add New Investment</h3>
						<form onSubmit={handleAddInvestment}>
							<div
								style={{
									display: "grid",
									gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
									gap: "15px",
								}}>
								<div>
									<label
										htmlFor="name"
										style={{ display: "block", marginBottom: "5px" }}>
										Investment Name
									</label>
									<input
										type="text"
										id="name"
										name="name"
										value={newInvestment.name}
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
										htmlFor="type"
										style={{ display: "block", marginBottom: "5px" }}>
										Type
									</label>
									<select
										id="type"
										name="type"
										value={newInvestment.type}
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
										<option value="">Select Type</option>
										<option value="Stocks">Stocks</option>
										<option value="Mutual Funds">Mutual Funds</option>
										<option value="Fixed Deposits">Fixed Deposits</option>
										<option value="Gold">Gold</option>
										<option value="Real Estate">Real Estate</option>
										<option value="Cryptocurrency">Cryptocurrency</option>
										<option value="Bonds">Bonds</option>
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
										value={newInvestment.amount}
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
										value={newInvestment.date}
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
										value={newInvestment.description}
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
										backgroundColor: "#4CAF50",
										color: "white",
										border: "none",
										borderRadius: "4px",
										padding: "8px 15px",
										cursor: "pointer",
										fontWeight: "bold",
									}}>
									Add Investment
								</button>
							</div>
						</form>
					</div>
				)}

				{/* Dashboard Grid */}
				<div className="dashboard-grid">
					<div className="dashboard-card card-wide">
						<h3 className="card-title">Total Investments</h3>
						<div className="balance-amount" style={{ color: "#2196F3" }}>
							{formatCurrency(totalInvestment)}
						</div>
						<div className="balance-label">Total invested amount</div>
					</div>

					<div className="dashboard-card card-wide">
						<h3 className="card-title">Returns</h3>
						<div className="balance-amount" style={{ color: totalReturns >= 0 ? "#4CAF50" : "#FF5252" }}>
							{formatCurrency(totalReturns)}
						</div>
						<div className="balance-label">
							<span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
								{totalReturns >= 0 ? (
									<>
										<FaArrowUp style={{ color: "#4CAF50", marginRight: "5px" }} />
										{((totalReturns / totalInvestment) * 100).toFixed(2)}% growth
									</>
								) : (
									<>
										<FaArrowDown style={{ color: "#FF5252", marginRight: "5px" }} />
										{Math.abs((totalReturns / totalInvestment) * 100).toFixed(2)}% loss
									</>
								)}
							</span>
						</div>
					</div>

					<div className="dashboard-card card-wide">
						<h3 className="card-title">Portfolio Value</h3>
						<div className="balance-amount" style={{ color: "#673AB7" }}>
							{formatCurrency(totalInvestment + totalReturns)}
						</div>
						<div className="balance-label">Current total value</div>
					</div>

					{/* Investment Charts */}
					<div className="dashboard-card card-full">
						<h3 className="card-title">Portfolio Performance</h3>
						<div style={{ height: "300px", position: "relative" }}>
							<Line data={prepareReturnsChartData()} options={lineChartOptions} />
						</div>
					</div>

					<div className="dashboard-card card-full">
						<h3 className="card-title">Asset Allocation</h3>
						<div style={{ height: "300px", position: "relative" }}>
							<Pie data={preparePieChartData()} options={pieChartOptions} />
						</div>
					</div>

					{/* Investment List */}
					<div className="dashboard-card card-full">
						<h3 className="card-title">Investment History</h3>
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
											Date
										</th>
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
											Type
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
												textAlign: "right",
												padding: "10px",
												borderBottom: "1px solid var(--border-color)",
											}}>
											Returns
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
									{investmentData.length > 0 ? (
										investmentData
											.sort((a, b) => new Date(b.date) - new Date(a.date))
											.map((investment) => (
												<tr key={investment.id}>
													<td
														style={{
															padding: "10px",
															borderBottom:
																"1px solid var(--border-color)",
														}}>
														{new Date(investment.date).toLocaleDateString()}
													</td>
													<td
														style={{
															padding: "10px",
															borderBottom:
																"1px solid var(--border-color)",
														}}>
														{investment.name}
													</td>
													<td
														style={{
															padding: "10px",
															borderBottom:
																"1px solid var(--border-color)",
														}}>
														{investment.type}
													</td>
													<td
														style={{
															textAlign: "right",
															padding: "10px",
															borderBottom:
																"1px solid var(--border-color)",
															color: "#2196F3",
															fontWeight: "bold",
														}}>
														{formatCurrency(investment.amount)}
													</td>
													<td
														style={{
															textAlign: "right",
															padding: "10px",
															borderBottom:
																"1px solid var(--border-color)",
															color:
																investment.returns >= 0
																	? "#4CAF50"
																	: "#FF5252",
															fontWeight: "bold",
														}}>
														<div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
															{investment.returns >= 0 ? (
																<FaArrowUp style={{ marginRight: "5px" }} />
															) : (
																<FaArrowDown style={{ marginRight: "5px" }} />
															)}
															{formatCurrency(investment.returns)}
														</div>
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
																	handleDeleteInvestment(investment.id)
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
												colSpan="6"
												style={{
													textAlign: "center",
													padding: "20px",
													color: "var(--text-secondary)",
												}}>
												No investment records found. Add your first investment!
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

export default Investments;
