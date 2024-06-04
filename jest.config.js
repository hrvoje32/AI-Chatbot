module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@react-native-community|@react-native-picker)/)',
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect', '<rootDir>/jest.setup.js'],
};
