import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { DateRange } from '@mui/x-date-pickers-pro/models';

const shortcutsItems = [
  {
    label: 'This Week',
    getValue: () => {
      const today = dayjs();
      return [today.startOf('week'), today.endOf('week')];
    },
  },
  {
    label: 'Last Week',
    getValue: () => {
      const today = dayjs();
      const prevWeek = today.subtract(7, 'day');
      return [prevWeek.startOf('week'), prevWeek.endOf('week')];
    },
  },
  {
    label: 'Last 7 Days',
    getValue: () => {
      const today = dayjs();
      return [today.subtract(7, 'day'), today];
    },
  },
  {
    label: 'Current Month',
    getValue: () => {
      const today = dayjs();
      return [today.startOf('month'), today.endOf('month')];
    },
  },
  {
    label: 'Next Month',
    getValue: () => {
      const today = dayjs();
      const startOfNextMonth = today.endOf('month').add(1, 'day');
      return [startOfNextMonth, startOfNextMonth.endOf('month')];
    },
  },
  { label: 'Reset', getValue: () => [null, null] },
];

export default function advancedDatePick({selectedDateRange, setSelectedDateRange}) {

    const handleDateChange = (newValue) => {
        setSelectedDateRange(newValue);
      };
  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <StaticDateRangePicker
          value={selectedDateRange}
          onChange={handleDateChange}
          slotProps={{
            shortcuts: {
              items: shortcutsItems,
            },
            actionBar: { actions: [] },
          }}
          calendars={2}
        />
      </LocalizationProvider>
      <div style={{ marginTop: '20px' }}>
        <h3>Selected Date Range:</h3>
        <p>Start: {selectedDateRange[0]?.format('YYYY-MM-DD') || 'None'}</p>
        <p>End: {selectedDateRange[1]?.format('YYYY-MM-DD') || 'None'}</p>
      </div>
    </div>
  );
}
