import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {
  ChonkyActions,
  setChonkyDefaults,
  defineFileAction,
  ChonkyIconName,
} from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import Printer from './components/Printer';
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
    apiKey: process.env.KEY_1 as string,
    name: 'Lavandula',
  };
  const Succulent: OctoPiInstance = {
    url: 'http://echeveria.local',
    apiKey: process.env.KEY_2 as string,
    name: 'Echeveria',
  };
  const Redwood: OctoPiInstance = {
    url: 'http://sempervirens.local',
    apiKey: process.env.KEY_3 as string,
    name: 'Sempervirens',
  };
  const Mapel: OctoPiInstance = {
    url: 'http://palmatum.local',
    apiKey: process.env.KEY_4 as string,
    name: 'Palmatum',
  };
  const Lilac: OctoPiInstance = {
    url: 'http://syringa.local',
    apiKey: process.env.KEY_5 as string,
    name: 'Syringa',
  };
  const Bamboo: OctoPiInstance = {
    url: 'http://bambusoideae.local',
    apiKey: process.env.KEY_6 as string,
    name: 'Bambusoideae',
  };

  const octopiInstances: Array<OctoPiInstance> = [
    Lavender,
    Succulent,
    Redwood,
    Mapel,
    Lilac,
    Bamboo,
  ];

  const folderUrls: Array<string> = octopiInstances.map((instance) => {
    return instance.url.concat('/api/files/local');
  });

  const onFolderCallback = (event: string) => {
    folderUrls.forEach((url) => {
      if (url.startsWith(event.split('.local/api')[0]))
      folderUrls.splice(folderUrls.indexOf(url), 1, event)
    })
  };

  return (
    <>
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
            <div className="printerInstanceChild" key={instance.name}>
              <Printer instance={instance} folderCallback={onFolderCallback} key={octopiInstances.indexOf(instance)}/>
            </div>
          );
        })}
      </div>
      <div className="massUploadContainer">
        <div className="center">
          <MassUpload octopiInstances={octopiInstances} folderUrls={folderUrls} />
        </div>
      </div>
    </>
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
