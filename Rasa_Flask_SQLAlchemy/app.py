from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from spellchecker import SpellChecker
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Conversation, Feedback, UnhandledMessage, Session

# Initialise Flask app
app = Flask(__name__)

# Configure the SQLAlchemy connection string
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////Users/henrygasparic/Desktop/DIsertation/practice/Rasa/RasaFlask/database/test1.db'

# Initialise SQLAlchemy
db.init_app(app)

# Configure CORS to allow requests from origin
CORS(app, resources={r"*": {"origins": "http://localhost:3000"}})

# Define the URL of the RASA server for handling chatbot interactions
RASA_SERVER_URL = 'http://localhost:5005/webhooks/rest/webhook'

# Route to register new users
@app.route('/sign-in', methods=['POST'])
def sign_in():
    try:
        data = request.json
        username = data['username']
        password = data['password']

        # Check if username already exists
        existing_user = User.query.filter_by(username=username).first()

        if existing_user:
            return jsonify({'message': 'Username already exists'}), 400

        # Hash the password and add new user to the database
        hashed_password = generate_password_hash(password)
        new_user = User(username=username, password_hash=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            'message': 'User registered successfully',
            'userId': new_user.id
        }), 201

    except Exception as e:
        app.logger.error(f"Sign-in error: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 500

# Route to handle user login
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data['username']
        password = data['password']

        user = User.query.filter_by(username=username).first()

        # Validate username and password
        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({'message': 'Invalid username or password'}), 401

        # Ensure 'userId' is returned upon successful login
        return jsonify({'message': 'Login successful', 'userId': user.id}), 200

    except Exception as e:
        print(f"Error during login: {e}")
        return jsonify({'error': str(e)}), 500

# Route to fetch user ID
@app.route('/get-user-id', methods=['GET', 'POST'])
def get_user_id():
    if request.method == 'POST':
        # Handle POST request to authenticate the user and return the user ID
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        user = User.query.filter_by(username=username).first()

        if user and check_password_hash(user.password_hash, password):
            return jsonify({'userId': user.id}), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401

    elif request.method == 'GET':
        # Handle GET request to provide information about the endpoint
        return jsonify({'message': 'This endpoint is to check user authentication.'})

# Route to handle feedback
@app.route('/submit-feedback', methods=['POST'])
def submit_feedback():
    try:
        data = request.json
        feedback_text = data.get('feedback')
        stars = data.get('stars')
        user_id = data.get('user_id')

        if not feedback_text or not stars or user_id is None:
            return jsonify({'error': 'Missing feedback text, stars, or user ID'}), 400

        feedback = Feedback(text=feedback_text, stars=stars, user_id=user_id)
        db.session.add(feedback)
        db.session.commit()
        return jsonify({'status': 'success', 'message': 'Feedback saved successfully'})
    except Exception as e:
        app.logger.error(f"Error in submit_feedback: {e}")
        return jsonify({'error': str(e)}), 500

# Route to handle responses from Rasa
@app.route('/get-response', methods=['POST'])
def get_response():
    try:
        data = request.json
        user_message = data.get('message')

        if not user_message:
            return jsonify({'error': 'Message cannot be empty'})

        payload = {"sender": "user", "message": user_message}
        rasa_response = requests.post(RASA_SERVER_URL, json=payload)

        if rasa_response.status_code == 200:
            response_data = rasa_response.json()

            if response_data:
                response_text = response_data[0]['text']
                return jsonify({'message': response_text})
            else:
                return jsonify({'message': 'unhandled', 'user_message': user_message})

        else:
            return jsonify({'error': 'Failed to get a valid response from Rasa server'})

    except Exception as e:
        return jsonify({'error': str(e)})

# Route to handle the messages bot don't understand
@app.route('/save-unhandled-message', methods=['POST'])
def save_unhandled_message():
    data = request.json
    user_message = data['message']
    user_id = data['user_id']  # This should be obtained from a logged-in user session

    unhandled_message = UnhandledMessage(message=user_message, user_id=user_id)
    db.session.add(unhandled_message)
    db.session.commit()

    return jsonify({'status': 'success', 'message': 'Unhandled message saved'})

# Route to save conversation
@app.route('/save-conversation', methods=['POST'])
def save_conversation():
    try:
        data = request.json
        user_id = data.get('user_id')
        messages = data.get('messages')
        session_name = data.get('session_name', 'DefaultSession')

        if not user_id or not messages:
            return jsonify({'error': 'Invalid request data'}), 400

        for message in messages:
            text = message.get('text')
            is_bot = message.get('is_bot', False)


            if not text:
                continue  # Skip empty messages

            # Check if a session with the given session_name exists for the user
            session = Session.query.filter_by(user_id=user_id, session_name=session_name).first()

            if not session:
                # Create a new session if it doesn't exist
                session = Session(user_id=user_id, session_name=session_name)
                db.session.add(session)
                db.session.commit()  # Commit the session immediately

            # Save each message to the database with its own session
            conversation = Conversation(user_id=user_id, message=text, is_bot=is_bot, session=session)
            db.session.add(conversation)

        db.session.commit()  # Commit all conversations after all messages are processed

        return jsonify({'status': 'success', 'message': 'Messages saved successfully'})
    except Exception as e:
        app.logger.error(f"Error saving conversation: {e}")
        return jsonify({'error': 'Failed to save messages'}), 500

# Route to fetch conversation history
@app.route('/get-conversation-history', methods=['GET'])
def get_conversation_history():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'status': 'error', 'error': 'User ID not provided'})

    try:
        # Query the Conversation model to fetch conversation history for the user
        conversations = Conversation.query.filter_by(user_id=user_id).all()
        history = [conv.message for conv in conversations]

        # Query the Session model to fetch user's sessions
        sessions = Session.query.filter_by(user_id=user_id).all()
        session_data = []

        for session in sessions:
            session_messages = []
            for conv in session.conversations:
                session_messages.append({
                    'message': conv.message,
                    'is_bot': conv.is_bot
                })

            session_info = {
                'name': session.session_name,
                'messages': session_messages
            }
            session_data.append(session_info)

        return jsonify({'status': 'success', 'history': history, 'sessions': session_data})
    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)})


