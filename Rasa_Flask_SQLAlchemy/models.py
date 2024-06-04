from flask_sqlalchemy import SQLAlchemy

# Initialise SQLAlchemy to handle database operations
db = SQLAlchemy()


class User(db.Model):
    # Unique identifier for the user
    id = db.Column(db.Integer, primary_key=True)

    # Username must be unique and is not nullable
    username = db.Column(db.String(80), unique=True, nullable=False)

    # Store a hash of the user's password
    password_hash = db.Column(db.String(128))

    # Establish a one-to-many relationship with Conversation
    conversations = db.relationship('Conversation', backref='user', lazy=True)

    # Establish a one-to-many relationship with Feedback
    feedbacks = db.relationship('Feedback', backref='user', lazy=True)

    # Establish a one-to-many relationship with UnhandledMessage
    unhandled_messages = db.relationship('UnhandledMessage', backref='user', lazy=True)


class Conversation(db.Model):
    # Unique identifier for the conversation
    id = db.Column(db.Integer, primary_key=True)

    # Content of the conversation message, cannot be null
    message = db.Column(db.Text, nullable=False)

    # Foreign key to link conversation to a specific user
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    # Flag to indicate if the message is from a bot
    is_bot = db.Column(db.Boolean, default=False)

    # Foreign key to link conversation to a specific session
    session_id = db.Column(db.Integer, db.ForeignKey('session.id'))


class Session(db.Model):
    # Unique identifier for the session
    id = db.Column(db.Integer, primary_key=True)

    # Foreign key to link session to a user, cannot be null
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    # Name of the session, cannot be null
    session_name = db.Column(db.String(255), nullable=False)

    # Reverse relationship to User
    user = db.relationship('User', backref='sessions')

    # Establish a one-to-many relationship with Conversation
    conversations = db.relationship('Conversation', backref='session', lazy=True)


class Feedback(db.Model):
    # Unique identifier for the feedback entry
    id = db.Column(db.Integer, primary_key=True)

    # Content of the feedback, cannot be null
    text = db.Column(db.Text, nullable=False)

    # Rating provided by the user
    stars = db.Column(db.Integer)

    # Foreign key to link feedback to a specific user
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))


class UnhandledMessage(db.Model):
    # Unique identifier for the unhandled message
    id = db.Column(db.Integer, primary_key=True)

    # Content of the unhandled message, cannot be null
    message = db.Column(db.Text, nullable=False)

    # Foreign key to link unhandled message to a specific user
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))







