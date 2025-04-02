// This file is used to setup Jest with global settings
// Currently empty, but can be used to add global mocks, setup utilities, etc.

// Import jest-dom para extender matchers de Jest
require('@testing-library/jest-dom');

// Mock para matchMedia (no disponible en JSDOM)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
