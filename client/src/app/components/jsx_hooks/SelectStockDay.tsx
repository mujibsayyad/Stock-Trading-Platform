import { useState, FC, MouseEvent } from 'react';
import { Grid, Typography } from '@mui/material';

const DAY_OPTIONS = ['7 D', '10 D', '15 D', '20 D', '30 D'];

const typographyStyles = {
  background: 'rgba( 255, 255, 255, 0.08 )',
  border: '1px solid rgba( 255, 255, 255, 0.10 )',
  borderRadius: '1rem',
  textAlign: 'left',
  fontWeight: 600,
  p: 1,
  px: 2,
  mx: 1,
  cursor: 'pointer',
  '&:hover': {
    background: 'rgba(144, 202, 249, 0.15)',
  },
};

interface stockDaysProps {
  onDaySelect: (day: string) => void;
}

const SelectStockDay: FC<stockDaysProps> = ({ onDaySelect }) => {
  const [selectedDayStock, setSelectedDayStock] = useState<string>(
    DAY_OPTIONS[0]
  );

  const handleStockSelectDays = (event: MouseEvent<HTMLDivElement>) => {
    const selected = event.currentTarget.innerText.trim();
    setSelectedDayStock(selected);
    onDaySelect(selected);
  };

  return (
    <Grid
      item
      sm={12}
      xs={12}
      sx={{
        backgroundColor: 'rgb(21, 25, 36, 0.8)',
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: {
          xs: 'center',
          sm: 'flex-start',
        },
        mt: {
          xs: 2,
          sm: 1,
        },
        p: 1.5,
        order: {
          xs: 1,
          sm: 2,
        },
      }}
    >
      <Typography variant='body2' sx={typographyStyles}>
        Showing Last {selectedDayStock.slice(0, -1)} Days Data
      </Typography>

      {DAY_OPTIONS.map((day) => (
        <Typography
          key={day}
          variant='body2'
          sx={typographyStyles}
          onClick={handleStockSelectDays}
        >
          {day}
        </Typography>
      ))}
    </Grid>
  );
};

export default SelectStockDay;
