import React, { useState, useEffect } from "react";
import {
	FaArrowUp,
	FaArrowDown,
	FaLightbulb,
	FaMoneyBillWave,
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

	return (
		<>
			{/* Header */}
			<div className="header">
				<h1>Dashboard</h1>
				<div className="user-info">
					<h3>{userData.name}</h3>
					<img
						src={userData.profilePic}
						alt="Profile"
						className="profile-image-small"
					/>
				</div>
			</div>

			{/* Tab Menu */}
			<div className="tab-menu">
				<div
					className={`tab ${activeTab === "overview" ? "active" : ""}`}
					onClick={() => setActiveTab("overview")}
				>
					Overview
				</div>
				<div
					className={`tab ${activeTab === "analytics" ? "active" : ""}`}
					onClick={() => setActiveTab("analytics")}
				>
					Analytics
				</div>
				<div
					className={`tab ${activeTab === "budgeting" ? "active" : ""}`}
					onClick={() => setActiveTab("budgeting")}
				>
					Budgeting
				</div>
			</div>

			{/* Dashboard Content */}
			<div className="finance-analytics">
				{/* Account Summary Section */}
				<div className="dashboard-grid">
					{/* Account Balance Card */}
					<div className="dashboard-card balance-card">
						<div className="card-title">Account Balance</div>
						<div className="balance-amount">{formatCurrency(accountBalance)}</div>
						<div className="balance-details">
							<div className="balance-item">
								<div className="balance-label">Income</div>
								<div className="balance-value profit">
									{formatCurrency(monthlyIncome)}
								</div>
							</div>
							<div className="balance-item">
								<div className="balance-label">Expenses</div>
								<div className="balance-value loss">
									{formatCurrency(majorExpenses)}
								</div>
							</div>
						</div>
					</div>

					{/* Profit/Loss Card */}
					<div className="dashboard-card profit-loss-card">
						<div className="profit-loss-title">
							Monthly Profit/Loss
							<span className={currentProfit >= 0 ? "profit" : "loss"}>
								{currentProfit >= 0 ? (
									<FaArrowUp />
								) : (
									<FaArrowDown />
								)}
							</span>
						</div>
						<div
							className={`profit-loss-amount ${
								currentProfit >= 0 ? "profit" : "loss"
							}`}
						>
							{formatCurrency(currentProfit)}
						</div>
						<div
							className={`profit-loss-percentage ${
								currentProfit >= 0 ? "profit" : "loss"
							}`}
						>
							{currentProfit >= 0 ? "+" : "-"}
							{Math.abs(incomePercentage)}% from last month
						</div>
					</div>

					{/* Revenue/Expense Card */}
					<div className="dashboard-card revenue-expense-card">
						<div className="revenue-section">
							<div className="revenue-title">Revenue</div>
							<div className="revenue-amount">
								{formatCurrency(monthlyIncome)}
							</div>
							<div className="percentage-change profit">
								<FaArrowUp /> +8.2%
							</div>
						</div>
						<div className="expense-section">
							<div className="expense-title">Expenses</div>
							<div className="expense-amount">
								{formatCurrency(majorExpenses)}
							</div>
							<div className="percentage-change loss">
								<FaArrowDown /> -3.1%
							</div>
						</div>
						<div className="pie-chart-container">
							<Pie
								data={pieChartData}
								options={{
									responsive: true,
									maintainAspectRatio: false,
									plugins: {
										legend: {
											display: false,
										},
									},
								}}
							/>
						</div>
					</div>

					{/* Savings Goal Card */}
					<div className="dashboard-card">
						<div className="card-title">Savings Goal</div>
						<div className="balance-amount">
							{formatCurrency(savingsGoal)}
						</div>
						<div className="percentage-change profit">
							{Math.round((accountBalance / savingsGoal) * 100)}% of goal
							achieved
						</div>
					</div>
				</div>

				{/* Charts Section */}
				<div className="dashboard-card card-full">
					<div className="card-title">Income Trend</div>
					<div className="chart-container">
						<Line data={chartData} options={chartOptions} />
					</div>
				</div>

				<div className="dashboard-grid">
					{/* Weekly Revenue/Expense */}
					<div className="dashboard-card card-full">
						<div className="card-title">Weekly Revenue & Expenses</div>
						<div className="bar-chart-container">
							<Bar
								data={barChartData}
								options={{
									responsive: true,
									maintainAspectRatio: false,
									plugins: {
										legend: {
											display: true,
											position: "top",
										},
									},
									scales: {
										y: {
											beginAtZero: true,
										},
									},
								}}
							/>
						</div>
					</div>
				</div>

				{/* Budget Allocation Section */}
				<div className="dashboard-card budget-allocation-card">
					<div className="profit-loss-title">Budget Allocation</div>
					<div className="budget-chart-container">
						<div className="doughnut-container">
							<Doughnut
								data={budgetAllocationData}
								options={{
									responsive: true,
									maintainAspectRatio: false,
									cutout: "70%",
								}}
							/>
						</div>
						<div className="budget-categories">
							{budgetCategories.map((category, index) => (
								<div className="budget-category-item" key={index}>
									<div
										className="category-color"
										style={{
											backgroundColor:
												budgetAllocationData.datasets[0]
													.backgroundColor[index],
										}}
									></div>
									<div className="category-name">{category.name}</div>
									<div className="category-percentage">
										{category.percentage}%
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Financial News Section */}
				<News />

				{/* Money Tip Card */}
				<div className="dashboard-card">
					<div className="profit-loss-title">
						<FaLightbulb style={{ color: "#ffbf00" }} /> Money Tip of the Day
					</div>
					<p style={{ padding: "10px 0" }}>
						"Consider automating your savings by setting up automatic transfers to your savings account on payday. This way, you'll build your savings without even thinking about it."
					</p>
				</div>
			</div>
		</>
	);
};

export default Dashboard;
