import React, { useState, useEffect } from 'react';
import RoutesConfig from './routes';
import Header from './components/Header';
import './App.css';

const App: React.FC = () => {
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setLoggedIn(true);
    }
  }, []);

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />
      <div className="container">
        <RoutesConfig setLoggedIn={setLoggedIn} />
      </div>
    </div>
  );
};

export default App;
