import axios from "axios";

interface SetTempProps {
  temperature: number;
  instance: OctoPiInstance;
}

export function SetExtruder0Temp({ temperature, instance }: SetTempProps) {
  axios({
    method: 'POST',
    url: instance.url.concat('/api/printer/tool'),
    data: {
      command: "target",
      targets: {
        tool0: temperature
      }
    },
    headers: {
      Authorization: 'Bearer '.concat(instance.apiKey)
    }
  });
}

export function SetBedTemp({ temperature, instance }: SetTempProps) {
  axios({
    method: 'POST',
    url: instance.url.concat('/api/printer/bed'),
    data: {
      command: 'target',
      target: temperature
    },
    headers: {
      Authorization: 'Bearer '.concat(instance.apiKey),
      'content-type': 'application/json'
    }
  });
}
