import React, { useState } from 'react';
import Explorer from './Explorer';
import styles from '../styles/instance.module.css';
import { shell } from 'electron';
import Preheat from './Preheat';

type PrinterProps = {
  instance: OctoPiInstance;
};

export default function Printer({ instance }: PrinterProps) {
  const openOctopi = () => {
    shell.openExternal(instance.url);
  };

  const [explorerOpen, setExplorerOpen] = useState(false);
  const [imgFail, setImgFail] = useState(false);

  const handleButton = () => {
    setExplorerOpen(!explorerOpen);
  };

  return (
    <div>
      <div className={styles.streamContainter}>
        {imgFail ? (
          <img
            className={styles.stream}
            src={'./public/offline.png'}
            alt="Image failed to load"
            onClick={openOctopi}
          />
        ) : (
          <img
            className={styles.stream}
            src={`${instance.url}/webcam/?action=stream`}
            alt="Stream should be here"
            onClick={openOctopi}
            onError={() => setImgFail(true)}
          />
        )}
      </div>
      <button type="button" onClick={handleButton} className={styles.toggle} />
      {explorerOpen && (
        <div>
          <Explorer instance={instance} />
          <Preheat instance={instance}/>
        </div>
      )}
    </div>
  );
}
