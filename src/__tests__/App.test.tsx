import { describe, it, expect, test } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // ✅ Import MemoryRouter
import App from '../App';

test('demo', () => {
  expect(true).toBe(true);
});

describe('render', () => {
  it('renders the main page', () => {
    render(
      <MemoryRouter>
        {' '}
        {/* ✅ Wrap App inside MemoryRouter */}
        <App />
      </MemoryRouter>
    );
    expect(true).toBeTruthy();
  });
});
