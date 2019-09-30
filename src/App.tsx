import React from 'react';
import logo from './logo.svg';
import Tooltip from './Tooltip'
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App" style={{padding: 100}}>
      <Tooltip position="right top">
        <button role="button" onClick={ () => { console.log('111') } } >tooltip</button>
      </Tooltip>
    </div>
  );
}

export default App;
