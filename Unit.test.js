//Unit.test.js
import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import MockNavigator from './navigation/MockNavigator';
import App from './app';
import axios from 'axios';

jest.mock('axios');
global.alert = jest.fn();
// Clear all mocks before each test
beforeEach(() => {
  axios.post.mockClear();
  jest.useFakeTimers(); // Use fake timers to control setTimeout
});
//----------------------------------------------------------------------------------------\\
test('app component renders correctly', () => {
  render(<App />);
});
//----------------------------------------------------------------------------------------\\
describe('Registration Form', () => {
  it('allows Users registration', async () => {
    const {getByText, findByPlaceholderText} = render(
      <MockNavigator initialRouteName="Home" />,
    );

    fireEvent.press(getByText('Enter Chatbot'));
    fireEvent.press(getByText('Sign Up'));

    // Fill out and submit the registration form
    const nicknameInput = await findByPlaceholderText('Nickname');
    fireEvent.changeText(nicknameInput, 'newUser');
    const passwordInput = await findByPlaceholderText('Password');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(getByText('Sign Up'));

    await waitFor(() =>
      expect(global.alert).toHaveBeenCalledWith(
        expect.stringContaining('Registration failed'),
      ),
    );
  });
});
//----------------------------------------------------------------------------------------\\
describe('Login Form', () => {
  it('allows user login', async () => {
    axios.post.mockResolvedValueOnce({
      data: {message: 'Login successful', userId: '1'},
    });
    const {getByText, findByPlaceholderText} = render(
      <MockNavigator initialRouteName="Home" />,
    );

    fireEvent.press(getByText('Enter Chatbot'));
    fireEvent.press(getByText('Log In'));

    // Fill out and submit the Login form
    const nicknameInput = await findByPlaceholderText('Nickname');
    fireEvent.changeText(nicknameInput, 'Hrvoje');
    const passwordInput = await findByPlaceholderText('Password');
    fireEvent.changeText(passwordInput, 'aaaa');
    fireEvent.press(getByText('Log In'));
  });
});
//----------------------------------------------------------------------------------------\\
describe('Chat Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the login response to simulate a successful login
    axios.post.mockResolvedValue({
      data: {message: 'Login successful', userId: '1'},
    });
  });

  it('allows the user to start a new chat and conversation after logging in', async () => {
    const {getByText, findByText, findByPlaceholderText} = render(
      <MockNavigator initialRouteName="Home" />,
    );

    // Navigate to the chatbot entry point and press "Enter Chatbot"
    fireEvent.press(getByText('Enter Chatbot'));

    // Proceed to the login screen and log in
    fireEvent.press(await findByText('Log In'));
    const nicknameInput = await findByPlaceholderText('Nickname');
    const passwordInput = await findByPlaceholderText('Password');
    fireEvent.changeText(nicknameInput, 'Hrvoje');
    fireEvent.changeText(passwordInput, 'aaaa');
    fireEvent.press(await findByText('Log In'));

    // After logging in, wait for the "New Chat" button to become available.
    const newChatButton = await waitFor(() => findByText('New Chat'), {
      timeout: 2000,
    });
    expect(newChatButton).toBeTruthy();

    // Interact with the "New Chat" button
    fireEvent.press(newChatButton);

    // Type Message in the chat
    const messageInput = await findByPlaceholderText('Type your message...');
    fireEvent.changeText(messageInput, 'Hello');

    // Interact with the "Send" button
    fireEvent.press(getByText('Send'));
  });
});
//----------------------------------------------------------------------------------------\\
describe('Feedback Submission', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the login response to simulate a successful login
    axios.post.mockResolvedValue({
      data: {message: 'Login successful', userId: '1'},
    });
  });

  it('allows the user to submit and close Feedback compmonent', async () => {
    const {getByText, findByText, findByPlaceholderText} = render(
      <MockNavigator initialRouteName="Home" />,
    );

    // Navigate to the chatbot entry point and press "Enter Chatbot"
    fireEvent.press(getByText('Enter Chatbot'));

    // Proceed to the login screen and log in
    fireEvent.press(await findByText('Log In'));
    const nicknameInput = await findByPlaceholderText('Nickname');
    const passwordInput = await findByPlaceholderText('Password');
    fireEvent.changeText(nicknameInput, 'Hrvoje');
    fireEvent.changeText(passwordInput, 'aaaa');
    fireEvent.press(await findByText('Log In'));

    // After logging in, wait for the "Give Feedback" button to become available.
    const newFeedbackButton = await waitFor(() => findByText('Give Feedback'), {
      timeout: 2000,
    });
    expect(newFeedbackButton).toBeTruthy();

    // Interact with the "Give Feedback Modul" button
    fireEvent.press(newFeedbackButton);

    // Type Message in the Feedback Modul
    const messageInputFeedback = await findByPlaceholderText('Your feedback');
    fireEvent.changeText(messageInputFeedback, 'Great Feedback');

    // Submit Feedback Modul
    fireEvent.press(getByText('Submit'));

    // Open the "Give Feedback Modul" again
    fireEvent.press(newFeedbackButton);

    // Close Feedback Modul
    fireEvent.press(getByText('Close'));
  });
});
//----------------------------------------------------------------------------------------\\
describe('Show History Sidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the login response to simulate a successful login
    axios.post.mockResolvedValue({
      data: {message: 'Login successful', userId: '1'},
    });
  });

  it('allows user to interact with history sidebar, close, and save history', async () => {
    const {getByText, findByText, findByPlaceholderText} = render(
      <MockNavigator initialRouteName="Home" />,
    );

    // Navigate to the chatbot entry point and press "Enter Chatbot"
    fireEvent.press(getByText('Enter Chatbot'));

    // Proceed to the login screen and log in
    fireEvent.press(await findByText('Log In'));
    const nicknameInput = await findByPlaceholderText('Nickname');
    const passwordInput = await findByPlaceholderText('Password');
    fireEvent.changeText(nicknameInput, 'Hrvoje');
    fireEvent.changeText(passwordInput, 'aaaa');
    fireEvent.press(await findByText('Log In'));

    // After logging in, interact with the "Show History" button
    const showHistoryButton = await waitFor(() => findByText('Show History'), {
      timeout: 2000,
    });

    // Open the history sidebar and interact with the "Save History" button
    fireEvent.press(showHistoryButton);
    const sessionName = await findByPlaceholderText('Session Name');
    fireEvent.changeText(sessionName, 'My session');
    fireEvent.press(getByText('Save History'));

    // Reopen the history sidebar and interact with the "Close History" button
    fireEvent.press(showHistoryButton);

    // Close the history sidebar
    const closeButton = await findByText('Close History');
    fireEvent.press(closeButton);
  });
});
//----------------------------------------------------------------------------------------\\
describe('Chat Functionality menu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the login response to simulate a successful login
    axios.post.mockResolvedValue({
      data: {message: 'Login successful', userId: '1'},
    });
  });

  it('allows the scroll through main menu', async () => {
    const {getByText, findByText, findByPlaceholderText} = render(
      <MockNavigator initialRouteName="Home" />,
    );

    // Navigate to the chatbot entry point and press "Enter Chatbot"
    fireEvent.press(getByText('Enter Chatbot'));

    // Proceed to the login screen and log in
    fireEvent.press(await findByText('Log In'));
    const nicknameInput = await findByPlaceholderText('Nickname');
    const passwordInput = await findByPlaceholderText('Password');
    fireEvent.changeText(nicknameInput, 'Hrvoje');
    fireEvent.changeText(passwordInput, 'aaaa');
    fireEvent.press(await findByText('Log In'));

    // After logging in, wait for the "New Chat" button to become available.
    const newChatButton = await waitFor(() => findByText('New Chat'), {
      timeout: 2000,
    });
    expect(newChatButton).toBeTruthy();

    // Interact with the "New Chat" button
    fireEvent.press(newChatButton);

    // Interact with the "Show History" button
    const newHistoryButton = await waitFor(() => findByText('New Chat'), {
      timeout: 2000,
    });
    expect(newHistoryButton).toBeTruthy();
    fireEvent.press(newHistoryButton);

    // Interact with the "New Chat" button
    fireEvent.press(newChatButton);

    // Interact with the "Give Feedback" button
    const newFeedbackButton = await waitFor(() => findByText('Give Feedback'), {
      timeout: 2000,
    });
    expect(newFeedbackButton).toBeTruthy();
    fireEvent.press(newFeedbackButton);

    // Interact with the "New Chat" button
    fireEvent.press(newChatButton);
  });
});
