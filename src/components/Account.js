import React, { useState, useEffect } from "react";
import { FiUser, FiLock, FiCreditCard, FiDownload, FiShield, FiAlertTriangle } from "react-icons/fi";
import "../styles/App.css";

const Account = ({ user, onLogout }) => {
  const [userData, setUserData] = useState(user);
  const [activeSection, setActiveSection] = useState("profile");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Load user data
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("finapp_user"));
    if (storedUser) {
      setUserData(storedUser);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Update profile information
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Simulate API call to update profile
    setTimeout(() => {
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  // Handle password update
  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    // Simulate API call to update password
    setError("");
    setTimeout(() => {
      setSuccessMessage("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 1000);
  };

  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData(prev => ({
          ...prev,
          profilePic: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Export user data
  const handleExportData = () => {
    // Simulate data export
    setTimeout(() => {
      setSuccessMessage("Your data has been exported. Check your email.");
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 1000);
  };

  // Delete account
  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // Simulate account deletion API call
      setTimeout(() => {
        alert("Your account has been scheduled for deletion. You will be logged out.");
        // Redirect to home page or login page
        localStorage.removeItem("finapp_user");
        onLogout();
      }, 1500);
    }
  };

  // Handle cards navigation
  const handleCardsNavigation = () => {
    // Navigate to cards page
    window.parent.postMessage({ route: "/cards" }, "*");
  };

  return (
    <div className="account-page">
      <h1>Account Settings</h1>
      
      <div className="settings-navigation">
        <div 
          className={`settings-nav-item ${activeSection === "profile" ? "active" : ""}`}
          onClick={() => setActiveSection("profile")}
        >
          <FiUser /> Profile
        </div>
        <div 
          className={`settings-nav-item ${activeSection === "security" ? "active" : ""}`}
          onClick={() => setActiveSection("security")}
        >
          <FiLock /> Security
        </div>
        <div 
          className={`settings-nav-item ${activeSection === "payment" ? "active" : ""}`}
          onClick={() => setActiveSection("payment")}
        >
          <FiCreditCard /> Payment Methods
        </div>
        <div 
          className={`settings-nav-item ${activeSection === "data" ? "active" : ""}`}
          onClick={() => setActiveSection("data")}
        >
          <FiDownload /> Data & Privacy
        </div>
      </div>
      
      <div className="settings-content">
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <FiAlertTriangle />
            {error}
          </div>
        )}

        {activeSection === "profile" && (
          <div className="settings-form-container">
            <h2>Profile Information</h2>
            <form onSubmit={handleProfileUpdate}>
              <div className="profile-image-upload">
                <img 
                  src={userData.profilePic || userData.profileImage} 
                  alt="Profile" 
                  className="profile-image-preview" 
                />
                <label className="upload-button">
                  Change Photo
                  <input 
                    type="file" 
                    accept="image/*" 
                    style={{ display: "none" }} 
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={userData.name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={userData.email} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={userData.phone} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <button type="submit" className="primary-button">
                Save Changes
              </button>
            </form>
          </div>
        )}
        
        {activeSection === "security" && (
          <div className="settings-form-container">
            <h2>Security Settings</h2>
            <form onSubmit={handlePasswordUpdate}>
              <div className="form-group">
                <label>Current Password</label>
                <input 
                  type="password" 
                  name="currentPassword" 
                  value={passwordData.currentPassword} 
                  onChange={handlePasswordChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>New Password</label>
                <input 
                  type="password" 
                  name="newPassword" 
                  value={passwordData.newPassword} 
                  onChange={handlePasswordChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Confirm New Password</label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  value={passwordData.confirmPassword} 
                  onChange={handlePasswordChange} 
                  required 
                />
              </div>
              
              <button type="submit" className="primary-button">
                Update Password
              </button>
            </form>
            
            <div className="danger-zone">
              <h3>Danger Zone</h3>
              <p>Once you delete your account, there is no going back. Please be certain.</p>
              <button 
                className="delete-account-btn" 
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        )}
        
        {activeSection === "payment" && (
          <div className="settings-form-container">
            <h2>Payment Methods</h2>
            <div className="payment-methods-info">
              <p>Manage your payment methods and subscription details.</p>
              <button 
                className="navigate-btn" 
                onClick={handleCardsNavigation}
              >
                <FiCreditCard /> Manage Cards
              </button>
            </div>
          </div>
        )}
        
        {activeSection === "data" && (
          <div className="settings-form-container">
            <h2>Data & Privacy</h2>
            
            <div className="export-data-section">
              <h3>Export Your Data</h3>
              <p>Download a copy of your personal data in JSON format.</p>
              <button 
                className="export-data-btn" 
                onClick={handleExportData}
              >
                <FiDownload /> Export Data
              </button>
            </div>
            
            <div className="privacy-info">
              <h3>Privacy Settings</h3>
              <p>Control how your data is used and shared across our services.</p>
              
              <div className="form-group">
                <div className="checkbox-container">
                  <input type="checkbox" id="marketingEmails" defaultChecked />
                  <label htmlFor="marketingEmails">Receive marketing emails</label>
                </div>
              </div>
              
              <div className="form-group">
                <div className="checkbox-container">
                  <input type="checkbox" id="dataAnalytics" defaultChecked />
                  <label htmlFor="dataAnalytics">Share usage data for analytics</label>
                </div>
              </div>
              
              <div className="form-group">
                <div className="checkbox-container">
                  <input type="checkbox" id="thirdPartySharing" />
                  <label htmlFor="thirdPartySharing">Allow third-party data sharing</label>
                </div>
              </div>
              
              <button className="primary-button">
                Save Privacy Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account; 