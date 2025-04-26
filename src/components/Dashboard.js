import React, { useState, useEffect } from "react";
import {
	FaArrowUp,
	FaArrowDown,
	FaLightbulb,
	FaMoneyBillWave,
	FaFlag,
	FaFileInvoiceDollar,
	FaHandHoldingUsd
} from "react-icons/fa";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import News from "./News";
import AppLayout from "./AppLayout";

// Register ChartJS components
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend
);

const Dashboard = ({ user }) => {
	const [activeTab, setActiveTab] = useState("overview");
	const [activeFilter, setActiveFilter] = useState("all");
	const [userData, setUserData] = useState(user);
	const [features, setFeatures] = useState(() => {
		// Load feature toggle states from localStorage if available
		const savedFeatures = localStorage.getItem('finapp_features');
		return savedFeatures ? JSON.parse(savedFeatures) : {
			cashFlowForecasting: false,
			billReminder: false,
			debtRepayment: false
		};
	});

	// Format numbers to Indian currency format
	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
			maximumFractionDigits: 0,
		}).format(amount);
	};

	useEffect(() => {
		// Fetch the latest user data including financial details
		const storedUser = JSON.parse(localStorage.getItem("finapp_user"));
		if (storedUser && storedUser.financialDetails) {
			setUserData(storedUser);
		}
	}, []);

	// Use actual user data if available, otherwise use default values
	const monthlyIncome = userData?.financialDetails?.monthlyIncome || 0;
	const accountBalance = userData?.financialDetails?.accountBalance || 985653;
	const savingsGoal = userData?.financialDetails?.savingsGoal || 0;
	const majorExpenses = userData?.financialDetails?.majorExpenses || 0;
	const salaryAmount = userData?.financialDetails?.salary?.amount || 0;

	// Calculate basic metrics for the dashboard
	const currentProfit = monthlyIncome - (majorExpenses || monthlyIncome * 0.25);
	const incomePercentage =
		monthlyIncome > 0 ? Math.round((currentProfit / monthlyIncome) * 100) : 0;
	const expensePercentage = 100 - incomePercentage;

	// Mock financial data for line chart based on user input
	const chartData = {
		labels: [
			"May 2023",
			"Jun 2023",
			"Jul 2023",
			"Aug 2023",
			"Sep 2023",
			"Oct 2023",
			"Nov 2023",
			"Dec 2023",
			"Jan 2024",
			"Feb 2024",
			"Mar 2024",
			"Apr 2024",
		],
		datasets: [
			{
				label: "Income",
				data: [
					monthlyIncome * 0.8,
					monthlyIncome * 0.9,
					monthlyIncome * 0.85,
					monthlyIncome * 0.95,
					monthlyIncome * 0.9,
					monthlyIncome * 0.95,
					monthlyIncome * 1.0,
					monthlyIncome * 1.1,
					monthlyIncome * 1.05,
					monthlyIncome * 1.05,
					monthlyIncome * 1.1,
					monthlyIncome * 1.2,
				],
				borderColor: "#36f9ae",
				backgroundColor: "rgba(54, 249, 174, 0.1)",
				tension: 0.4,
			},
		],
	};

	// Mock financial data for bar chart
	const barChartData = {
		labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
		datasets: [
			{
				label: "Revenue",
				data: [
					monthlyIncome / 4,
					monthlyIncome / 4,
					monthlyIncome / 4,
					monthlyIncome / 4,
					monthlyIncome / 12,
				],
				backgroundColor: "#36f9ae",
			},
			{
				label: "Expenses",
				data: [
					majorExpenses / 5,
					(majorExpenses / 5) * 1.2,
					(majorExpenses / 5) * 1.5,
					(majorExpenses / 5) * 0.8,
					(majorExpenses / 5) * 1.1,
				],
				backgroundColor: "#ff5252",
			},
		],
	};

	// Use actual budget categories if available
	const budgetCategories = userData?.financialDetails?.budgetCategories || [
		{ name: "Housing", percentage: 30 },
		{ name: "Food", percentage: 15 },
		{ name: "Transportation", percentage: 10 },
		{ name: "Utilities", percentage: 10 },
		{ name: "Entertainment", percentage: 5 },
		{ name: "Savings", percentage: 20 },
		{ name: "Others", percentage: 10 },
	];

	// Create data for budget allocation pie chart
	const budgetAllocationData = {
		labels: budgetCategories.map((cat) => cat.name),
		datasets: [
			{
				data: budgetCategories.map((cat) => cat.percentage),
				backgroundColor: [
					"#36f9ae",
					"#32c8e9",
					"#627bf4",
					"#8c52ff",
					"#c455fb",
					"#ff5757",
					"#ff9f43",
				],
				borderWidth: 0,
			},
		],
	};

	// Data for pie chart
	const pieChartData = {
		labels: ["Revenue", "Expenses"],
		datasets: [
			{
				data: [incomePercentage, expensePercentage],
				backgroundColor: ["#36f9ae", "#ff5252"],
				borderWidth: 0,
			},
		],
	};

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				backgroundColor: "#1d1d1d",
				titleColor: "#ffffff",
				bodyColor: "#ffffff",
				borderColor: "#333333",
				borderWidth: 1,
				padding: 10,
				displayColors: false,
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

	const barChartOptions = {
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
					display: false,
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

	const pieChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				callbacks: {
					label: function (context) {
						return `${context.label}: ${context.raw}%`;
					},
				},
			},
		},
	};

	const doughnutOptions = {
		responsive: true,
		maintainAspectRatio: false,
		cutout: "70%",
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				callbacks: {
					label: function (context) {
						const value = context.raw;
						return `${context.label}: ${value}% (${formatCurrency(
							(monthlyIncome * value) / 100
						)})`;
					},
				},
			},
		},
	};

	const cashFlowData = [
		{
			amount: formatCurrency(monthlyIncome * 0.8),
			description: "Salary",
			rightAmount: formatCurrency(monthlyIncome * 0.8),
		},
		{
			amount: formatCurrency(monthlyIncome * 0.1),
			description: "Investments",
			rightAmount: formatCurrency(monthlyIncome * 0.1),
		},
		{
			amount: formatCurrency(monthlyIncome * 0.05),
			description: "Side Income",
			rightAmount: formatCurrency(monthlyIncome * 0.05),
		},
		{
			amount: formatCurrency(monthlyIncome * 0.03),
			description: "Refunds",
			rightAmount: formatCurrency(monthlyIncome * 0.03),
		},
	];

	const calculateFinancialHealthScore = () => {
		// Use user's financial details to calculate health score
		// This is a simplified model - a real one would be more sophisticated
		
		const scores = {
			savingsRate: 0,
			debtToIncome: 0,
			emergencyFund: 0,
			investmentDiversification: 0,
			budgetAdherence: 0
		};
		
		// Calculate savings rate (percentage of income saved)
		const monthlySavings = userData?.financialDetails?.monthlySavings || 0;
		const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;
		
		// Score the savings rate (20 points max)
		if (savingsRate >= 20) scores.savingsRate = 20;
		else if (savingsRate >= 15) scores.savingsRate = 16;
		else if (savingsRate >= 10) scores.savingsRate = 12;
		else if (savingsRate >= 5) scores.savingsRate = 8;
		else scores.savingsRate = Math.max(4, Math.floor(savingsRate));
		
		// Calculate debt-to-income ratio
		const totalDebt = userData?.financialDetails?.totalDebt || 0;
		const debtToIncomeRatio = monthlyIncome > 0 ? (totalDebt / (monthlyIncome * 12)) * 100 : 100;
		
		// Score the debt-to-income ratio (20 points max)
		if (debtToIncomeRatio <= 15) scores.debtToIncome = 20;
		else if (debtToIncomeRatio <= 30) scores.debtToIncome = 16;
		else if (debtToIncomeRatio <= 45) scores.debtToIncome = 12;
		else if (debtToIncomeRatio <= 60) scores.debtToIncome = 8;
		else scores.debtToIncome = 4;
		
		// Calculate emergency fund ratio (months of expenses covered)
		const monthlyExpenses = userData?.financialDetails?.majorExpenses || 0;
		const emergencyFund = userData?.financialDetails?.accountBalance || 0;
		const emergencyFundRatio = monthlyExpenses > 0 ? emergencyFund / monthlyExpenses : 0;
		
		// Score the emergency fund (25 points max)
		if (emergencyFundRatio >= 6) scores.emergencyFund = 25;
		else if (emergencyFundRatio >= 3) scores.emergencyFund = 20;
		else if (emergencyFundRatio >= 1) scores.emergencyFund = 10;
		else scores.emergencyFund = Math.floor(emergencyFundRatio * 8);
		
		// Investment diversification score (15 points max)
		// This would ideally analyze the actual investment portfolio
		// Here we'll use a simplified approach based on number of investments
		const investments = userData?.investmentData || [];
		const uniqueCategories = new Set(investments.map(i => i.category)).size;
		
		if (uniqueCategories >= 4) scores.investmentDiversification = 15;
		else if (uniqueCategories >= 3) scores.investmentDiversification = 12;
		else if (uniqueCategories >= 2) scores.investmentDiversification = 9;
		else if (uniqueCategories >= 1) scores.investmentDiversification = 6;
		else scores.investmentDiversification = 0;
		
		// Budget adherence score (20 points max)
		// Ideally this would compare actual spending to budget
		// Here we'll just assign a reasonable default
		scores.budgetAdherence = 15;
		
		// Calculate total score (out of 100)
		const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
		
		// Generate recommendations based on scores
		const recommendations = [];
		
		if (scores.savingsRate < 12) {
			recommendations.push("Try to increase your savings rate to at least 10% of income.");
		}
		
		if (scores.debtToIncome < 16) {
			recommendations.push("Focus on reducing high-interest debt to improve your debt-to-income ratio.");
		}
		
		if (scores.emergencyFund < 20) {
			recommendations.push("Build your emergency fund to cover at least 3-6 months of expenses.");
		}
		
		if (scores.investmentDiversification < 12) {
			recommendations.push("Diversify your investment portfolio across more asset categories.");
		}
		
		return {
			score: totalScore,
			breakdown: scores,
			recommendations: recommendations.slice(0, 3)  // Limit to top 3 recommendations
		};
	};

	// Toggle a feature on/off
	const toggleFeature = (featureKey) => {
		setFeatures(prev => {
			const updatedFeatures = {
				...prev,
				[featureKey]: !prev[featureKey]
			};
			// Save to localStorage
			localStorage.setItem('finapp_features', JSON.stringify(updatedFeatures));
			return updatedFeatures;
		});
	};

	return (
		<div className="app-container">
			{/* Sidebar */}
			<div className="sidebar">
				<div className="profile">
					<img
						src={userData.profilePic}
						alt="Profile"
						className="profile-image"
					/>
					<h3 className="profile-name">{userData.name}</h3>
					<p className="profile-subtitle">Personal Budget</p>
				</div>

				<ul className="nav-menu">
					<li
						className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
						onClick={() => setActiveTab("overview")}>
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
				
				{/* News Section */}
				<News />
			</div>

			{/* Main Content */}
			<div className="main-content">
				<div className="finance-analytics">
					{/* Header */}
					<div className="header">
						<h2 className="header-title">Financial Dashboard</h2>
						<div className="header-right">
							<div className="date-range">
								<FaRegCalendarAlt style={{ marginRight: "5px" }} />
								May 1, 2023 - Apr 30, 2024
							</div>
							<div className="mode-switch">ADVANCED MODE</div>
						</div>
					</div>

					{/* Dashboard Grid */}
					<div className="dashboard-grid">
						{/* Total Balance Card */}
						<div className="dashboard-card card-wide balance-card">
							<h3 className="card-title">Total Balance</h3>
							<div className="balance-amount">
								{formatCurrency(accountBalance)}
							</div>
							<div className="balance-details">
								<div className="balance-item">
									<h4 className="balance-label">Monthly Income</h4>
									<div className="balance-value">
										{formatCurrency(monthlyIncome)}
										<span
											style={{
												color: "var(--primary-color)",
												fontSize: "0.75rem",
												marginLeft: "5px",
											}}>
											↑ 10.2%
										</span>
									</div>
								</div>
								<div className="balance-item">
									<h4 className="balance-label">Savings Goal</h4>
									<div className="balance-value">
										{formatCurrency(savingsGoal)}
										<span
											style={{
												color: "var(--primary-color)",
												fontSize: "0.75rem",
												marginLeft: "5px",
											}}>
											{savingsGoal > 0 && salaryAmount > 0
												? Math.round((savingsGoal / salaryAmount) * 100) +
												  "% of salary"
												: ""}
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Profit/Loss Card */}
						<div className="dashboard-card card-wide profit-loss-card">
							<div className="profit-loss-title">
								<span>Profit / Loss</span>
							</div>
							<div
								className={`profit-loss-amount ${
									currentProfit > 0 ? "profit" : "loss"
								}`}>
								{formatCurrency(currentProfit)}
							</div>
							<div
								className={`profit-loss-percentage ${
									currentProfit > 0 ? "profit" : "loss"
								}`}>
								{currentProfit > 0 ? (
									<FaArrowUp style={{ marginRight: "5px" }} />
								) : (
									<FaArrowDown style={{ marginRight: "5px" }} />
								)}
								{Math.abs(incomePercentage)}% of income
							</div>
						</div>

						{/* Revenue/Expenses Card */}
						<div className="dashboard-card card-wide revenue-expense-card">
							<div className="card-header">
								<div className="card-title">Revenue & Expenses</div>
							</div>
							<div className="card-content">
								<div className="revenue-section">
									<div className="revenue-title">Revenue</div>
									<div className="revenue-amount">
										{formatCurrency(monthlyIncome)}
									</div>
									<div className="percentage-change profit">
										<FaArrowUp style={{ marginRight: "5px" }} /> 12.5%
									</div>
								</div>
								<div className="expense-section">
									<div className="expense-title">Expenses</div>
									<div className="expense-amount">
										{formatCurrency(majorExpenses)}
									</div>
									<div className="percentage-change loss">
										<FaArrowUp style={{ marginRight: "5px" }} /> 5.3%
									</div>
								</div>
								<div className="pie-chart-container">
									<Pie
										data={pieChartData}
										options={{
											...pieChartOptions,
											maintainAspectRatio: false,
											responsive: true,
										}}
									/>
								</div>
							</div>
						</div>

						{/* Budget Allocation Card */}
						<div className="dashboard-card card-wide budget-allocation-card">
							<div className="profit-loss-title">
								<span>Budget Allocation</span>
							</div>
							<div className="budget-chart-container">
								<div className="doughnut-container">
									<Doughnut
										data={budgetAllocationData}
										options={{
											...doughnutOptions,
											maintainAspectRatio: false,
											responsive: true,
										}}
									/>
								</div>
								<div className="budget-categories">
									{budgetCategories.map((category, index) => (
										<div
											key={index}
											className="budget-category-item">
											<div
												className="category-color"
												style={{
													backgroundColor:
														budgetAllocationData.datasets[0].backgroundColor[
															index % 7
														],
												}}
											/>
											<span className="category-name">{category.name}</span>
											<span className="category-percentage">
												{category.percentage}%
											</span>
										</div>
									))}
								</div>
							</div>
						</div>

						{/* Account Activity Card */}
						<div className="dashboard-card card-wide cash-flow-card">
							<div className="profit-loss-title">
								<span>Last 7 Days</span>
								<span className="profit-loss profit">Income Sources</span>
							</div>
							<div className="profit-loss-amount profit">
								{formatCurrency(monthlyIncome)}
							</div>
							<div className="profit-loss-percentage profit">
								<FaArrowUp style={{ marginRight: "5px" }} />{" "}
								{formatCurrency(monthlyIncome - majorExpenses)}
							</div>

							<div className="cash-flow-title">Income Breakdown</div>
							<table className="cash-flow-table">
								<thead>
									<tr>
										<th>Amount</th>
										<th>Source</th>
										<th style={{ textAlign: "right" }}>Amount</th>
									</tr>
								</thead>
								<tbody>
									{cashFlowData.map((item, index) => (
										<tr key={index}>
											<td>{item.amount}</td>
											<td>{item.description}</td>
											<td style={{ textAlign: "right" }}>{item.rightAmount}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{/* Revenue vs Expenses Chart Card */}
						<div className="dashboard-card card-full">
							<div
								className="chart-title"
								style={{
									display: "flex",
									alignItems: "center",
									marginBottom: "20px",
								}}>
								<FaLightbulb
									style={{ color: "#36f9ae", marginRight: "10px" }}
								/>
								<span>Revenue vs. Expenses by Week</span>
							</div>
							<div className="bar-chart-container">
								<Bar
									data={barChartData}
									options={barChartOptions}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
