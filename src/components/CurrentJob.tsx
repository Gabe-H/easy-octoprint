import axios from 'axios';
import React from 'react'
import useSWR from 'swr'

interface CurrentJobProps {
  instance: OctoPiInstance
}

export default function CurrentJob({ instance }: CurrentJobProps) {

  const fetcher = (instance: OctoPiInstance) => {
    return axios({
      method: 'GET',
      url: instance.url.concat('/api/job'),
      headers: {
        Authorization: 'Bearer '.concat(instance.apiKey)
      }
    })
      .then((response) => {
        console.log(response.data)
        return response.data
      })
      .catch(console.log)
  };

  const { data, error } = useSWR([instance], fetcher, {
    refreshInterval: 1500
  });

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>{instance.name}...</div>;

  return (
    <div>
      {data.progress && (
        data.progress.completion != null && (
          <>
          <progress id="printProgress" max={100} value={data.progress.completion} style={{ height: '20px', marginTop: '5px' }}></progress>
          <label htmlFor="printProgress" style={{ marginLeft: '5px'}}>{new Date(data.progress.printTime * 1000).toISOString().substr(11, 8)}</label>
          </>
        )
      )}
    </div>
  )
}
