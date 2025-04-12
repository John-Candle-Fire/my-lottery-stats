import React, { useState } from 'react';
import Ball from '../components/Ball';
import lotteryResults from '../data/Mark6-Results.json';
import numberColors from '../data/lotteryNumbers.json';

const PairCombinations = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [pastDraws, setPastDraws] = useState('');
  const [pairCombinations, setPairCombinations] = useState([]);

  // Function to filter results and calculate pair combinations
  const filterAndCalculatePairs = () => {
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

    const pairCounts = {};

    filteredResults.forEach((result) => {
      const allNumbers = [...result.numbers, result.special_number];
      for (let i = 0; i < allNumbers.length; i++) {
        for (let j = i + 1; j < allNumbers.length; j++) {
          const pair = [allNumbers[i], allNumbers[j]].sort((a, b) => a - b).join('-');
          if (!pairCounts[pair]) {
            pairCounts[pair] = { count: 0, latestDate: '' };
          }
          pairCounts[pair].count += 1;
          pairCounts[pair].latestDate = result.draw_date;
        }
      }
    });

    // Convert pairCounts object to a sorted array of pairs
    const pairsArray = Object.entries(pairCounts)
      .map(([pair, data]) => ({ pair, ...data }))
      .sort((a, b) => b.count - a.count); // Sort by descending count

    setPairCombinations(pairsArray.filter((pair) => pair.count > 0)); // Exclude pairs with zero count
  };

  // Function to reset all inputs and pair combinations
  const resetFilters = () => {
    setFromDate('');
    setToDate('');
    setPastDraws('');
    setPairCombinations([]);
  };

  return (
    <div>
      <h2>Pair Combinations</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
          />
        </label>
        <button onClick={filterAndCalculatePairs}>Run</button>
        <button onClick={resetFilters}>Reset</button>
      </div>
      <div>
        {pairCombinations.length > 0 ? (
         <table >   
            <thead>
              <tr>
                <th>Number Pair</th>
                <th>Count</th>
                <th>Latest Date</th>
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
                  <td>{pairData.latestDate || '-'}</td>
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