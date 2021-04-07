/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { shell } from 'electron';
import Explorer from './Explorer';
import styles from '../styles/instance.module.css';

type PrinterProps = {
  instance: OctoPiInstance;
  folderCallback(event: string): void
};

export default function Printer({ instance, folderCallback }: PrinterProps) {
  const openOctopi = () => {
    shell.openExternal(instance.url);
  };

  const [explorerOpen, setExplorerOpen] = useState(false);
  const [imgFail, setImgFail] = useState(false);

  const handleButton = () => {
    setExplorerOpen(!explorerOpen);
  };

  const onFolderCallback = (event: string) => {
    folderCallback(event)
  }

  return (
    <div>
      <div className={styles.streamContainter}>
        {imgFail ? (
          <img
            className={styles.stream}
            src='./public/offline.png'
            alt="Failed to load"
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
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button type="button" onClick={handleButton} className={styles.toggle} />
      {explorerOpen && (
        <div>
          <Explorer instance={instance} folderCallback={onFolderCallback} />
        </div>
      )}
    </div>
  );
}
