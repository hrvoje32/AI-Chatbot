const mockAxios = jest.createMockFromModule('axios');

// Mock any other methods you use like get, delete, etc.
mockAxios.post = jest.fn(() => Promise.resolve({ data: {} }));

export default mockAxios;