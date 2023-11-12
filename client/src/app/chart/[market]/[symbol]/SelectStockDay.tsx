import { useState, FC, MouseEvent } from 'react';
import { Grid, Box, Typography } from '@mui/material';

const DAY_OPTIONS = ['7 D', '10 D', '20 D', '30 D'];

const typographyStyles = {
  background: 'rgba( 255, 255, 255, 0.08 )',
  border: '1px solid rgba( 255, 255, 255, 0.10 )',
  borderRadius: '1rem',
  textAlign: 'center',
  fontWeight: 600,
  p: 1,
  px: 2,
  mx: 1,
  cursor: 'pointer',
  '&:hover': {
    background: 'rgba(144, 202, 249, 0.15)',
  },
};

const getTypographyStyles = (isSelected: boolean, isDisabled: boolean) => ({
  ...typographyStyles,
  background: isSelected
    ? 'rgba( 255, 255, 255, 0.20 )'
    : typographyStyles.background,
  cursor: isDisabled ? 'not-allowed' : 'pointer',
  opacity: isDisabled ? 0.5 : 1,
});

interface stockDaysProps {
  onDaySelect: (day: string) => void;
  onHighlighted: (bool: boolean) => void;
  marketStatus: string;
  dataType: string;
}
//* ************************ ************************ *//
const SelectStockDay: FC<stockDaysProps> = ({
  onDaySelect,
  onHighlighted,
  marketStatus,
  dataType,
}) => {
  const [selectedDayStock, setSelectedDayStock] = useState<string>(
    dataType === 'historical' ? DAY_OPTIONS[0] : ''
  );

  const handleStockSelectDays = (event: MouseEvent<HTMLDivElement>) => {
    const selected = event.currentTarget.innerText.trim();
    setSelectedDayStock(selected);
    onDaySelect(selected);
    onHighlighted(true);
  };

  return (
    <Grid
      item
      sm={12}
      xs={12}
      sx={{
        backgroundColor: 'rgb(21, 25, 36, 0.8)',
        border: '1px solid rgba( 255, 255, 255, 0.10 )',
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: {
          xs: 'center',
          sm: 'flex-start',
        },
        flexDirection: {
          xs: 'column-reverse',
          sm: 'row',
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
      <Box
        sx={{
          width: {
            xs: '90%',
            sm: '18%',
          },
          mt: {
            xs: 1,
            sm: 0,
          },
        }}
      >
        <Typography variant='body2' sx={typographyStyles}>
          {marketStatus === 'open' || dataType !== 'historical'
            ? 'Showing Intraday Data'
            : `Showing Last ${selectedDayStock.slice(0, -1)} Days Data`}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex' }}>
        {DAY_OPTIONS.map((day) => (
          <Typography
            key={day}
            variant='body2'
            sx={getTypographyStyles(
              day === selectedDayStock,
              marketStatus !== 'closed'
            )}
            onClick={
              marketStatus === 'closed' ? handleStockSelectDays : undefined
            }
          >
            {day}
          </Typography>
        ))}
      </Box>
    </Grid>
  );
};

export default SelectStockDay;
