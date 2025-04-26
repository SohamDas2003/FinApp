import React, { useState, useEffect } from "react";
import {
  FaChartLine,
  FaWallet,
  FaExchangeAlt,
  FaRegCreditCard,
  FaCog,
  FaSignOutAlt,
  FaPlus,
  FaTrash,
  FaEdit,
  FaFlag,
  FaTrophy,
  FaMoneyBillWave,
  FaCheck,
  FaRegCalendarAlt,
} from "react-icons/fa";
import "../styles/App.css";
import AppLayout from "./AppLayout";
import News from "./News";

const Goals = ({ user, onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = useState("goals");
  const [goals, setGoals] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [newGoal, setNewGoal] = useState({
    id: null,
    name: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    category: "Savings",
    notes: "",
    createdAt: "",
  });

  // Goal categories
  const goalCategories = [
    "Savings",
    "Emergency Fund",
    "Retirement",
    "Education",
    "Travel",
    "Home",
    "Vehicle",
    "Debt Repayment",
    "Major Purchase",
    "Other",
  ];

  useEffect(() => {
    // Load saved goals from localStorage
    const storedUser = JSON.parse(localStorage.getItem("finapp_user"));
    if (storedUser && storedUser.goals) {
      setGoals(storedUser.goals);
    } else if (user.financialDetails) {
      // Generate some example goals if none exist
      const monthlyIncome = user.financialDetails.monthlyIncome || 50000;

      const generatedGoals = [
        {
          id: 1,
          name: "Emergency Fund",
          targetAmount: monthlyIncome * 6,
          currentAmount: monthlyIncome * 2,
          deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          category: "Emergency Fund",
          notes: "Build a 6-month emergency fund for unexpected expenses",
          createdAt: new Date().toISOString(),
          milestones: [25, 50, 75, 100],
          reachedMilestones: [25],
        },
        {
          id: 2,
          name: "Europe Trip",
          targetAmount: monthlyIncome * 3,
          currentAmount: monthlyIncome * 1,
          deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          category: "Travel",
          notes: "Dream vacation to visit France, Italy and Spain",
          createdAt: new Date().toISOString(),
          milestones: [25, 50, 75, 100],
          reachedMilestones: [25],
        },
        {
          id: 3,
          name: "Down Payment for Home",
          targetAmount: monthlyIncome * 24,
          currentAmount: monthlyIncome * 4,
          deadline: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          category: "Home",
          notes: "Save 20% for down payment on a new home",
          createdAt: new Date().toISOString(),
          milestones: [25, 50, 75, 100],
          reachedMilestones: [],
        },
      ];

      setGoals(generatedGoals);

      // Save the generated goals
      const updatedUser = {
        ...storedUser,
        goals: generatedGoals,
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
    setNewGoal({
      ...newGoal,
      [name]: value,
    });
  };

  const handleAddGoal = (e) => {
    e.preventDefault();

    if (!newGoal.name || !newGoal.targetAmount || !newGoal.deadline) {
      alert("Please fill in all required fields");
      return;
    }

    const targetAmount = parseFloat(newGoal.targetAmount);
    const currentAmount = parseFloat(newGoal.currentAmount || 0);

    if (currentAmount > targetAmount) {
      alert("Current amount cannot exceed target amount");
      return;
    }

    let updatedGoals;

    if (editingGoalId) {
      // Update existing goal
      updatedGoals = goals.map((goal) => {
        if (goal.id === editingGoalId) {
          // Calculate which milestones have been reached
          const progressPercentage = Math.floor((currentAmount / targetAmount) * 100);
          const milestones = [25, 50, 75, 100];
          const reachedMilestones = milestones.filter(m => progressPercentage >= m);
          
          return {
            ...goal,
            name: newGoal.name,
            targetAmount,
            currentAmount,
            deadline: newGoal.deadline,
            category: newGoal.category,
            notes: newGoal.notes,
            milestones,
            reachedMilestones,
          };
        }
        return goal;
      });
    } else {
      // Add new goal
      const progressPercentage = Math.floor((currentAmount / targetAmount) * 100);
      const milestones = [25, 50, 75, 100];
      const reachedMilestones = milestones.filter(m => progressPercentage >= m);
      
      const goalEntry = {
        id: Date.now(),
        name: newGoal.name,
        targetAmount,
        currentAmount,
        deadline: newGoal.deadline,
        category: newGoal.category,
        notes: newGoal.notes || "",
        createdAt: new Date().toISOString(),
        milestones,
        reachedMilestones,
      };

      updatedGoals = [...goals, goalEntry];
    }

    setGoals(updatedGoals);

    // Save to localStorage
    const storedUser = JSON.parse(localStorage.getItem("finapp_user"));
    const updatedUser = {
      ...storedUser,
      goals: updatedGoals,
    };
    localStorage.setItem("finapp_user", JSON.stringify(updatedUser));

    // Reset form
    setNewGoal({
      id: null,
      name: "",
      targetAmount: "",
      currentAmount: "",
      deadline: "",
      category: "Savings",
      notes: "",
    });
    setShowAddForm(false);
    setEditingGoalId(null);
  };

  const startEditGoal = (goal) => {
    setNewGoal({
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      deadline: goal.deadline,
      category: goal.category,
      notes: goal.notes,
    });
    setEditingGoalId(goal.id);
    setShowAddForm(true);
  };

  const deleteGoal = (goalId) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      const updatedGoals = goals.filter((goal) => goal.id !== goalId);
      setGoals(updatedGoals);

      // Save to localStorage
      const storedUser = JSON.parse(localStorage.getItem("finapp_user"));
      const updatedUser = {
        ...storedUser,
        goals: updatedGoals,
      };
      localStorage.setItem("finapp_user", JSON.stringify(updatedUser));
    }
  };

  const calculateDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysRemaining;
  };

  const getProgressColor = (progress) => {
    if (progress < 25) return "#ff5252";
    if (progress < 50) return "#ffb74d";
    if (progress < 75) return "#29b6f6";
    return "#66bb6a";
  };

  const getStatusText = (goal) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const daysRemaining = calculateDaysRemaining(goal.deadline);
    
    if (progress >= 100) return "Completed!";
    if (daysRemaining < 0) return "Overdue";
    if (daysRemaining <= 30) return "Urgent";
    if (progress >= 75) return "Almost there!";
    if (progress >= 50) return "Halfway there";
    return "In progress";
  };

  const updateGoalAmount = (goalId, newAmount) => {
    if (newAmount === "" || isNaN(newAmount)) {
      alert("Please enter a valid amount");
      return;
    }

    const updatedGoals = goals.map((goal) => {
      if (goal.id === goalId) {
        const targetAmount = goal.targetAmount;
        const currentAmount = parseFloat(newAmount);
        
        if (currentAmount > targetAmount) {
          alert("Current amount cannot exceed target amount");
          return goal;
        }
        
        // Calculate which milestones have been reached
        const progressPercentage = Math.floor((currentAmount / targetAmount) * 100);
        const reachedMilestones = goal.milestones.filter(m => progressPercentage >= m);
        
        // Check for newly reached milestones
        const newMilestones = reachedMilestones.filter(m => !goal.reachedMilestones.includes(m));
        if (newMilestones.length > 0) {
          // Milestone notification
          alert(`Congratulations! You've reached the ${newMilestones[0]}% milestone for your "${goal.name}" goal!`);
        }
        
        return {
          ...goal,
          currentAmount,
          reachedMilestones,
        };
      }
      return goal;
    });

    setGoals(updatedGoals);

    // Save to localStorage
    const storedUser = JSON.parse(localStorage.getItem("finapp_user"));
    const updatedUser = {
      ...storedUser,
      goals: updatedGoals,
    };
    localStorage.setItem("finapp_user", JSON.stringify(updatedUser));
  };

  return (
    <AppLayout 
      user={user} 
      activeTab={activeTab} 
      onNavigate={onNavigate} 
      onLogout={onLogout}
    >
      {/* Header */}
      <div className="header">
        <h2 className="header-title">
          <FaFlag style={{ marginRight: "10px" }} /> Financial Goals
        </h2>
        <div className="header-right">
          <button
            className="add-button"
            onClick={() => {
              setNewGoal({
                id: null,
                name: "",
                targetAmount: "",
                currentAmount: "",
                deadline: "",
                category: "Savings",
                notes: "",
              });
              setEditingGoalId(null);
              setShowAddForm(!showAddForm);
            }}
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
            {showAddForm ? "Cancel" : "Add Goal"}
          </button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Add/Edit Goal Form */}
        {showAddForm && (
          <div className="dashboard-card card-full" style={{ padding: "20px" }}>
            <h3 className="card-title">{editingGoalId ? "Edit Goal" : "Add New Goal"}</h3>
            <form onSubmit={handleAddGoal} className="finance-form">
              <div className="form-row" style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Goal Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={newGoal.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Emergency Fund, New Car"
                    required
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
                
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Category</label>
                  <select
                    name="category"
                    value={newGoal.category}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#2d2d2d",
                      border: "1px solid var(--border-color)",
                      borderRadius: "5px",
                      color: "var(--text-light)",
                    }}
                  >
                    {goalCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-row" style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Target Amount*</label>
                  <input
                    type="number"
                    name="targetAmount"
                    value={newGoal.targetAmount}
                    onChange={handleInputChange}
                    placeholder="500000"
                    required
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
                
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Current Amount</label>
                  <input
                    type="number"
                    name="currentAmount"
                    value={newGoal.currentAmount}
                    onChange={handleInputChange}
                    placeholder="0"
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
              
              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label>Target Date*</label>
                <input
                  type="date"
                  name="deadline"
                  value={newGoal.deadline}
                  onChange={handleInputChange}
                  required
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
              
              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={newGoal.notes}
                  onChange={handleInputChange}
                  placeholder="Additional details about your goal"
                  rows="3"
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
              
              <div className="form-buttons" style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
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
                  }}
                >
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
                  }}
                >
                  {editingGoalId ? "Update Goal" : "Add Goal"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Goals List */}
        <div className="dashboard-card card-full">
          <h3 className="card-title">Your Financial Goals</h3>
          <div className="goals-container">
            {goals.length === 0 ? (
              <div className="empty-state">
                <FaFlag size={48} style={{ opacity: 0.3 }} />
                <h3>No financial goals yet</h3>
                <p>Create your first financial goal to start tracking your progress</p>
                <button
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "var(--primary-color)",
                    border: "none",
                    borderRadius: "5px",
                    color: "#000",
                    cursor: "pointer",
                    fontWeight: "bold",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                  onClick={() => {
                    setNewGoal({
                      id: null,
                      name: "",
                      targetAmount: "",
                      currentAmount: "",
                      deadline: "",
                      category: "Savings",
                      notes: "",
                    });
                    setEditingGoalId(null);
                    setShowAddForm(true);
                  }}
                >
                  <FaPlus style={{ marginRight: "5px" }} /> Create a Goal
                </button>
              </div>
            ) : (
              <div className="goals-grid">
                {goals.map((goal) => {
                  const progress = (goal.currentAmount / goal.targetAmount) * 100;
                  const daysRemaining = calculateDaysRemaining(goal.deadline);
                  const progressColor = getProgressColor(progress);
                  const statusText = getStatusText(goal);
                  
                  return (
                    <div key={goal.id} className="goal-card">
                      <div className="goal-header">
                        <h3>{goal.name}</h3>
                        <div className="goal-category">{goal.category}</div>
                      </div>
                      
                      <div className="goal-amount">
                        <div className="goal-current">
                          <span>Current: </span>
                          {formatCurrency(goal.currentAmount)}
                        </div>
                        <div className="goal-target">
                          <span>Target: </span>
                          {formatCurrency(goal.targetAmount)}
                        </div>
                      </div>
                      
                      <div className="goal-progress-container">
                        <div 
                          className="goal-progress-bar" 
                          style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: progressColor }}
                        ></div>
                      </div>
                      
                      <div className="goal-stats">
                        <div className="goal-progress-percentage">
                          {Math.round(progress)}% complete
                        </div>
                        <div className={`goal-status ${daysRemaining < 0 ? 'overdue' : ''}`}>
                          {statusText}
                        </div>
                      </div>
                      
                      <div className="goal-deadline">
                        <FaRegCalendarAlt />
                        <span>
                          {daysRemaining < 0
                            ? `Overdue by ${Math.abs(daysRemaining)} days`
                            : `${daysRemaining} days remaining`}
                        </span>
                      </div>
                      
                      {goal.notes && (
                        <div className="goal-notes">{goal.notes}</div>
                      )}
                      
                      <div className="goal-milestones">
                        {goal.milestones.map((milestone) => (
                          <div 
                            key={milestone} 
                            className={`milestone ${goal.reachedMilestones.includes(milestone) ? 'reached' : ''}`}
                            title={`${milestone}% milestone ${goal.reachedMilestones.includes(milestone) ? 'reached' : 'not reached yet'}`}
                          >
                            {goal.reachedMilestones.includes(milestone) ? <FaCheck /> : milestone}
                          </div>
                        ))}
                      </div>
                      
                      <div className="goal-actions">
                        <div className="update-amount">
                          <input
                            type="number"
                            placeholder="Update amount"
                            style={{
                              width: "100%",
                              padding: "8px",
                              backgroundColor: "#2d2d2d",
                              border: "1px solid var(--border-color)",
                              borderRadius: "4px",
                              color: "var(--text-light)",
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                updateGoalAmount(goal.id, e.target.value);
                                e.target.value = '';
                              }
                            }}
                          />
                        </div>
                        <button
                          className="edit-button"
                          onClick={() => startEditGoal(goal)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => deleteGoal(goal.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* News sidebar */}
      <div className="right-sidebar">
        <News />
      </div>
    </AppLayout>
  );
};

export default Goals; 