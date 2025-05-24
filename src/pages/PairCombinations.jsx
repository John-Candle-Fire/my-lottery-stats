// .page/PairCombinations.jsx
// Display pair combinations of lottery numbers based on user-defined filters.
import React, { useState } from 'react';
import Ball from '../components/Ball';
import lotteryResults from '../data/Mark6-Results.json';
import numberColors from '../data/lotteryNumbers.json';

const PairCombinations = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [pastDraws, setPastDraws] = useState('');
  const [pairCombinations, setPairCombinations] = useState([]);

  const filterAndCalculatePairs = () => {
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

    const pairCounts = {};

    // Process draws from most recent to oldest
    filteredResults.forEach((result, index) => {
      const allNumbers = [...result.numbers, result.special_number];
      for (let i = 0; i < allNumbers.length; i++) {
        for (let j = i + 1; j < allNumbers.length; j++) {
          const pair = [allNumbers[i], allNumbers[j]].sort((a, b) => a - b).join('-');
          if (!pairCounts[pair]) {
            pairCounts[pair] = { count: 0, latestDate: '', drawsSince: null };
          }
          pairCounts[pair].count += 1;
          // Only set drawsSince and latestDate for the most recent occurrence (first encounter)
          if (pairCounts[pair].drawsSince === null) {
            pairCounts[pair].latestDate = result.draw_date;
            pairCounts[pair].drawsSince = index;
          }
        }
      }
    });

    const pairsArray = Object.entries(pairCounts)
      .map(([pair, data]) => ({ pair, ...data }))
      .sort((a, b) => b.count - a.count);

    setPairCombinations(pairsArray.filter((pair) => pair.count > 0));
  };

  const resetFilters = () => {
    setFromDate('');
    setToDate('');
    setPastDraws('');
    setPairCombinations([]);
  };

  return (
    <div>
      <h2>Pair Combinations</h2>
      <div className="filter-controls">
        <label>
          From Date:
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </label>
        <label>
          To Date:
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
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
                filterAndCalculatePairs();
              }
            }}
          />
        </label>
        <button onClick={filterAndCalculatePairs}>Run</button>
        <button onClick={resetFilters}>Reset</button>
      </div>
      <div>
        {pairCombinations.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Number Pair</th>
                <th>Count</th>
                <th>Latest Date (Draws Since)</th>
              </tr>
            </thead>
            <tbody>
              {pairCombinations.map((pairData) => (
                <tr key={pairData.pair}>
                  <td>
                    {pairData.pair.split('-').map((num) => (
                      <Ball key={num} number={parseInt(num, 10)} color={numberColors[num] || 'black'} />
                    ))}
                  </td>
                  <td>{pairData.count}</td>
                  <td>{pairData.latestDate} ({pairData.drawsSince})</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No pair combinations to display. Please set filters and click 'Run'.</p>
        )}
      </div>
    </div>
  );
};

export default PairCombinations;