import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Printer from './components/Printer';
import {
  ChonkyActions,
  setChonkyDefaults,
  defineFileAction,
  ChonkyIconName,
} from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import './App.global.css';
import MassUpload from './components/MassUpload';

const CreateFolder = defineFileAction({
  id: 'create_folder',
  button: {
    name: 'Create folder',
    toolbar: true,
    iconOnly: true,
    icon: ChonkyIconName.folderCreate,
  },
} as const);

const UploadFiles = defineFileAction({
  id: 'upload_files',
  button: {
    name: 'Upload Files',
    toolbar: true,
    iconOnly: true,
    icon: ChonkyIconName.upload,
  },
});

setChonkyDefaults({
  iconComponent: ChonkyIconFA,
  defaultFileViewActionId: ChonkyActions.EnableListView.id,
  disableDragAndDrop: false,
  fileActions: [
    // ChonkyActions.CreateFolder,
    CreateFolder,
    UploadFiles,
    ChonkyActions.DeleteFiles,
  ],
});

const Main = () => {
  const Lavender: OctoPiInstance = {
    url: 'http://lavandula.local',
    apiKey: '',
    name: 'Lavandula',
  };
  const Succulent: OctoPiInstance = {
    url: 'http://echeveria.local',
    apiKey: '',
    name: 'Echeveria',
  };
  const Redwood: OctoPiInstance = {
    url: 'http://sempervirens.local',
    apiKey: '',
    name: 'Sempervirens',
  };
  const Mapel: OctoPiInstance = {
    url: 'http://palmatum.local',
    apiKey: '',
    name: 'Palmatum',
  };
  const Lilac: OctoPiInstance = {
    url: 'http://syringa.local',
    apiKey: '74775D4921C64832A3919AC96AD079D5',
    name: 'Syringa',
  };
  const Bamboo: OctoPiInstance = {
    url: 'http://bambusoideae.local',
    apiKey: '3914A444936C4875A84B60E6BF2C8F8E',
    name: 'Bambusoideae',
  };

  const octopiInstances: Array<OctoPiInstance> = [
    Lilac,
    Bamboo,
    Lavender,
    Succulent,
    Redwood,
    Mapel,
  ];

  var folderUrls: Array<string> = octopiInstances.map((instance) => {
    return instance.url.concat('/api/files/local');
  });

  const onFolderCallback = (event: string) => {
    folderUrls.map((url) =>{
      if (url.startsWith(event.split('.local/api')[0]))
      folderUrls.splice(folderUrls.indexOf(url), 1, event)
    })
  };

  return (
    <React.Fragment>
      <div
        style={{
          height: 'auto',
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: `repeat(${octopiInstances.length}, 1fr)`,
        }}
      >
        {octopiInstances.map((instance) => {
          return (
            <div className="printerInstanceChild">
              <Printer instance={instance} folderCallback={onFolderCallback} />
            </div>
          );
        })}
      </div>
      <div className="massUploadContainer">
        <div className="center">
          <MassUpload octopiInstances={octopiInstances} folderUrls={folderUrls} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Main} />
      </Switch>
    </Router>
  );
}
