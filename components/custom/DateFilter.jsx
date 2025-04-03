import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function DateFilter() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showDropdown, setShowDropdown] = useState(false);
  const [isCustom, setIsCustom] = useState(false); // Tracks if "Custom" is selected

  // Predefined range handlers
  const setToday = () => {
    const today = new Date();
    setStartDate(today);
    setEndDate(today);
    setIsCustom(false);
  };

  const setThisWeek = () => {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    setStartDate(lastWeek);
    setEndDate(today);
    setIsCustom(false);
  };

  const setThisMonth = () => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setDate(today.getDate() - 30);
    setStartDate(lastMonth);
    setEndDate(today);
    setIsCustom(false);
  };

  const setAllTime = () => {
    const today = new Date();
    const janFirst2023 = new Date('2023-01-01');
    setStartDate(janFirst2023);
    setEndDate(today);
    setIsCustom(false);
  };

  const enableCustom = () => {
    setIsCustom(true);
    setShowDropdown(false);
  };

  return (
    <div style={{ position: 'relative', maxWidth: '300px' }}>
      <button onClick={() => setShowDropdown(!showDropdown)}>
        Select Date Range
      </button>

      {showDropdown && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            background: '#fff',
            border: '1px solid #ddd',
            listStyle: 'none',
            padding: '0.5rem',
            margin: 0,
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 10,
          }}
        >
          <li
            style={{ cursor: 'pointer', padding: '0.25rem 0.5rem' }}
            onClick={() => {
              setToday();
              setShowDropdown(false);
            }}
          >
            Today
          </li>
          <li
            style={{ cursor: 'pointer', padding: '0.25rem 0.5rem' }}
            onClick={() => {
              setThisWeek();
              setShowDropdown(false);
            }}
          >
            This Week
          </li>
          <li
            style={{ cursor: 'pointer', padding: '0.25rem 0.5rem' }}
            onClick={() => {
              setThisMonth();
              setShowDropdown(false);
            }}
          >
            This Month
          </li>
          <li
            style={{ cursor: 'pointer', padding: '0.25rem 0.5rem' }}
            onClick={() => {
              setAllTime();
              setShowDropdown(false);
            }}
          >
            All Time
          </li>
          <li
            style={{
              cursor: 'pointer',
              padding: '0.25rem 0.5rem',
              fontWeight: 'bold',
              color: 'blue',
            }}
            onClick={() => enableCustom()}
          >
            Custom
          </li>
        </ul>
      )}

      {/* Custom Date Pickers */}
      {isCustom && (
        <div style={{ marginTop: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Custom Start Date:
          </label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="MM/dd/yyyy"
          />

          <label
            style={{ display: 'block', marginTop: '1rem', marginBottom: '0.5rem' }}
          >
            Custom End Date:
          </label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="MM/dd/yyyy"
          />
        </div>
      )}
    </div>
  );
}

export default DateFilter;
