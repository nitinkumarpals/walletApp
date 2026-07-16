import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BalanceCard } from '../BalanceCard';

describe('BalanceCard', () => {
  it('renders available balance correctly', () => {
    // 500000 paise = 5000 INR
    render(<BalanceCard amount={500000} locked={0} />);
    
    expect(screen.getByText('available')).toBeInTheDocument();
    
    // Check if 5000 or 5,000 is present
    const amountElements = screen.getAllByText(/5,000/);
    expect(amountElements.length).toBeGreaterThan(0);
  });

  it('renders locked and total balance correctly', () => {
    // amount = 5000 INR, locked = 2000 INR
    render(<BalanceCard amount={500000} locked={200000} />);
    
    expect(screen.getByText('on hold')).toBeInTheDocument();
    expect(screen.getByText('total balance')).toBeInTheDocument();

    const lockedElements = screen.getAllByText(/2,000/);
    expect(lockedElements.length).toBeGreaterThan(0);

    const totalElements = screen.getAllByText(/7,000/);
    expect(totalElements.length).toBeGreaterThan(0);
  });
});
