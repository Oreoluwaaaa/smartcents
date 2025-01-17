import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; 
import { Bar } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import AddGoalForm from './AddGoalForm';

import {
    Chart as ChartJS,
    CategoryScale, 
    LinearScale,
    ArcElement, 
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// register the required components globally
ChartJS.register(
    CategoryScale,
    LinearScale,
    ArcElement, 
    BarElement,
    Title,
    Tooltip,
    Legend
);
//account page logic
const AccountPage = () => {
    //get user data
    const { username } = useParams(); 
    const [userData, setUserData] = useState(null);

    //get goals 
    const [showAddGoalForm, setShowAddGoalForm] = useState(false); 
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [updateAmount, setUpdateAmount] = useState('');
    const [clickedLabel, setClickedLabel] = useState(null);

    const handleBarClick = (goalName) => {
        setSelectedGoal(goalName);
    };


    console.log(username);
    

    //get user data
    const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        
        try {
            const response = await axios.get(`http://127.0.0.1:5000/account/${username}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response);
            setUserData(response.data);
            console.log(userData)

        } catch (error) {
            console.error('Error fetching user data:', error);
            
        }
    };

    //persistence
    useEffect(() => {
        
        if (username) {
            fetchUserData();
            console.log(userData)
        }
    }, [userData]);

    //peekaboo form
    const handleGoalAdded = () => {
        setShowAddGoalForm(false); 
        fetchUserData(); 
    };


    //logic to handle saved amount
    const handleSaveAmount = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://127.0.0.1:5000/update_goal', {
                username,
                goal_name: selectedGoal,
                add_amount: parseInt(updateAmount),
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Amount added successfully!');
            setUpdateAmount('');
            setUserData((prevData) => {
                const updatedData = { ...prevData };
                updatedData.goals[selectedGoal][1] += parseInt(updateAmount);
                return updatedData;
            });
        } catch (error) {
            console.error('Error updating goal:', error);
        }
    };


    //logic to delete goal
    const handleDeleteGoal = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://127.0.0.1:5000/delete_goal', {
                username,
                goal_name: selectedGoal,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Goal deleted successfully!');
            setSelectedGoal(null);
            setUserData((prevData) => {
                const updatedData = { ...prevData };
                delete updatedData.goals[selectedGoal];
                return updatedData;
            });
        } catch (error) {
            console.error('Error deleting goal:', error);
        }
    };

    //if data is unavailabe
    if (!userData) {
        return <p>No user data available.</p>;
    }

    // prepare data for the bar graph
    const goalNames = Object.keys(userData.goals);
    const targetAmounts = goalNames.map(goal => userData.goals[goal][0]);
    const savedAmounts = goalNames.map(goal => userData.goals[goal][1]);

    const pieChartData = selectedGoal && {
        labels: ['Target Amount', 'Saved Amount'],
        datasets: [
            {
                data: [userData.goals[selectedGoal][0]- userData.goals[selectedGoal][1], userData.goals[selectedGoal][1]],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
            },
        ],
    };

    const chartData = {
        labels: goalNames,
        datasets: [
            {
                label: 'Target Amount',
                data: targetAmounts,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 0.6)',
                order: 1,
                borderWidth: 0.5,
            },
            {
                label: 'Saved Amount',
                data: savedAmounts,
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 0.6)',
                borderWidth: 0.5,
                order: 0,
            },
        ],
    };


    const chartOptions = {
        responsive: true,
        onClick: (event, elements) => {
            const clickedElementIndex = elements[0].index
            const clickedLabel = chartData.labels[clickedElementIndex];
            console.log("Clicked", clickedLabel)
            setClickedLabel(clickedLabel);
            
            setSelectedGoal(clickedLabel);
            
        },
        plugins: {
            tooltip: {
                mode: 'index',
                intersect: false,
            },
            legend: {
                position: 'top',
            },
        },
        scales: {
            x: {
                stacked:true,
                beginAtZero: true,
            },
            y: {
               beginAtZero: true,
            },
        },
    };
    
    return (
        <div className="account-page">
            <div className="account-welcome">
                <h1>Welcome, {userData.first_name}!</h1>  
            </div>
            <div id="streak-container">
                <h3 className="streak-text">Save Streak: {userData.current_streak}</h3>
                <img className="streak-icon" src="/streak.png" alt="Streak Icon" />
            </div>  
            <header className="account-header">
                <div className="account-container">
                    <main className="account-main">
                        <div className="goals-section">
                            <h2>Your Goals</h2>
                            <Bar 
                                data = {chartData}
                                options={chartOptions}
                                
                            />
                            <button className="add-goal-button" onClick={() => setShowAddGoalForm(!showAddGoalForm)}>+</button>
                
                            {/* Conditionally render AddGoalForm */}
                            {showAddGoalForm && (
                                <div className="add-goal-form-container">
                                    <AddGoalForm username={username} onGoalAdded={handleGoalAdded} />
                                </div>
                            )}


                            {pieChartData && clickedLabel && (
                                <div className="goal-details">
                                    <h3>{clickedLabel}</h3>
                                    <div style={{ width: '30%', height: '30%', margin: '0 auto' }}> {/* 70% smaller than default */}
                                        <Pie data={pieChartData} />
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="Enter amount to save"
                                        value={updateAmount}
                                        onChange={(e) => setUpdateAmount(e.target.value)}
                                    />
                                    <button onClick={handleSaveAmount}>Save</button>
                                    <button onClick={handleDeleteGoal} style={{ backgroundColor: 'red', color: 'white' }}>Delete Goal</button>
                                </div>
                            )}
                        </div>
                
                    </main>
                </div>
            </header>

        </div>
    );
};

export default AccountPage;
