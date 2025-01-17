import React, { useState } from 'react';

const InvestmentPage = () => {
    const [userInput, setUserInput] = useState('');
    const [output, setOutput] = useState({ emotion: '', advice: '', scenario: '' });

    const handleSubmit = async () => {
        //calling the api
        try {
            //getting the response
            const response = await fetch('http://127.0.0.1:5000/invest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input: userInput }),
            });

            const data = await response.json();
            //collecting the data from gemini
            setOutput({ emotion: data.emotion, advice: data.advice, scenario: data.scenario });
        } catch (error) {
            console.error('Error processing input:', error);
        }
    };

    return (
        <div className="investment-page">
            <h3>Talk to us:</h3>
            <textarea
                placeholder="Describe your current feelings about your financial situation..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
            />
            <button type="submit" onClick={handleSubmit}>Submit</button>
            <div className="output-container">
            <img src="/navbar.png" alt="Navbar" className="output-image" />
            <div className="output-text">
                {output && (
                    <>
                        <p>{output.advice}</p>
                        <p>{output.scenario}</p>
                    </>
                )}
            </div>
        </div>
        <div>
                <h2>We Also Think These Might Be Helpful: </h2>
                <div class="sponsor-container">
                <div>
                    <img id="sponsor" src="/american.png"/>
                    <p><strong>American Airlines co-branded cards with Citi and Barclays offer benefits such as bonus miles, no foreign transaction fees, and travel perks for students who use them wisely. These are a good way to help build your credit.</strong></p>
                    <a href="https://www.aa.com/web/i18n/aadvantage-program/credit-cards/aadvantage-credit-cards.html">Learn More</a>
                </div>
                <div>
                    <img id="sponsor" src="/fidelity.png"/>
                    <p><strong>Fidelity provides a brokerage account ideal for college students, with no fees and access to commission-free trading and educational resources.</strong></p>
                    <a href="https://www.fidelity.com/">Learn More</a>
                    
                </div>
                <div>
                    <img id="sponsor" src="/johnh.jpeg"/>
                    <p><strong>John Hancock offers several tools for students to understand the importance of saving early for retirement as well as other educational resources for beginners on financial markets, mutual funds, and ETFs.</strong></p>
                    <a href="https://www.jhinvestments.com/">Learn More</a>
                    
                </div>
                </div>
            </div>
        </div>
    );
};

export default InvestmentPage;
