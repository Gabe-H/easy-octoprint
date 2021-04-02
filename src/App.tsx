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

  const octopiInstances: Array<OctoPiInstance> = [
    {
      url: 'http://octopi-01.local',
      apiKey: '3914A444936C4875A84B60E6BF2C8F8E',
      name: 'Bambusoideae',
    },
    {
      url: 'http://octopi-02.local',
      apiKey: 'EF5CEEDCD17B48E4B92CAA025443BC17',
      name: 'Sucus',
    }
  ]

  return (
    <div className="printerInstanceParent">
      {octopiInstances.map((instance) => {
        return (
          <div className="printerInstanceChild">
            <Printer instance={instance} />
          </div>
        )
      })}
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
