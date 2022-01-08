import { render, screen } from '@testing-library/react';
import App from './App';

const React = require('react');

test('renders correct text', () => {
  render(<App />);
  const linkElement = screen.getByText(/Basic create-react-app setup./i);
  expect(linkElement).toBeInTheDocument();
});
