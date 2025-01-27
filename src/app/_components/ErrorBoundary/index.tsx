'use client';
import React, { Component, ReactNode } from 'react';
import { useModal } from '@/app/_contexts/modalContext';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('Error:', error.message);

    const formattedStack = info.componentStack
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .join('\n');

    console.error('Error Component Stack:\n', formattedStack);
  }

  render() {
    if (this.state.hasError) {
      return <ShowModalOnError />;
    }

    return this.props.children;
  }
}

const ShowModalOnError = () => {
  const { openModal } = useModal();

  React.useEffect(() => {
    openModal('somethingWentWrong');
  }, [openModal]);

  return null;
};

export default ErrorBoundary;
