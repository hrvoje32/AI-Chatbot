jest.mock('react-native-gesture-handler', () => {});
jest.mock('@react-navigation/native', () => ({
  // Mock other navigation functions as necessary
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));
