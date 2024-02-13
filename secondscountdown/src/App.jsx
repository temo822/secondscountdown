import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const intervalRef = useRef();

  useEffect(() => {
    document.title = `⏰ Timer - ${seconds > 0 ? `${seconds}s left` : 'Time is up!'}`;
  }, [seconds]);

  const startTimer = () => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds - 1);
    }, 1000);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setSeconds(0);
  };

  const enableNotifications = () => {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        setNotificationEnabled(true);
      }
    });
  };

  useEffect(() => {
    if (seconds === 0 && notificationEnabled) {
      new Notification('Time is up!');
    }
  }, [seconds, notificationEnabled]);

  return (
    <>
      <div>
        <input
          type="number"
          placeholder="Enter seconds"
          value={seconds}
          onChange={(e) => setSeconds(parseInt(e.target.value))}
          disabled={isRunning}
        />
        {!isRunning && (
          <button onClick={startTimer}>Start</button>
        )}
        {isRunning && (
          <button onClick={resetTimer}>Reset</button>
        )}
        {!notificationEnabled && (
          <button onClick={enableNotifications}>Enable notifications</button>
        )}
      </div>
    </>
  );
}

export default App;
