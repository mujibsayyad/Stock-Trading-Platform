import { useState, useEffect, useRef, FC } from 'react';

interface LiveTimeProps {
  onMarketStatus: (status: string) => void;
}

const LiveTime: FC<LiveTimeProps> = ({ onMarketStatus }) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const previousMarketStatus = useRef<string | null>(null);

  const checkMarketStatus: any = (date: Date) => {
    const marketCloseHour = 15; // 3pm IST
    const marketCloseMinutes = 30; // 30 minutes

    if (
      date.getHours() > marketCloseHour ||
      (date.getHours() === marketCloseHour &&
        date.getMinutes() >= marketCloseMinutes)
    ) {
      return 'closed';
    }
    return 'open';
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newTime = new Date();
      setCurrentTime(newTime);

      const status = checkMarketStatus(newTime);

      // Check if the status has changed
      if (previousMarketStatus.current !== status) {
        onMarketStatus(status);
        // Update the previous status ref
        previousMarketStatus.current = status;
      }
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => {
      clearInterval(intervalId);
    };
  }, [onMarketStatus]);

  // Get the 12hr time

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
      <div style={{ width: '5rem', letterSpacing: '0.5px' }}>
        {formattedTime}
      </div>
      <div>{amPm}</div>
    </div>
  );
};

export default LiveTime;
