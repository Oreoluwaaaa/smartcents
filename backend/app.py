from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin  # CORS
import jwt
import datetime
import os
import certifi
from dotenv import load_dotenv
from bson import ObjectId
import google.generativeai as genai
import re

#load environment variables from .env file
load_dotenv()

#gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

model = genai.GenerativeModel("gemini-1.5-flash") #Gemini model used

#start application
app = Flask(__name__)

# Enable CORS
CORS(app, origins=["http://localhost:3000"])


bcrypt = Bcrypt(app)

# mongodb URI with database name specified
app.config['MONGO_URI'] = os.getenv("MONGO_URI")
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")

# initilise Mongo
mongo = PyMongo(app, tlsCAFile=certifi.where())

# check if MongoDB connection is successful
@app.before_request
def check_mongo_connection():
    try:
        mongo.db.command('ping')  # Ping the database
        print("MongoDB connection successful")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")


#signup page
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    # Input validation
    if not all([data.get('firstName'), data.get('lastName'), data.get('username'), data.get('password')]):
        return jsonify({"error": "First name, last name, username, and password are required"}), 400

    if len(data['password']) < 8:
        return jsonify({"error": "Password must be at least 8 characters long"}), 400

    first_name = data['firstName']
    last_name = data['lastName']
    username = data['username']
    password = data['password']

    # check if the user already exists
    if mongo.db.users.find_one({'username': username}):
        return jsonify({"error": "Username already exists. Login instead."}), 400

    # hs the password and store user data for security
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    mongo.db.users.insert_one({
        'username': username,
        'password': hashed_password,
        'first_name': first_name,
        'last_name': last_name,
        'created_at': datetime.datetime.utcnow(),
        'updated_at': datetime.datetime.utcnow(),
        'current_streak': 0,  
        'goals': {}
    })

    return jsonify({"message": "User created successfully"}), 201

#login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    user = mongo.db.users.find_one({'username': username})
    if user and bcrypt.check_password_hash(user['password'], password):
        # Generate JWT token
        token = jwt.encode(
            {'user_id': str(user['_id']), 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)},
            app.config['SECRET_KEY'],
            algorithm="HS256"
        )
        return jsonify({"token": token}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401

#signin
@app.route('/account/<username>', methods=['GET'])
def get_account(username):
    user = mongo.db.users.find_one({'username': username})
    if user:
        user['_id'] = str(user['_id'])
        return jsonify(user), 200
    else:
        return jsonify({"error": "User not found"}), 404

#add_goal
@app.route('/add_goal', methods=['POST'])
def add_goal():
    data = request.get_json()

    # Extract data from the request
    username = data.get('username')
    goal_name = data.get('goal_name')
    target_amount = data.get('target_amount')
    saved_amount = data.get('saved_amount')

    print(target_amount)
    # Check if username is provided
    if not username:
        return jsonify({"error": "Username is required"}), 400

    # Find the user in the database
    user = mongo.db.users.find_one({'username': username})

    if user:
        # Update the goals field in the database
        mongo.db.users.update_one(
            {'username': username},
            {'$set': {f'goals.{goal_name}': [target_amount, saved_amount]}},
        )

        mongo.db.users.update_one(
            {'username': username},
            {'$inc': {'current_streak': 1}}
        )
        return jsonify({"message": "Goal added successfully"}), 200
    
    else:
        return jsonify({"error": "User not found"}), 404

#update_goal   
@app.route('/update_goal', methods=['POST'])
def update_goal():
    data = request.get_json()
    username = data.get('username')
    goal_name = data.get('goal_name')
    add_amount = data.get('add_amount')

    user = mongo.db.users.find_one({'username': username})
    if user:
        new_saved_amount = user['goals'][goal_name][1] + add_amount
        mongo.db.users.update_one(
            {'username': username},
            {'$set': {f'goals.{goal_name}.1': new_saved_amount}},
        )
        # Increment the current_streak by 1
        mongo.db.users.update_one(
            {'username': username},
            {'$inc': {'current_streak': 1}}  # Increment current_streak by 1
        )
        return jsonify({"message": "Goal updated successfully"}), 200
    else:
        return jsonify({"error": "User not found"}), 404

#delete goal
@app.route('/delete_goal', methods=['POST'])
def delete_goal():
    data = request.get_json()
    username = data.get('username')
    goal_name = data.get('goal_name')

    user = mongo.db.users.find_one({'username': username})
    if user:
        mongo.db.users.update_one(
            {'username': username},
            {'$unset': {f'goals.{goal_name}': ""}}
        )
        return jsonify({"message": "Goal deleted successfully"}), 200
    else:
        return jsonify({"error": "User not found"}), 404


#gen ai sentiment script and output
@app.route('/invest', methods=['POST'])
def invest():
    data = request.get_json()
    print("Received data:", data)  # Debug line to see the full request data

    # Update the key to match the received key 'input'
    user_input = data.get('input')
    
    # Check if user_input exists
    if not user_input:
        return jsonify({"error": "Input is required"}), 400

    print("User input:", user_input)

    try:
        # Your existing processing code here...
        response = model.generate_content(
            f"Analyze the sentiment in the following statement: '{user_input}'. "
            "Identify the single most prominent emotion."
        )

        emotions = re.findall(r"\*\*(.*?)\*\*", response.text)
        primary_emotion = emotions[0] if emotions else "uncertainty"

        advice_response = model.generate_content(
            f"Provide advice (2-3 sentences maximum) for someone who is feeling {primary_emotion} about their financial situation."
        )
        advice = ". ".join(advice_response.text.split(". ")[:3]).strip()

        scenario_response = model.generate_content(
            f"Generate a scenario (2-3 sentences) that helps someone feeling {primary_emotion} visualize a positive future regarding their financial situation."
        )
        scenario = ". ".join(scenario_response.text.split(". ")[:3]).strip()
        print(scenario)
        return jsonify({
            "emotion": primary_emotion,
            "advice": advice,
            "scenario": scenario
        }), 200

    except Exception as e:
        print(f"Error processing input: {e}")
        return jsonify({"error": "Failed to process input"}), 500


if __name__ == '__main__':
    app.run(debug=True)
