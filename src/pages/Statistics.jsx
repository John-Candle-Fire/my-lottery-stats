import React, { useState } from 'react';
import Ball from '../components/Ball';
import lotteryResults from '../data/Mark6-Results.json';
import numberColors from '../data/lotteryNumbers.json';

const Statistics = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [pastDraws, setPastDraws] = useState('');
  const [statistics, setStatistics] = useState([]);

  // Function to filter results and calculate statistics
  const filterAndCalculateStatistics = () => {
    let filteredResults = lotteryResults;

    // If both From/To Date and Number of Draws are provided, clear From/To Dates and use Number of Draws
    if (fromDate && toDate && pastDraws) {
      setFromDate('');
      setToDate('');
      filteredResults = filteredResults.slice(0, parseInt(pastDraws, 10));
    } else {
      // Filter by date range
      if (fromDate && toDate) {
        filteredResults = filteredResults.filter((result) =>
          new Date(result.draw_date.split('/').reverse().join('-')) >= new Date(fromDate) &&
          new Date(result.draw_date.split('/').reverse().join('-')) <= new Date(toDate)
        );
      }

      // Filter by number of draws
      if (pastDraws) {
        filteredResults = filteredResults.slice(0, parseInt(pastDraws, 10));
      }
    }

    // Initialize statistics for all numbers
    const stats = Array.from({ length: 49 }, (_, i) => ({
      number: i + 1,
      count: 0,
      latestDate: ''
    }));

    // Count occurrences and update the latest draw date for each number
    filteredResults.forEach((result) => {
      [...result.numbers, result.special_number].forEach((num) => {
        const stat = stats.find((stat) => stat.number === num);
        stat.count += 1;
        stat.latestDate = result.draw_date; // Update to the most recent draw date
      });
    });

    // Sort statistics by count in descending order
    stats.sort((a, b) => b.count - a.count);

    setStatistics(stats);
  };

  // Function to reset all inputs and statistics
  const resetFilters = () => {
    setFromDate('');
    setToDate('');
    setPastDraws('');
    setStatistics([]);
  };

  return (
    <div>
      <h2>Lottery Number Statistics</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label>
          From Date:
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </label>
        <label>
          To Date:
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </label>
        <label>
          Past Number of Draws:{' '}
          <input
            type="number"
            value={pastDraws}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (value >= 0 || e.target.value === '') setPastDraws(e.target.value);
            }}
          />
        </label>
        <button onClick={filterAndCalculateStatistics}>Run</button>
        <button onClick={resetFilters}>Reset</button>
      </div>
      <div>
        {statistics.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Number</th>
                <th>Count</th>
                <th>Latest Date</th>
              </tr>
            </thead>
            <tbody>
              {statistics.map((stat) => (
                <tr key={stat.number}>
                  <td>
                    <Ball number={stat.number} color={numberColors[stat.number] || "black"} />
                  </td>
                  <td>{stat.count}</td>
                  <td>{stat.latestDate || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No statistics to display. Please set filters and click 'Run'.</p>
        )}
      </div>
    </div>
  );
};

export default Statistics;