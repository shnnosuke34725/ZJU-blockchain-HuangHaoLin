import React from 'react';
import './App.css';
import Header from "./component/Header";
import MyProperties from "./component/MyProperties";
import AvailableProperties from "./component/AvailableProperties";
import NewHouse from "./component/NewHouse";
import ExchangePoints from "./component/ExchangePoints";

function App() {
  return (
      <div className="App">
          <Header />
          <MyProperties />
          {/*<ListProperty />*/}
          <AvailableProperties />
          <NewHouse/>
          {/*<BuyProperty />*/}
          <ExchangePoints/>
      </div>
  );
}

export default App;
