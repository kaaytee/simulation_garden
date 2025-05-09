import { useState, useCallback } from 'react';

export function useSimulation() {
  const [option, setOption] = useState('classic/conway');
  const [isRunning, setIsRunning] = useState(false);
  const [tickRate, setTickRate] = useState(1);
  const [resetKey, setResetKey] = useState(0);
  const [toasts, setToasts] = useState([]);

  const handleOptionChange = useCallback((newOption) => {
    setOption(newOption);
    setIsRunning(false);
    setResetKey(prev => prev + 1);
  }, []);

  const handleStartStop = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setResetKey(prev => prev + 1);
    setIsRunning(false);
  }, []);

  const handleTickRateChange = useCallback((e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setTickRate(value);
    }
  }, []);

  const handleSpeedAdjustment = useCallback((adjustment) => {
    setTickRate(prev => Math.max(1, prev + adjustment));
  }, []);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return {
    option,
    isRunning,
    tickRate,
    resetKey,
    toasts,
    addToast,
    removeToast,
    handleOptionChange,
    handleStartStop,
    handleReset,
    handleTickRateChange,
    handleSpeedAdjustment
  };
} 