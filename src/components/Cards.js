import React, { useState, useEffect } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaInfoCircle,
  FaUniversity,
  FaMoneyCheckAlt,
  FaCheck,
  FaPlus,
  FaTrash,
  FaCreditCard,
  FaRegCreditCard,
} from "react-icons/fa";

const Cards = ({ user }) => {
  const [userData, setUserData] = useState(user);
  const [activeTab, setActiveTab] = useState("credit");
  const [showCardNumbers, setShowCardNumbers] = useState({});
  const [showAccountNumbers, setShowAccountNumbers] = useState({});
  const [newCard, setNewCard] = useState({
    type: "credit",
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
    bankName: "",
    cardColor: "#000000",
  });
  const [newAccount, setNewAccount] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    ifscCode: "",
    accountType: "savings",
    balance: "",
  });
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [showAddAccountForm, setShowAddAccountForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Load user data
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("finapp_user"));
    if (storedUser) {
      // If there are no cards, add demo cards
      if (!storedUser.cards) {
        storedUser.cards = {
          credit: [
            {
              id: "card-" + Date.now(),
              cardNumber: "4321 XXXX XXXX 1234",
              cardholderName: storedUser.name,
              expiryDate: "12/27",
              cvv: "***",
              bankName: "HDFC Bank",
              balance: 150000,
              limit: 200000,
              cardColor: "#1D1D1D",
            },
          ],
          debit: [
            {
              id: "card-" + (Date.now() + 1),
              cardNumber: "5678 XXXX XXXX 8765",
              cardholderName: storedUser.name,
              expiryDate: "09/26",
              cvv: "***",
              bankName: "SBI",
              balance: 85400,
              cardColor: "#1E3A8A",
            },
          ],
          accounts: [
            {
              id: "account-" + Date.now(),
              accountName: "Primary Savings",
              accountNumber: "XXXX XXXX 4321",
              bankName: "HDFC Bank",
              ifscCode: "HDFC0001234",
              accountType: "savings",
              balance: 125000,
            },
          ],
        };
        localStorage.setItem("finapp_user", JSON.stringify(storedUser));
      } else if (!storedUser.cards.accounts) {
        // Add accounts array if it doesn't exist
        storedUser.cards.accounts = [
          {
            id: "account-" + Date.now(),
            accountName: "Primary Savings",
            accountNumber: "XXXX XXXX 4321",
            bankName: "HDFC Bank",
            ifscCode: "HDFC0001234",
            accountType: "savings",
            balance: 125000,
          },
        ];
        localStorage.setItem("finapp_user", JSON.stringify(storedUser));
      }
      setUserData(storedUser);
    }
  }, []);

  // Format card number with spaces
  const formatCardNumber = (number) => {
    return number.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
  };

  // Handle form changes
  const handleCardFormChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === "cardNumber") {
      formattedValue = formatCardNumber(value);
    }

    setNewCard({ ...newCard, [name]: formattedValue });
  };

  // Handle account form changes
  const handleAccountFormChange = (e) => {
    const { name, value } = e.target;
    setNewAccount({ ...newAccount, [name]: value });
  };

  // Add new card
  const handleAddCard = (e) => {
    e.preventDefault();
    const userCardData = userData.cards || { credit: [], debit: [], accounts: [] };
    
    const newCardData = {
      ...newCard,
      id: "card-" + Date.now(),
      balance: newCard.type === "credit" ? 0 : 10000, // Default balance
      limit: newCard.type === "credit" ? 100000 : null, // Only credit cards have limits
    };

    userCardData[newCard.type] = [...userCardData[newCard.type], newCardData];
    
    const updatedUserData = {
      ...userData,
      cards: userCardData,
    };
    
    setUserData(updatedUserData);
    localStorage.setItem("finapp_user", JSON.stringify(updatedUserData));
    
    // Show success message
    setSuccessMessage("Card added successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
    
    // Reset form
    setNewCard({
      type: "credit",
      cardNumber: "",
      cardholderName: "",
      expiryDate: "",
      cvv: "",
      bankName: "",
      cardColor: "#000000",
    });
    setShowAddCardForm(false);
  };

  // Add new bank account
  const handleAddAccount = (e) => {
    e.preventDefault();
    const userCardData = userData.cards || { credit: [], debit: [], accounts: [] };
    
    const newAccountData = {
      ...newAccount,
      id: "account-" + Date.now(),
      balance: parseFloat(newAccount.balance) || 0,
    };

    userCardData.accounts = [...(userCardData.accounts || []), newAccountData];
    
    const updatedUserData = {
      ...userData,
      cards: userCardData,
    };
    
    setUserData(updatedUserData);
    localStorage.setItem("finapp_user", JSON.stringify(updatedUserData));
    
    // Show success message
    setSuccessMessage("Bank account added successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
    
    // Reset form
    setNewAccount({
      accountName: "",
      accountNumber: "",
      bankName: "",
      ifscCode: "",
      accountType: "savings",
      balance: "",
    });
    setShowAddAccountForm(false);
  };

  // Delete card
  const handleDeleteCard = (cardId) => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      const userCardData = { ...userData.cards };
      userCardData[activeTab] = userCardData[activeTab].filter(
        (card) => card.id !== cardId
      );
      
      const updatedUserData = {
        ...userData,
        cards: userCardData,
      };
      
      setUserData(updatedUserData);
      localStorage.setItem("finapp_user", JSON.stringify(updatedUserData));
    }
  };

  // Delete account
  const handleDeleteAccount = (accountId) => {
    if (window.confirm("Are you sure you want to delete this bank account?")) {
      const userCardData = { ...userData.cards };
      userCardData.accounts = userCardData.accounts.filter(
        (account) => account.id !== accountId
      );
      
      const updatedUserData = {
        ...userData,
        cards: userCardData,
      };
      
      setUserData(updatedUserData);
      localStorage.setItem("finapp_user", JSON.stringify(updatedUserData));
    }
  };

  // Toggle card number visibility
  const toggleCardNumberVisibility = (cardId) => {
    setShowCardNumbers({
      ...showCardNumbers,
      [cardId]: !showCardNumbers[cardId],
    });
  };

  // Toggle account number visibility
  const toggleAccountNumberVisibility = (accountId) => {
    setShowAccountNumbers({
      ...showAccountNumbers,
      [accountId]: !showAccountNumbers[accountId],
    });
  };

  return (
    <>
      {/* Header */}
      <div className="header">
        <h1>Cards & Accounts</h1>
        <div className="user-info">
          <h3>{userData.name}</h3>
          <img
            src={userData.profilePic}
            alt="Profile"
            className="profile-image-small"
          />
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          <FaCheck />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Card Management Section */}
      <div className="content-section">
        <div className="card-tab-selector">
          <div
            className={`card-tab ${activeTab === "credit" ? "active" : ""}`}
            onClick={() => setActiveTab("credit")}
          >
            <FaCreditCard />
            <span>Credit Cards</span>
          </div>
          <div
            className={`card-tab ${activeTab === "debit" ? "active" : ""}`}
            onClick={() => setActiveTab("debit")}
          >
            <FaRegCreditCard />
            <span>Debit Cards</span>
          </div>
          <div
            className={`card-tab ${activeTab === "accounts" ? "active" : ""}`}
            onClick={() => setActiveTab("accounts")}
          >
            <FaUniversity />
            <span>Bank Accounts</span>
          </div>
        </div>

        {/* Credit & Debit Cards Display */}
        {(activeTab === "credit" || activeTab === "debit") && (
          <div className="card-container">
            {userData?.cards?.[activeTab]?.map((card) => (
              <div className="financial-card" key={card.id} style={{ backgroundColor: card.cardColor }}>
                <div className="card-bank-info">
                  <h3>{card.bankName}</h3>
                  <span>{activeTab === "credit" ? "Credit Card" : "Debit Card"}</span>
                </div>
                <div className="card-number">
                  {showCardNumbers[card.id] ? formatCardNumber(card.cardNumber.replace("XXXX XXXX", "1234 5678")) : card.cardNumber}
                  <button 
                    className="visibility-toggle" 
                    onClick={() => toggleCardNumberVisibility(card.id)}
                  >
                    {showCardNumbers[card.id] ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <div className="card-info-row">
                  <div className="cardholder-info">
                    <small>Card Holder</small>
                    <p>{card.cardholderName}</p>
                  </div>
                  <div className="expiry-info">
                    <small>Expires</small>
                    <p>{card.expiryDate}</p>
                  </div>
                  <div className="cvv-info">
                    <small>CVV</small>
                    <p><FaLock /> {card.cvv}</p>
                  </div>
                </div>
                {activeTab === "credit" && (
                  <div className="card-balance-info">
                    <div className="balance-item">
                      <small>Available Credit</small>
                      <p>{formatCurrency(card.limit - card.balance)}</p>
                    </div>
                    <div className="balance-item">
                      <small>Credit Limit</small>
                      <p>{formatCurrency(card.limit)}</p>
                    </div>
                  </div>
                )}
                {activeTab === "debit" && (
                  <div className="card-balance-info">
                    <div className="balance-item">
                      <small>Available Balance</small>
                      <p>{formatCurrency(card.balance)}</p>
                    </div>
                  </div>
                )}
                <button 
                  className="delete-card-btn" 
                  onClick={() => handleDeleteCard(card.id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}

            <div className="add-card-container">
              {!showAddCardForm ? (
                <button className="add-card-btn" onClick={() => setShowAddCardForm(true)}>
                  <FaPlus />
                  <span>Add New {activeTab === "credit" ? "Credit" : "Debit"} Card</span>
                </button>
              ) : (
                <div className="add-card-form">
                  <h3>Add New {activeTab === "credit" ? "Credit" : "Debit"} Card</h3>
                  <form onSubmit={handleAddCard}>
                    <div className="form-group">
                      <label>Card Type</label>
                      <select 
                        name="type" 
                        value={newCard.type}
                        onChange={handleCardFormChange}
                      >
                        <option value="credit">Credit Card</option>
                        <option value="debit">Debit Card</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Bank Name</label>
                      <input 
                        type="text" 
                        name="bankName" 
                        value={newCard.bankName}
                        onChange={handleCardFormChange}
                        placeholder="Enter bank name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Card Number</label>
                      <input 
                        type="text" 
                        name="cardNumber" 
                        value={newCard.cardNumber}
                        onChange={handleCardFormChange}
                        placeholder="XXXX XXXX XXXX XXXX"
                        maxLength="19"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Cardholder Name</label>
                      <input 
                        type="text" 
                        name="cardholderName" 
                        value={newCard.cardholderName}
                        onChange={handleCardFormChange}
                        placeholder="Enter name on card"
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group half">
                        <label>Expiry Date</label>
                        <input 
                          type="text" 
                          name="expiryDate" 
                          value={newCard.expiryDate}
                          onChange={handleCardFormChange}
                          placeholder="MM/YY"
                          maxLength="5"
                          required
                        />
                      </div>
                      <div className="form-group half">
                        <label>CVV</label>
                        <input 
                          type="password" 
                          name="cvv" 
                          value={newCard.cvv}
                          onChange={handleCardFormChange}
                          placeholder="***"
                          maxLength="3"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Card Color</label>
                      <input 
                        type="color" 
                        name="cardColor" 
                        value={newCard.cardColor}
                        onChange={handleCardFormChange}
                      />
                    </div>
                    <div className="form-buttons">
                      <button type="button" onClick={() => setShowAddCardForm(false)}>Cancel</button>
                      <button type="submit">Add Card</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bank Accounts Display */}
        {activeTab === "accounts" && (
          <div className="card-container">
            {userData?.cards?.accounts?.map((account) => (
              <div className="financial-card" key={account.id} style={{ backgroundColor: "#1a2f55" }}>
                <div className="card-bank-info">
                  <h3>{account.bankName}</h3>
                  <span>{account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} Account</span>
                </div>
                <div className="card-bank-info">
                  <small>Account Name</small>
                  <p>{account.accountName}</p>
                </div>
                <div className="card-number">
                  {showAccountNumbers[account.id] 
                    ? account.accountNumber.replace("XXXX XXXX", "1234 5678") 
                    : account.accountNumber}
                  <button 
                    className="visibility-toggle" 
                    onClick={() => toggleAccountNumberVisibility(account.id)}
                  >
                    {showAccountNumbers[account.id] ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <div className="card-info-row">
                  <div className="cardholder-info">
                    <small>IFSC Code</small>
                    <p>{account.ifscCode}</p>
                  </div>
                </div>
                <div className="card-balance-info">
                  <div className="balance-item">
                    <small>Available Balance</small>
                    <p>{formatCurrency(account.balance)}</p>
                  </div>
                </div>
                <button 
                  className="delete-card-btn" 
                  onClick={() => handleDeleteAccount(account.id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}

            <div className="add-card-container">
              {!showAddAccountForm ? (
                <button className="add-card-btn" onClick={() => setShowAddAccountForm(true)}>
                  <FaPlus />
                  <span>Add New Bank Account</span>
                </button>
              ) : (
                <div className="add-card-form">
                  <h3>Add New Bank Account</h3>
                  <form onSubmit={handleAddAccount}>
                    <div className="form-group">
                      <label>Account Name</label>
                      <input 
                        type="text" 
                        name="accountName" 
                        value={newAccount.accountName}
                        onChange={handleAccountFormChange}
                        placeholder="E.g. Primary Savings"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Bank Name</label>
                      <input 
                        type="text" 
                        name="bankName" 
                        value={newAccount.bankName}
                        onChange={handleAccountFormChange}
                        placeholder="Enter bank name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Account Number</label>
                      <input 
                        type="text" 
                        name="accountNumber" 
                        value={newAccount.accountNumber}
                        onChange={handleAccountFormChange}
                        placeholder="XXXX XXXX XXXX"
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group half">
                        <label>IFSC Code</label>
                        <input 
                          type="text" 
                          name="ifscCode" 
                          value={newAccount.ifscCode}
                          onChange={handleAccountFormChange}
                          placeholder="e.g. SBIN0001234"
                          required
                        />
                      </div>
                      <div className="form-group half">
                        <label>Account Type</label>
                        <select 
                          name="accountType" 
                          value={newAccount.accountType}
                          onChange={handleAccountFormChange}
                        >
                          <option value="savings">Savings</option>
                          <option value="current">Current</option>
                          <option value="salary">Salary</option>
                          <option value="fixed-deposit">Fixed Deposit</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Initial Balance</label>
                      <input 
                        type="number" 
                        name="balance" 
                        value={newAccount.balance}
                        onChange={handleAccountFormChange}
                        placeholder="Enter initial balance amount"
                        required
                      />
                    </div>
                    <div className="form-buttons">
                      <button type="button" onClick={() => setShowAddAccountForm(false)}>Cancel</button>
                      <button type="submit">Add Account</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="card-security-info">
          <div className="info-box">
            <FaInfoCircle />
            <div>
              <h4>Banking Security</h4>
              <p>Your financial details are stored securely in your device's local storage. We recommend not using your actual account numbers and card details for security reasons.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cards; 