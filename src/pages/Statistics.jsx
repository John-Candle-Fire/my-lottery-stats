// ./pages/Statistics.jsx
// Display Number of Times and last drawn date of each Lottery Number in the selected past draws or date range.
import React, { useState } from 'react';
import Ball from '../components/Ball';
import lotteryResults from '../data/Mark6-Results.json';
import numberColors from '../data/lotteryNumbers.json';

const Statistics = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [pastDraws, setPastDraws] = useState('');
  const [statistics, setStatistics] = useState([]);

  const filterAndCalculateStatistics = () => {
    let filteredResults = lotteryResults;

    // Apply filters
    if (fromDate && toDate && pastDraws) {
      setFromDate('');
      setToDate('');
      filteredResults = filteredResults.slice(0, parseInt(pastDraws, 10));
    } else {
      if (fromDate && toDate) {
        filteredResults = filteredResults.filter((result) =>
          new Date(result.draw_date.split('/').reverse().join('-')) >= new Date(fromDate) &&
          new Date(result.draw_date.split('/').reverse().join('-')) <= new Date(toDate)
        );
      }
      if (pastDraws) {
        filteredResults = filteredResults.slice(0, parseInt(pastDraws, 10));
      }
    }

    // Sort filtered results in descending order (most recent first)
    filteredResults.sort((a, b) =>
      new Date(b.draw_date.split('/').reverse().join('-')) - new Date(a.draw_date.split('/').reverse().join('-'))
    );

    const stats = Array.from({ length: 49 }, (_, i) => ({
      number: i + 1,
      count: 0,
      latestDate: '',
      drawsSince: null // Initialize to null to indicate not found yet
    }));

    // Process draws from most recent to oldest
    filteredResults.forEach((result, index) => {
      [...result.numbers, result.special_number].forEach((num) => {
        const stat = stats.find((stat) => stat.number === num);
        if (stat.drawsSince === null) {
          stat.latestDate = result.draw_date;
          stat.drawsSince = index; // Set drawsSince only for the most recent occurrence
        }
        stat.count += 1;
      });
    });

    // Filter out numbers that never appeared
    const filteredStats = stats.filter((stat) => stat.count > 0);
    filteredStats.sort((a, b) => b.count - a.count);
    setStatistics(filteredStats);
  };

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
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                filterAndCalculateStatistics();
              }
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
                <th>Latest Date (Draws Since)</th>
              </tr>
            </thead>
            <tbody>
              {statistics.map((stat) => (
                <tr key={stat.number}>
                  <td>
                    <Ball number={stat.number} color={numberColors[stat.number] || 'black'} />
                  </td>
                  <td>{stat.count}</td>
                  <td>{stat.latestDate} ({stat.drawsSince})</td>
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