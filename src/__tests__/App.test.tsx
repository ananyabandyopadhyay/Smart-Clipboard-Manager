import { describe, it, expect, test } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

test('demj', () => {
  expect(true).toBe(true);
});

describe('render', () => {
  it('renders the mmnbe', () => {
    render(
      <MemoryRouter>
        {' '}
        <App />
      </MemoryRouter>
    );
    expect(true).toBeTruthy();
  });
});
