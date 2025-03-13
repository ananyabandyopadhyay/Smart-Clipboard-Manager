import '@testing-library/jest-dom/vitest';
// Mock global objects if needed
import { expect } from 'vitest';

// Set up any necessary global configuration for your tests
(globalThis as any).expect = expect;
