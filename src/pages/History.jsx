// .pages/History.jsx
// Display past lottery results statistics based on user-defined filters.
import React, { useState } from 'react';
import Ball from '../components/Ball';
import lotteryResults from '../data/Mark6-Results.json';
import numberColors from '../data/lotteryNumbers.json';

const History = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [pastDraws, setPastDraws] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);

  // Function to filter results based on criteria
  const filterResults = () => {
    let results = lotteryResults;

    // If both From/To Date and Number of Draws are provided, prioritize Number of Draws
    if (fromDate && toDate && pastDraws) {
      setFromDate('');
      setToDate('');
      results = results.slice(0, parseInt(pastDraws, 10));
    } else {
      // Filter by date range
      if (fromDate && toDate) {
        results = results.filter((result) =>
          new Date(result.draw_date.split('/').reverse().join('-')) >= new Date(fromDate) &&
          new Date(result.draw_date.split('/').reverse().join('-')) <= new Date(toDate)
        );
      }

      // Filter by number of draws
      if (pastDraws) {
        results = results.slice(0, parseInt(pastDraws, 10));
      }
    }

    // Sort results in descending order of draw date
    results.sort((a, b) =>
      new Date(b.draw_date.split('/').reverse().join('-')) - new Date(a.draw_date.split('/').reverse().join('-'))
    );

    setFilteredResults(results);
  };

  // Function to reset all inputs
  const resetFilters = () => {
    setFromDate('');
    setToDate('');
    setPastDraws('');
    setFilteredResults([]);
  };

  return (
    <div>
      <h2>Past Draw History</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label>
          From Date: <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </label>
        <label>
          To Date: <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
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
                filterResults();
              }
            }}
          />
        </label>
        <button onClick={filterResults}>Run</button>
        <button onClick={resetFilters}>Reset</button>
      </div>
      <div>
        {filteredResults.length > 0 ? (
          filteredResults.map((result) => (
            <div key={result.draw_sequence}>
              <p>
                {result.draw_date} (Draw #{result.draw_sequence})
              </p>
              <div>
                {result.numbers.map((num) => (
                  <Ball key={num} number={num} color={numberColors[num] || "black"} />
                ))}
                <span> - </span>
                <Ball number={result.special_number} color={numberColors[result.special_number] || "black"} />
              </div>
            </div>
          ))
        ) : (
          <p>No results to display. Please set filters and click 'Run'.</p>
        )}
      </div>
    </div>
  );
};

export default History;