# Route to handle deletion of session
@app.route('/delete-session', methods=['DELETE'])
def delete_session():
    try:
        user_id = request.args.get('userId')
        session_name = request.args.get('sessionName')
        user_id = int(user_id) if user_id else None

        if user_id is None or session_name is None:
            return jsonify({'status': 'error', 'message': 'User ID and sessionName are required'}), 400

        session = Session.query.filter_by(session_name=session_name, user_id=user_id).first()

        if session:
            # Delete dependent Conversation records
            Conversation.query.filter_by(session_id=session.id).delete()

            # Delete the session
            db.session.delete(session)
            db.session.commit()
            return jsonify({'status': 'success', 'message': 'Session deleted successfully'})
        else:
            return jsonify({'status': 'error', 'message': 'Session not found'}), 404

    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500


# Route to rename session
@app.route('/rename-session', methods=['PUT'])
def rename_session():
    try:
        user_id = request.json.get('userId')
        old_session_name = request.json.get('oldSessionName')
        new_session_name = request.json.get('newSessionName')

        # Validation
        if not all([user_id, old_session_name, new_session_name]):
            return jsonify({'status': 'error', 'message': 'Missing data'}), 400

        # Query the session to be renamed
        session = Session.query.filter_by(user_id=user_id, session_name=old_session_name).first()
        if session:
            # Rename the session
            session.session_name = new_session_name
            db.session.commit()
            return jsonify({'status': 'success', 'message': 'Session renamed successfully'})
        else:
            return jsonify({'status': 'error', 'message': 'Session not found'}), 404

    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500


spell = SpellChecker()
# Corrects the misspelled words in the sentence
def correct_spelling(text):
    corrected_text = []
    misspelled_words = spell.unknown(text.split())
    for word in text.split():
        if word in misspelled_words:
            corrected_text.append(spell.correction(word))
        else:
            corrected_text.append(word)
    return " ".join(corrected_text)



if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
