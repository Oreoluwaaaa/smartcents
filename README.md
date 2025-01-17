
# SmartCents- CLAFLIN X BE SMART HACKATHON

SmartCents is a comprehensive web application aimed at helping users manage their financial goals, track progress, and make informed investment decisions. The app integrates authentication, goal setting, and interactive data visualization to offer users a personalized financial management experience.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Technologies Used](#technologies-used)
- [File Structure](#file-structure)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Contributing](#contributing)


## Features
- **User Authentication**: Sign-up and log-in functionality with JWT-based authentication.
- **Financial Goal Management**: Users can add, update, and delete financial goals, with interactive progress tracking.
- **Investment Page**: Provides personalized advice based on user input, backed by API calls.
- **Data Visualization**: Interactive charts for goal tracking using `Chart.js`.
- **Responsive Design**: A user-friendly interface that adapts to different screen sizes.
- **Sponsor Integration**: Highlighted sponsors with resources and educational material for users.

## Installation
To run this project locally, follow these steps:

1. **Clone the Repository**:
   ```
   git clone https://github.com/Oreolwaaaa/smartcents.git
   cd smartcents
   ```

2. **Backend Setup**:
   - Ensure `Python 3.x` is installed.
   - Navigate to the `backend` directory and create a virtual environment:
     ```
     python -m venv env
     source env/bin/activate  # On Windows, use `env\Scripts\activate`
     ```
   - Install the dependencies:
     ```
     pip install -r requirements.txt
     ```

   - Run the backend server:
     ```
     flask run
     ```

3. **Frontend Setup**:
   - Navigate to the `frontend` directory.
   - Install dependencies:
     ```
     npm install
     ```
   - Start the development server:
     ```
     npm start
     ```

## Technologies Used
### Frontend
- **React.js** for the user interface
- **React Router** for client-side routing
- **Chart.js** for data visualization
- **Axios** for HTTP requests

### Backend
- **Flask** for building the RESTful API
- **Flask-Bcrypt** for password hashing
- **PyMongo** for MongoDB interactions

### Other Libraries
- **JWT Decode** for token decoding in the frontend
- **TQDM** for progress tracking
- **Chart.js Plugins** for interactive charts

## File Structure
### Frontend (`src/`)
- **App.js**: Main application file setting up routes.
- **components/**: Contains all React components.
  - `NavBar.js`: Navigation bar component.
  - `LoginForm.js`: User login form.
  - `SignUpForm.js`: User registration form.
  - `AccountPage.js`: Displays user data and manages goals.
  - `InvestmentPage.js`: Provides investment-related functionality.
  - `AddGoalForm.js`: Form to add new financial goals.
  - `GoalProgressChart.js`: Component to display goal progress using line charts.
- **api.js**: Configured Axios instance for HTTP requests.
- **styles/**: Contains `App.css` and other styling files.
- **index.js**: Main entry point for React.

### Backend (`backend/`)
- **app.py**: Main server file containing API routes.
- **requirements.txt**: List of Python dependencies.

## Usage
1. Visit the home page and create an account or log in.
2. Navigate to the account page to manage financial goals.
3. Use the investment page to get advice based on user input.
4. Track goal progress with interactive charts.

## API Reference
### Base URL
`http://localhost:5000`

### Endpoints
- **`POST /signup`**: Registers a new user.
- **`POST /login`**: Authenticates a user and returns a JWT.
- **`GET /account/<username>`**: Retrieves user data.
- **`POST /add_goal`**: Adds a new financial goal.
- **`POST /update_goal`**: Updates saved amounts for an existing goal.
- **`POST /delete_goal`**: Deletes a goal.

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit them (`git commit -m 'Add your feature'`).
4. Push to your branch (`git push origin feature/your-feature`).
5. Open a pull request.

