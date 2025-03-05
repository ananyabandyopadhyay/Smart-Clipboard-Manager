import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import Home from '../pages/Home';

describe('Home Component', () => {
  it('renders the welcome message', () => {
    render(<Home />);
    expect(screen.getByText('Welcome to the Home Page!')).toBeInTheDocument();
  });
});
