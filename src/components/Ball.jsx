import React from 'react';

const Ball = ({ number, color }) => {
  // Define the color mapping logic
  const backgroundColor = color === 'green' || color === 'red' || color === 'blue' ? color : 'white';
  
  // Assign a default color if the provided color is not valid
  return (
    <div
      style={{
        display: 'inline-block',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: backgroundColor, // Correctly assign the color
        textAlign: 'center',
        lineHeight: '40px',
        color: 'white',
        fontWeight: 'bold'
      }}
    >
      {number}
    </div>
  );
};

export default Ball;