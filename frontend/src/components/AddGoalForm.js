import React, { useState } from 'react';
import axios from 'axios';

const AddGoalForm = ({ username , onGoalAdded}) => {

    //persistence
    const [goalName, setGoalName] = useState('');
    const [targetAmount, setTargetAmount] = useState();
    const [savedAmount, setSavedAmount] = useState();
    console.log('Goal Name:', goalName);
    console.log('Target Amount:', targetAmount);
    console.log('Saved Amount:', savedAmount);

    //submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        console.log("token", token)
        try {
            await axios.post('http://127.0.0.1:5000/add_goal', {
                username: username,
                goal_name: goalName,
                target_amount: Number(targetAmount),
                saved_amount: Number(savedAmount)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("post", token)
            
            setGoalName('');
            setTargetAmount('');
            setSavedAmount('');
            if (onGoalAdded) {
                onGoalAdded(); // re-fetch of user data
            }
        } catch (error) {
            console.error('Error adding goal:', error);
            console.log("GoalClick");
           
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input id= "goal-input"
                type="text"
                placeholder="Goal Name"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                required
            />
            <input id= "goal-input"
                type="number"
                placeholder="Target Amount"
                value={targetAmount}
                onChange={(e) => setTargetAmount(Number(e.target.value))}
                required
            />
            <input id= "goal-input"
                type="number"
                placeholder="Saved Amount"
                value={savedAmount}
                onChange={(e) => setSavedAmount(Number(e.target.value))}
                required
            />
            <button type="submit">Add Goal</button>
        </form>
    );
};

export default AddGoalForm;
