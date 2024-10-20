import React from 'react';
import SubmarineVisualization from './SubmarineVisualization';

const App: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Submarine Command Simulator</h1>
      <SubmarineVisualization />
    </div>
  );
};

export default App;