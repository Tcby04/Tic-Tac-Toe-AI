import React from 'react';
import Game from './components/Game';
import WaveBackground from './components/WaveBackground';

function App() {
  return (
    <>
      <WaveBackground />
      <div className="app-container">
        <div className="align-center">
          <Game />
        </div>
      </div>
    </>
  );
}

export default App;
