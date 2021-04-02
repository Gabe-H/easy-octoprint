import React from 'react';
import Explorer from './explorer/Explorer';
import styles from '../styles/instance.module.css';
import { shell } from 'electron';

type PrinterProps = {
  instance: OctoPiInstance;
};

export default function Printer({ instance }: PrinterProps) {

  const openOctopi = () => {
    shell.openExternal(instance.url)
  }

  return (
    <div className={styles.printerContainer}>
      <div className={styles.streamContainter}>
        <img
          className={styles.stream}
          src={`${instance.url}/webcam/?action=stream`}
          alt="Steam should be here"
          onClick={openOctopi}
        />
      </div>
      <Explorer instance={instance} />
    </div>
  );
}
