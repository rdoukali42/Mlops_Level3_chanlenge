import React from 'react';
import Navigation from '../components/Navigation';
import Level3Logo from '../components/Level3Logo';
import GridBackground from '../components/GridBackground';
import ComingSoon from '../components/ComingSoon';
import MatrixRain from '../components/background';

function Data() {
  return (
    <div>
      <MatrixRain />
      {/* Your other content here */}
      <div style={{ height: '200vh', padding: '20px', color: 'white' }}>
        <h1>Scroll Down</h1>
        <p>Some content to make the page scrollable...</p>
      </div>
    </div>
  );
}

export default Data;
