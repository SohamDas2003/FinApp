import React from "react";
import {
  FaChartLine,
  FaWallet,
  FaExchangeAlt,
  FaRegCreditCard,
  FaCog,
  FaSignOutAlt,
  FaFlag,
} from "react-icons/fa";
import News from "./News";
import "../styles/App.css";

/**
 * AppLayout component provides a consistent layout for all pages
 * This ensures that sidebar and right sidebar remain in fixed positions
 */
const AppLayout = ({ user, activeTab, onNavigate, onLogout, children }) => {
  return (
    <div className="app-container">
      {/* Left Sidebar */}
      <div className="sidebar">
        <div className="profile">
          <img src={user.profilePic} alt="Profile" className="profile-image" />
          <h3 className="profile-name">{user.name}</h3>
          <p className="profile-subtitle">Personal Budget</p>
        </div>

        <ul className="nav-menu">
          <li
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => onNavigate("dashboard")}
          >
            <FaChartLine className="nav-icon" />
            <span className="nav-text">Dashboard</span>
          </li>
          <li
            className={`nav-item ${activeTab === "income" ? "active" : ""}`}
            onClick={() => onNavigate("income")}
          >
            <FaWallet className="nav-icon" />
            <span className="nav-text">Income</span>
          </li>
          <li
            className={`nav-item ${activeTab === "expenses" ? "active" : ""}`}
            onClick={() => onNavigate("expenses")}
          >
            <FaExchangeAlt className="nav-icon" />
            <span className="nav-text">Expenses</span>
          </li>
          <li
            className={`nav-item ${activeTab === "investments" ? "active" : ""}`}
            onClick={() => onNavigate("investments")}
          >
            <FaRegCreditCard className="nav-icon" />
            <span className="nav-text">Investments</span>
          </li>
          <li
            className={`nav-item ${activeTab === "goals" ? "active" : ""}`}
            onClick={() => onNavigate("goals")}
          >
            <FaFlag className="nav-icon" />
            <span className="nav-text">Goals</span>
          </li>
          <li
            className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => onNavigate("settings")}
          >
            <FaCog className="nav-icon" />
            <span className="nav-text">Settings</span>
          </li>
          <li className="nav-item logout-item" onClick={onLogout}>
            <FaSignOutAlt className="nav-icon" />
            <span className="nav-text">Logout</span>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="finance-analytics">
          {children}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="right-sidebar">
        <News />
      </div>
    </div>
  );
};

export default AppLayout; 