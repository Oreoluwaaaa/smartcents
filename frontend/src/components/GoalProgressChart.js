import React from 'react';
import { Line } from 'react-chartjs-2';

//chart for individual goal progress
const GoalProgressChart = ({ goalData }) => {
    const data = {
        labels: goalData.dates, // Example array of dates
        datasets: [
            {
                label: 'Savings Progress',
                data: goalData.amounts, // Example array of saved amounts
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true
            }
        ]
    };

    const options = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'week'
                }
            },
            y: {
                beginAtZero: true
            }
        }
    };

    return <Line data={data} options={options} />;
};

export default GoalProgressChart;
