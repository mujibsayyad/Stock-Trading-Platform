import { useState, useEffect, FC } from 'react';

const LiveTime: FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newTime = new Date();
      setCurrentTime(newTime);
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Get the time without AM/PM
  const formattedTime = currentTime
    .toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
    .slice(0, -2);

  // Extract the AM/PM part
  const amPm = currentTime
    .toLocaleTimeString('en-US', {
      hour12: true,
    })
    .slice(-2);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div
        style={{ width: '5rem', letterSpacing: '0.5px' }}
        suppressHydrationWarning
      >
        {formattedTime}
      </div>
      <div>{amPm}</div>
    </div>
  );
};

export default LiveTime;
