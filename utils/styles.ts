//styles.ts
// Import styling and layout calculations
import {StyleSheet, Dimensions} from 'react-native';

// Retrieve the screen dimensions to use in style calculations
const {width, height} = Dimensions.get('window');

export const styles = StyleSheet.create({
  // Basic application container styles
  app: {
    fontFamily: 'Arial, sans-serif',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  // Styles for text elements with white color and bold weight
  whiteColour: {
    color: 'white',
    fontWeight: '700',
  },

  // Text styles for messages from the user
  userMessageText: {
    color: 'white',
  },

  // Text styles for messages from the bot
  botMessageText: {
    color: 'black',
    padding: 1,
  },

  // Container styles for authentication screens
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    marginTop: -50,
  },

  // Input field styles for sign in and sign up screens
  inputSign: {
    width: 300,
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },

  // Button styles for authentication actions
  authButton: {
    backgroundColor: '#2F3E6C',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: 300,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  // Container for storing messages history
  historyMessagesContainer: {
    flex: 1,
  },

  // Styles for the main content area, typically used by screens showing chat or other main interaction areas
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: width * 1,
  },

  // Background image styles, used on the home screen
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Welcome text styles for the app's home screen
  welcomeText: {
    textAlign: 'center',
    top: 80,
    marginBottom: 'auto',
    fontWeight: '600',
    fontSize: 16,
  },

  // Title styles
  welcomeTitle: {
    textAlign: 'center',
    top: -80,
    marginBottom: 'auto',
    fontWeight: '700',
    fontSize: 26,
  },

  // Back button style
  backButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: 300,
    alignItems: 'center',
  },

  // Style for the button leading to the chatbot
  chatbotButton: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    backgroundColor: '#2F3E6C',
    borderRadius: 5,
    bottom: 50,
  },

  // Main chat window container style
  chatWindow: {
    width: width * 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    flexDirection: 'column',
    flex: 1,
  },

  // Container for chat messages
  chatMessages: {
    flex: 1,
    paddingLeft: 2,
    backgroundColor: 'white',
    marginBottom: 'auto',
  },

  // Individual chat message style
  chatMessage: {
    marginBottom: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },

  // Header style for sidebars
  sidebarHeader: {
    paddingBottom: 10,
    paddingTop: 10,
    bottom: 5,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    backgroundColor: '#2C3E50',
    color: 'white',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 10,
  },

  // Container for history navigation
  historyButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: width * 0.08,
  },

  // Style for user messages within chat interfaces
  userMessage: {
    backgroundColor: '#2F3E6C',
    alignSelf: 'flex-end',
    borderRadius: 5,
    padding: 8,
    margin: 10,
    borderBottomRightRadius: 0,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: -8,
      height: 2,
    },
    elevation: 10,
  },

  // Style for bot messages within chat interfaces
  botMessage: {
    backgroundColor: '#ECECEC',
    alignSelf: 'flex-start',
    borderRadius: 5,
    padding: 8,
    margin: 10,
    borderBottomLeftRadius: 0,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 8,
      height: 2,
    },
    elevation: 10,
  },

  // Basic container style
  container: {
    display: 'flex',
  },

  // Controls for chat input and actions
  chatControls: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },

  // Standard text input style
  input: {
    flex: 1,
    padding: 10,
    borderColor: '#ccc',
    marginBottom: 35,
    borderWidth: 1,
    borderRadius: 5,
    color: 'black',
    backgroundColor: 'white',
  },

  // Text input for session naming
  inputSession: {
    flex: 1,
    padding: 10,
    borderColor: '#ccc',
    marginBottom: 20,
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 5,
    color: 'black',
    backgroundColor: 'white',
    marginVertical: 10,
  },

  // Text input for history
  inputHistory: {
    padding: 10,
    borderColor: '#ccc',
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 5,
    color: 'black',
    backgroundColor: 'white',
  },

  // Text input used in modal dialogs
  modalInput: {
    paddingTop: 0,
    paddingBottom: 20,
  },

  // Decorative line style used between elements in navigation
  line: {
    color: '#2F3E6C',
    fontWeight: '500',
    top: 8,
    fontSize: 24,
  },

  // General button styles
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderRadius: 5,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Button style used specifically in alert modals
  buttonAlertModal: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },

  // Text style for error messages within modals
  buttonTextError: {
    color: 'red',
    fontSize: 20,
  },

  // General text style for buttons
  buttonText: {
    color: 'green',
    fontSize: 20,
  },

  // Color style for menu buttons
  menuButtonsColour: {
    color: '#2F3E6C',
    fontWeight: '700',
  },

  // Style for pressed buttons
  pressedButton: {
    transform: [{scale: 0.98}],
    elevation: 4,
    shadowOpacity: 0.5,
  },

  // Text style for pressed button labels
  pressedText: {
    color: '#2F3E6C',
  },

  // Style for the header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 5,
    backgroundColor: 'white',
    width: width * 1,
    borderRadius: 5,
  },

  // Style for profile
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Text style for session save confirmation messages
  saveSessionMessage: {
    color: 'green',
    fontSize: 16,
    padding: 10,
    textAlign: 'center',
  },

  // Style for the sidebar
  sidebar: {
    position: 'absolute',
    right: 0,
    top: 50,
    bottom: '0%',
    width: width * 1,
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderLeftWidth: 1,
    padding: 10,
    height: '90%',
    flex: 1,
  },

  // Exit button style
  exitButton: {
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#1ABC9C',
    borderRadius: 5,
    width: width * 0.45,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  // Close button style
  closeButton: {
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#CCCCCC',
    borderRadius: 5,
    width: width * 0.45,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  // Style for the content area in session lists
  sessionsContent: {
    paddingBottom: 10,
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
  },

  // Header style for sessions list
  sessionsHeader: {
    paddingTop: height * 0.02,
    paddingBottom: height * 0.02,
    marginBottom: height * 0.05,
    marginTop: height * 0.05,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    backgroundColor: '#2C3E50',
    color: 'white',
  },

  // Style for section in new chat initiation
  newChatSection: {
    marginBottom: 10,
  },

  // Button style for sending messages
  sendButton: {
    backgroundColor: '#2F3E6C',
    alignContent: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    borderRadius: 5,
    marginLeft: 4,
    marginBottom: 35,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  // Style for the session item in a list
  sessionStyle: {
    marginBottom: height * 0.02,
    marginTop: height * 0.02,
    width: width * 0.9,
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderBottomWidth: 1,
  },

  // Style for session
  session: {
    alignContent: 'center',
    paddingBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    borderColor: 'black',
    borderWidth: 1,
    width: width * 0.8,
    alignSelf: 'center',
    marginVertical: 5,
    paddingTop: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
  },

  // Modal view style
  modalView: {
    top: 160,
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.85,
    shadowRadius: 5,
    elevation: 10,
  },

  // Modal view style for alerts
  modalViewAlert: {
    top: 250,
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.85,
    shadowRadius: 5,
    elevation: 10,
  },

  // Style for text within modals
  modalText: {
    padding: width * 0.04,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
  },

  // Input field for feedback text
  feedbackInput: {
    width: width * 0.75,
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    textAlignVertical: 'top',
  },

  // Star rating container
  starRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },

  // Button to submit feedback
  submitButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding: 10,
    marginBottom: width * 0.05,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  // Container for grouping buttons
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },

  // Button style for submitting feedback
  submitButtonFeedback: {
    marginRight: 0,
    borderRadius: 5,
    bottom: 10,
    padding: 10,
    width: width * 0.35,
    alignItems: 'center',
    backgroundColor: '#1ABC9C',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  // Button style for closing or cancelling feedback
  submitButtonFeedbackCLose: {
    marginRight: 10,
    borderRadius: 5,
    bottom: 10,
    padding: 10,
    width: width * 0.35,
    alignItems: 'center',
    backgroundColor: '#CCCCCC',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  // Style for renaming buttons in session management
  sessionButtonRename: {
    marginRight: 0,
    borderRadius: 5,
    padding: 5,
    width: width * 0.35,
    alignItems: 'center',
    backgroundColor: '#4472C4',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  // Style for delete buttons in session management
  sessionButtonDelete: {
    marginLeft: 0,
    marginRight: 10,
    borderRadius: 5,
    padding: 5,
    width: width * 0.35,
    alignItems: 'center',
    backgroundColor: '#CCCCCC',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  // Module specific style for renaming sessions
  sessionButtonRenameModul: {
    marginRight: 0,
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    width: width * 0.35,
    alignItems: 'center',
    backgroundColor: '#4472C4',
  },

  // Module specific style for deleting sessions
  sessionButtonDeleteModul: {
    marginLeft: 0,
    marginRight: 10,
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    width: width * 0.35,
    alignItems: 'center',
    backgroundColor: '#CCCCCC',
  },

  // Text color style for buttons labeled in green
  greenColourButton: {
    color: 'white',
    fontWeight: '700',
  },

  // Text color style for buttons or text in grey
  greyColourButton: {
    color: 'black',
    fontWeight: '500',
  },

  // Text color style for alert or error messages in red
  redColourButton: {
    color: 'red',
  },

  // Style for filled star in ratings
  filledStar: {
    fontSize: 30,
    color: 'gold',
  },

  // Style for empty star in ratings
  emptyStar: {
    fontSize: 30,
    color: 'grey',
  },

  // Input style for naming sessions
  sessionNameInput: {
    color: 'black',
  },

  // Text style for displaying session names
  sessionName: {
    color: 'black',
    fontWeight: '600',
    fontSize: 15,
  },
});
