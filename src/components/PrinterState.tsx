import React, { useState } from 'react'
import axios from 'axios'
import useSWR from 'swr'
import CurrentJob from './CurrentJob'
import Preheat from './Preheat';

interface PrinterStateProps {
  instance: OctoPiInstance;
}

interface TemperatureState {
  actual: number;
  target: number;
}

export default function PrinterState({ instance }: PrinterStateProps) {
  const [printerState, setPrinterState] = useState("Offline");
  const [extruder, setExtruder] = useState<TemperatureState>({actual: 0, target: 0});
  const [bed, setBed] = useState<TemperatureState>({actual: 0, target: 0});

  const fetcher = (octopi: OctoPiInstance) => {
    return axios({
      method: 'GET',
      url: octopi.url.concat('/api/printer?history=false'),
      headers: {
        Authorization: 'Bearer '.concat(octopi.apiKey)
      }
    })
      .then((response) => {
        setExtruder({
          actual: response.data.temperature.tool0.actual,
          target: response.data.temperature.tool0.target,
        });
        setBed({
          actual: response.data.temperature.bed.actual,
          target: response.data.temperature.bed.target,
        });
        setPrinterState(response.data.state.text);
        return response.data;
      })
      .catch((error) => {
        if (error.response.status === 409) setPrinterState("Offline")
        return error
      })
  }

  const { data, error } = useSWR([instance], fetcher, {
    refreshInterval: 1500
  })

  if (error) {
    console.log(error)
    return <div>Failed to load</div>
  };
  if (!data) return <div>{instance.name}...</div>;

  return (
    <div>
      {printerState === "Offline" && (
        <div style={{ marginTop: '5px', height: '25px', backgroundColor: "red", borderRadius: '7px' }}>
          <p style={{marginLeft: '10px'}}>DISCONNECTED</p>
        </div>
      )}
      {printerState === "Operational" && (
        <>
        <p>{"Extruder:  ".concat(String(extruder.actual), '°C / ', String(extruder.target), '°C')}</p>
        <p>{"Bed: ".concat(String(bed.actual), '°C / ', String(bed.target), '°C')}</p>
        <Preheat instance={instance}/>
        </>
      )}
      {printerState === "Printing" && (
        <>
        <p>{"Extruder:  ".concat(String(extruder.actual), '°C / ', String(extruder.target), '°C')}</p>
        <p>{"Bed: ".concat(String(bed.actual), '°C / ', String(bed.target), '°C')}</p>
        <CurrentJob instance={instance} />
        <Preheat instance={instance}/>
        </>
      )}
    </div>
  )
}
