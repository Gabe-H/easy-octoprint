import React, { useState } from 'react';
import styles from '../styles/preheat.module.css';
import { SetExtruder0Temp, SetBedTemp } from "../utils/SetTemp";

type PreheatProps = {
  instance: OctoPiInstance;
};

export default function Preheat({ instance }: PreheatProps) {
  const [extruder, setExtruder] = useState("");
  const [bed, setBed] = useState("");

  const onChangeExtruder = (event: any) => {
    setExtruder(event.target.value);
  };

  const onChangeBed = (event: any) => {
    setBed(event.target.value);
  };

  const handleExtruderButton = () => {
    SetExtruder0Temp({
      temperature: parseInt(extruder),
      instance
    })
  };

  const handleBedButton = () => {
    SetBedTemp({
      temperature: parseInt(bed),
      instance
    });
  };

  return (
    <div>
      <div className={styles.temp}>
        <input
          id="extruderTemp"
          onChange={onChangeExtruder}
          type="number"
          min={0}
          max={300}
          className={styles.numberField}
        />
        <label htmlFor="extruderTemp">
          <button type="button" onClick={handleExtruderButton}>
            Set Extruder
          </button>
        </label>
      </div>
      <div className={styles.temp}>
        <input
          id="bedTemp"
          onChange={onChangeBed}
          type="number"
          min={0}
          max={300}
          className={styles.numberField}
        />
        <label htmlFor="bedTemp">
          <button type="button" onClick={handleBedButton}>
            Set Bed
          </button>
        </label>
      </div>
    </div>
  );
}
