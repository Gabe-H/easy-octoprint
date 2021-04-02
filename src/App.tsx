import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Printer from './components/Printer';
import './App.global.css';
import { ChonkyActions, setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';

setChonkyDefaults({
  iconComponent: ChonkyIconFA,
  defaultFileViewActionId: ChonkyActions.EnableListView.id
});

const Hello = () => {
  const OctoPi01: OctoPiInstance = {
    url: 'http://octopi-01.local',
    apiKey: '3914A444936C4875A84B60E6BF2C8F8E',
    name: 'Bambusoideae',
  };
  const OctoPi02: OctoPiInstance = {
    url: 'http://octopi-02.local',
    apiKey: 'EF5CEEDCD17B48E4B92CAA025443BC17',
    name: 'Sucus',
  };

  return (
    <div className="printerInstanceParent">
      <div className="printerInstanceChild">
        <Printer instance={OctoPi01} />
      </div>
      {/* <div className="printerInstanceChild">
        <Printer instance={OctoPi02}/>
      </div> */}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
