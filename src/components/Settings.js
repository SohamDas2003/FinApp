import React, { useState, useEffect } from "react";
import {
  FaCog,
  FaUser,
  FaCamera,
  FaTrash,
  FaEnvelope,
  FaPhone,
  FaCreditCard,
  FaUniversity,
  FaShieldAlt,
  FaInfoCircle,
  FaFileAlt,
  FaUserAlt,
  FaTrashAlt,
  FaIdCard,
  FaUpload,
  FaSave,
  FaExclamationTriangle
} from "react-icons/fa";
import "../styles/App.css";
import AppLayout from "./AppLayout";

const Settings = ({ user, onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = useState("settings");
  const [activeSection, setActiveSection] = useState("personal");
  const [profileImage, setProfileImage] = useState(user?.profilePic || "https://via.placeholder.com/150");
  const [personalDetails, setPersonalDetails] = useState({
    username: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || ""
  });
  const [bankDetails, setBankDetails] = useState({
    creditCards: user?.creditCards || [],
    debitCards: user?.debitCards || [],
    banks: user?.banks || []
  });
  const [newCreditCard, setNewCreditCard] = useState({
    cardNumber: "",
    expiryDate: "",
    cardholderName: "",
    nickname: ""
  });
  const [newDebitCard, setNewDebitCard] = useState({
    cardNumber: "",
    expiryDate: "",
    cardholderName: "",
    nickname: ""
  });
  const [newBank, setNewBank] = useState({
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountType: ""
  });
  const [showAddCreditCard, setShowAddCreditCard] = useState(false);
  const [showAddDebitCard, setShowAddDebitCard] = useState(false);
  const [showAddBank, setShowAddBank] = useState(false);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);

  // Handle personal details changes
  const handlePersonalDetailsChange = (e) => {
    const { name, value } = e.target;
    setPersonalDetails({
      ...personalDetails,
      [name]: value
    });
  };

  // Handle profile image changes
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Delete profile image
  const handleDeleteImage = () => {
    if (window.confirm("Are you sure you want to delete your profile picture?")) {
      setProfileImage("https://via.placeholder.com/150");
    }
  };

  // Save personal details
  const handleSavePersonalDetails = () => {
    // Save to localStorage
    const storedUser = JSON.parse(localStorage.getItem("finapp_user")) || {};
    const updatedUser = {
      ...storedUser,
      name: personalDetails.username,
      email: personalDetails.email,
      phoneNumber: personalDetails.phoneNumber,
      profilePic: profileImage
    };
    localStorage.setItem("finapp_user", JSON.stringify(updatedUser));
    setIsEditingPersonal(false);
    
    // Show success message (can be enhanced with a proper notification system)
    alert("Personal details updated successfully!");
  };

  // Handle credit card changes
  const handleCreditCardChange = (e) => {
    const { name, value } = e.target;
    setNewCreditCard({
      ...newCreditCard,
      [name]: value
    });
  };

  // Add credit card
  const handleAddCreditCard = () => {
    if (!newCreditCard.cardNumber || !newCreditCard.expiryDate || !newCreditCard.cardholderName) {
      alert("Please fill in all required fields");
      return;
    }

    const maskedCardNumber = newCreditCard.cardNumber.replace(/\d(?=\d{4})/g, "*");
    const updatedCreditCards = [
      ...bankDetails.creditCards,
      {
        id: Date.now(),
        cardNumber: maskedCardNumber,
        expiryDate: newCreditCard.expiryDate,
        cardholderName: newCreditCard.cardholderName,
        nickname: newCreditCard.nickname || `Card ${bankDetails.creditCards.length + 1}`
      }
    ];

    setBankDetails({
      ...bankDetails,
      creditCards: updatedCreditCards
    });

    // Save to localStorage
    const storedUser = JSON.parse(localStorage.getItem("finapp_user")) || {};
    const updatedUser = {
      ...storedUser,
      creditCards: updatedCreditCards
    };
    localStorage.setItem("finapp_user", JSON.stringify(updatedUser));

    // Reset form
    setNewCreditCard({
      cardNumber: "",
      expiryDate: "",
      cardholderName: "",
      nickname: ""
    });
    setShowAddCreditCard(false);
  };

  // Handle debit card changes
  const handleDebitCardChange = (e) => {
    const { name, value } = e.target;
    setNewDebitCard({
      ...newDebitCard,
      [name]: value
    });
  };

  // Add debit card
  const handleAddDebitCard = () => {
    if (!newDebitCard.cardNumber || !newDebitCard.expiryDate || !newDebitCard.cardholderName) {
      alert("Please fill in all required fields");
      return;
    }

    const maskedCardNumber = newDebitCard.cardNumber.replace(/\d(?=\d{4})/g, "*");
    const updatedDebitCards = [
      ...bankDetails.debitCards,
      {
        id: Date.now(),
        cardNumber: maskedCardNumber,
        expiryDate: newDebitCard.expiryDate,
        cardholderName: newDebitCard.cardholderName,
        nickname: newDebitCard.nickname || `Card ${bankDetails.debitCards.length + 1}`
      }
    ];

    setBankDetails({
      ...bankDetails,
      debitCards: updatedDebitCards
    });

    // Save to localStorage
    const storedUser = JSON.parse(localStorage.getItem("finapp_user")) || {};
    const updatedUser = {
      ...storedUser,
      debitCards: updatedDebitCards
    };
    localStorage.setItem("finapp_user", JSON.stringify(updatedUser));

    // Reset form
    setNewDebitCard({
      cardNumber: "",
      expiryDate: "",
      cardholderName: "",
      nickname: ""
    });
    setShowAddDebitCard(false);
  };

  // Handle bank account changes
  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setNewBank({
      ...newBank,
      [name]: value
    });
  };

  // Add bank account
  const handleAddBank = () => {
    if (!newBank.bankName || !newBank.accountNumber || !newBank.ifscCode) {
      alert("Please fill in all required fields");
      return;
    }

    const maskedAccountNumber = newBank.accountNumber.replace(/\d(?=\d{4})/g, "*");
    const updatedBanks = [
      ...bankDetails.banks,
      {
        id: Date.now(),
        bankName: newBank.bankName,
        accountNumber: maskedAccountNumber,
        ifscCode: newBank.ifscCode,
        accountType: newBank.accountType || "Savings"
      }
    ];

    setBankDetails({
      ...bankDetails,
      banks: updatedBanks
    });

    // Save to localStorage
    const storedUser = JSON.parse(localStorage.getItem("finapp_user")) || {};
    const updatedUser = {
      ...storedUser,
      banks: updatedBanks
    };
    localStorage.setItem("finapp_user", JSON.stringify(updatedUser));

    // Reset form
    setNewBank({
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      accountType: ""
    });
    setShowAddBank(false);
  };

  // Delete card or bank
  const handleDeleteItem = (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      let updatedItems;
      let updatedBankDetails;

      switch(type) {
        case 'credit card':
          updatedItems = bankDetails.creditCards.filter(card => card.id !== id);
          updatedBankDetails = { ...bankDetails, creditCards: updatedItems };
          break;
        case 'debit card':
          updatedItems = bankDetails.debitCards.filter(card => card.id !== id);
          updatedBankDetails = { ...bankDetails, debitCards: updatedItems };
          break;
        case 'bank account':
          updatedItems = bankDetails.banks.filter(bank => bank.id !== id);
          updatedBankDetails = { ...bankDetails, banks: updatedItems };
          break;
        default:
          return;
      }

      setBankDetails(updatedBankDetails);

      // Save to localStorage
      const storedUser = JSON.parse(localStorage.getItem("finapp_user")) || {};
      const updatedUser = {
        ...storedUser,
        ...updatedBankDetails
      };
      localStorage.setItem("finapp_user", JSON.stringify(updatedUser));
    }
  };

  // Delete account
  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      if (window.confirm("All your data will be permanently deleted. Are you absolutely sure?")) {
        // Clear user data from localStorage
        localStorage.removeItem("finapp_user");
        // Redirect to login
        window.location.href = "/login";
      }
    }
  };

  return (
    <AppLayout 
      user={{ ...user, profilePic: profileImage, name: personalDetails.username }} 
      activeTab={activeTab} 
      onNavigate={onNavigate} 
      onLogout={onLogout}
    >
      {/* Header */}
      <div className="header">
        <h2 className="header-title">
          <FaCog style={{ marginRight: "10px" }} /> Settings
        </h2>
      </div>

      {/* Settings Layout */}
      <div className="settings-container">
        {/* Settings Navigation */}
        <div className="settings-nav">
          <div 
            className={`settings-nav-item ${activeSection === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveSection('personal')}
          >
            <FaUser className="settings-nav-icon" />
            <span>Personal Details</span>
          </div>
          <div 
            className={`settings-nav-item ${activeSection === 'bank' ? 'active' : ''}`}
            onClick={() => setActiveSection('bank')}
          >
            <FaUniversity className="settings-nav-icon" />
            <span>Bank Details</span>
          </div>
          <div 
            className={`settings-nav-item ${activeSection === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveSection('privacy')}
          >
            <FaShieldAlt className="settings-nav-icon" />
            <span>Privacy & Terms</span>
          </div>
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {/* Personal Details Section */}
          {activeSection === 'personal' && (
            <div className="settings-section">
              <h3 className="settings-section-title">Personal Details</h3>
              
              {/* Profile Photo */}
              <div className="profile-photo-section">
                <div className="profile-photo-container">
                  <img src={profileImage} alt="Profile" className="settings-profile-image" />
                  <div className="profile-photo-overlay">
                    <label htmlFor="profile-photo-upload" className="photo-action-button">
                      <FaCamera />
                    </label>
                    <input 
                      type="file" 
                      id="profile-photo-upload" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      style={{ display: 'none' }}
                    />
                    <button 
                      className="photo-action-button delete" 
                      onClick={handleDeleteImage}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <p className="profile-photo-hint">Click on the camera icon to upload a new photo</p>
              </div>

              {/* Personal Information */}
              <div className="settings-form">
                <div className="form-group">
                  <label>Username</label>
                  <div className="input-with-icon">
                    <FaUserAlt className="input-icon" />
                    <input
                      type="text"
                      name="username"
                      value={personalDetails.username}
                      onChange={handlePersonalDetailsChange}
                      disabled={!isEditingPersonal}
                      placeholder="Your username"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <div className="input-with-icon">
                    <FaEnvelope className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      value={personalDetails.email}
                      onChange={handlePersonalDetailsChange}
                      disabled={!isEditingPersonal}
                      placeholder="Your email address"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Phone Number</label>
                  <div className="input-with-icon">
                    <FaPhone className="input-icon" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={personalDetails.phoneNumber}
                      onChange={handlePersonalDetailsChange}
                      disabled={!isEditingPersonal}
                      placeholder="Your phone number"
                    />
                  </div>
                </div>
                
                <div className="settings-actions">
                  {!isEditingPersonal ? (
                    <button 
                      className="settings-button edit" 
                      onClick={() => setIsEditingPersonal(true)}
                    >
                      Edit Details
                    </button>
                  ) : (
                    <>
                      <button 
                        className="settings-button cancel" 
                        onClick={() => setIsEditingPersonal(false)}
                      >
                        Cancel
                      </button>
                      <button 
                        className="settings-button save" 
                        onClick={handleSavePersonalDetails}
                      >
                        <FaSave style={{ marginRight: '5px' }} />
                        Save Changes
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Bank Details Section */}
          {activeSection === 'bank' && (
            <div className="settings-section">
              <h3 className="settings-section-title">Bank & Card Details</h3>
              
              {/* Credit Cards */}
              <div className="card-section">
                <div className="section-header">
                  <h4>Credit Cards</h4>
                  <button 
                    className="add-button"
                    onClick={() => setShowAddCreditCard(!showAddCreditCard)}
                  >
                    {showAddCreditCard ? 'Cancel' : '+ Add Credit Card'}
                  </button>
                </div>
                
                {showAddCreditCard && (
                  <div className="card-form">
                    <div className="form-group">
                      <label>Card Number*</label>
                      <div className="input-with-icon">
                        <FaCreditCard className="input-icon" />
                        <input
                          type="text"
                          name="cardNumber"
                          value={newCreditCard.cardNumber}
                          onChange={handleCreditCardChange}
                          placeholder="XXXX XXXX XXXX XXXX"
                          maxLength="19"
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Date*</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={newCreditCard.expiryDate}
                          onChange={handleCreditCardChange}
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Nickname</label>
                        <input
                          type="text"
                          name="nickname"
                          value={newCreditCard.nickname}
                          onChange={handleCreditCardChange}
                          placeholder="e.g., Personal Card"
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Cardholder Name*</label>
                      <div className="input-with-icon">
                        <FaUser className="input-icon" />
                        <input
                          type="text"
                          name="cardholderName"
                          value={newCreditCard.cardholderName}
                          onChange={handleCreditCardChange}
                          placeholder="Name as on card"
                        />
                      </div>
                    </div>
                    
                    <div className="form-actions">
                      <button 
                        className="settings-button save"
                        onClick={handleAddCreditCard}
                      >
                        Add Card
                      </button>
                    </div>
                  </div>
                )}
                
                {bankDetails.creditCards.length > 0 ? (
                  <div className="cards-list">
                    {bankDetails.creditCards.map(card => (
                      <div className="card-item" key={card.id}>
                        <div className="card-icon">
                          <FaCreditCard />
                        </div>
                        <div className="card-details">
                          <div className="card-primary">
                            {card.nickname || 'Credit Card'}
                          </div>
                          <div className="card-secondary">
                            {card.cardNumber} • Expires {card.expiryDate}
                          </div>
                          <div className="card-tertiary">
                            {card.cardholderName}
                          </div>
                        </div>
                        <div className="card-actions">
                          <button 
                            className="card-action-button delete"
                            onClick={() => handleDeleteItem('credit card', card.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No credit cards added yet.</p>
                  </div>
                )}
              </div>
              
              {/* Debit Cards */}
              <div className="card-section">
                <div className="section-header">
                  <h4>Debit Cards</h4>
                  <button 
                    className="add-button"
                    onClick={() => setShowAddDebitCard(!showAddDebitCard)}
                  >
                    {showAddDebitCard ? 'Cancel' : '+ Add Debit Card'}
                  </button>
                </div>
                
                {showAddDebitCard && (
                  <div className="card-form">
                    <div className="form-group">
                      <label>Card Number*</label>
                      <div className="input-with-icon">
                        <FaCreditCard className="input-icon" />
                        <input
                          type="text"
                          name="cardNumber"
                          value={newDebitCard.cardNumber}
                          onChange={handleDebitCardChange}
                          placeholder="XXXX XXXX XXXX XXXX"
                          maxLength="19"
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Date*</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={newDebitCard.expiryDate}
                          onChange={handleDebitCardChange}
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Nickname</label>
                        <input
                          type="text"
                          name="nickname"
                          value={newDebitCard.nickname}
                          onChange={handleDebitCardChange}
                          placeholder="e.g., Salary Account Card"
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Cardholder Name*</label>
                      <div className="input-with-icon">
                        <FaUser className="input-icon" />
                        <input
                          type="text"
                          name="cardholderName"
                          value={newDebitCard.cardholderName}
                          onChange={handleDebitCardChange}
                          placeholder="Name as on card"
                        />
                      </div>
                    </div>
                    
                    <div className="form-actions">
                      <button 
                        className="settings-button save"
                        onClick={handleAddDebitCard}
                      >
                        Add Card
                      </button>
                    </div>
                  </div>
                )}
                
                {bankDetails.debitCards.length > 0 ? (
                  <div className="cards-list">
                    {bankDetails.debitCards.map(card => (
                      <div className="card-item" key={card.id}>
                        <div className="card-icon">
                          <FaIdCard />
                        </div>
                        <div className="card-details">
                          <div className="card-primary">
                            {card.nickname || 'Debit Card'}
                          </div>
                          <div className="card-secondary">
                            {card.cardNumber} • Expires {card.expiryDate}
                          </div>
                          <div className="card-tertiary">
                            {card.cardholderName}
                          </div>
                        </div>
                        <div className="card-actions">
                          <button 
                            className="card-action-button delete"
                            onClick={() => handleDeleteItem('debit card', card.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No debit cards added yet.</p>
                  </div>
                )}
              </div>
              
              {/* Bank Accounts */}
              <div className="card-section">
                <div className="section-header">
                  <h4>Bank Accounts</h4>
                  <button 
                    className="add-button"
                    onClick={() => setShowAddBank(!showAddBank)}
                  >
                    {showAddBank ? 'Cancel' : '+ Add Bank Account'}
                  </button>
                </div>
                
                {showAddBank && (
                  <div className="card-form">
                    <div className="form-group">
                      <label>Bank Name*</label>
                      <div className="input-with-icon">
                        <FaUniversity className="input-icon" />
                        <input
                          type="text"
                          name="bankName"
                          value={newBank.bankName}
                          onChange={handleBankChange}
                          placeholder="e.g., HDFC Bank"
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Account Number*</label>
                      <div className="input-with-icon">
                        <FaCreditCard className="input-icon" />
                        <input
                          type="text"
                          name="accountNumber"
                          value={newBank.accountNumber}
                          onChange={handleBankChange}
                          placeholder="Your account number"
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>IFSC Code*</label>
                        <input
                          type="text"
                          name="ifscCode"
                          value={newBank.ifscCode}
                          onChange={handleBankChange}
                          placeholder="e.g., HDFC0001234"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Account Type</label>
                        <select
                          name="accountType"
                          value={newBank.accountType}
                          onChange={handleBankChange}
                        >
                          <option value="Savings">Savings</option>
                          <option value="Current">Current</option>
                          <option value="Salary">Salary</option>
                          <option value="Fixed Deposit">Fixed Deposit</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="form-actions">
                      <button 
                        className="settings-button save"
                        onClick={handleAddBank}
                      >
                        Add Bank Account
                      </button>
                    </div>
                  </div>
                )}
                
                {bankDetails.banks.length > 0 ? (
                  <div className="cards-list">
                    {bankDetails.banks.map(bank => (
                      <div className="card-item" key={bank.id}>
                        <div className="card-icon">
                          <FaUniversity />
                        </div>
                        <div className="card-details">
                          <div className="card-primary">
                            {bank.bankName}
                          </div>
                          <div className="card-secondary">
                            {bank.accountNumber} • {bank.accountType}
                          </div>
                          <div className="card-tertiary">
                            IFSC: {bank.ifscCode}
                          </div>
                        </div>
                        <div className="card-actions">
                          <button 
                            className="card-action-button delete"
                            onClick={() => handleDeleteItem('bank account', bank.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No bank accounts added yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Privacy & Terms Section */}
          {activeSection === 'privacy' && (
            <div className="settings-section">
              <h3 className="settings-section-title">Privacy & Terms</h3>
              
              <div className="card-section">
                <h4>Legal Information</h4>
                
                <div className="privacy-links">
                  <a href="#" className="privacy-link">
                    <FaFileAlt className="privacy-icon" />
                    <span>Terms and Conditions</span>
                  </a>
                  
                  <a href="#" className="privacy-link">
                    <FaShieldAlt className="privacy-icon" />
                    <span>Privacy Policy</span>
                  </a>
                  
                  <a href="#" className="privacy-link">
                    <FaInfoCircle className="privacy-icon" />
                    <span>About Us</span>
                  </a>
                </div>
              </div>
              
              <div className="card-section danger-zone">
                <h4>Danger Zone</h4>
                
                <div className="danger-action">
                  <div className="danger-info">
                    <FaExclamationTriangle className="danger-icon" />
                    <div>
                      <h5>Delete Account</h5>
                      <p>Once you delete your account, there is no going back. Please be certain.</p>
                    </div>
                  </div>
                  
                  <button 
                    className="settings-button delete"
                    onClick={handleDeleteAccount}
                  >
                    <FaTrashAlt style={{ marginRight: '5px' }} />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings; 