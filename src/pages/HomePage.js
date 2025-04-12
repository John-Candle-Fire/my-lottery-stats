import React, { useState } from 'react';

const HomePage = ({ language }) => {
  // State for managing the last updated date
  const [lastUpdated, setLastUpdated] = useState('April 1, 2025'); // Default last updated date

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Dynamic Welcome Message */}
      <h1>
        {language === 'en'
          ? 'Welcome to the Lottery Statistics Website'
          : '歡迎來到彩票統計網站'}
      </h1>

      {/* Disclaimer Section */}
      <p style={{ color: 'gray', marginTop: '20px' }}>
        {language === 'en'
          ? 'Disclaimer: The contents may not be accurate. Please use at your own discretion.'
          : '免責聲明：內容可能不準確，請自行斟酌使用。'}
      </p>

      {/* Last Updated Section */}
      <p style={{ fontSize: '14px', color: 'gray', marginTop: '10px' }}>
        {language === 'en'
          ? `Last updated: ${lastUpdated}`
          : `最後更新日期：${lastUpdated}`}
      </p>
    </div>
  );
};

export default HomePage;