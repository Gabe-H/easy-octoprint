import React, { useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import styles from '../../styles/explorer.module.css';

type FolderProps = {
  name: string;
  path: string;
  url: string;
  apiKey: string;
};

const fetcher = (url: string, apiKey: string) => {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
    .then((response) => response.data)
    .catch(console.error);
};

export default function Folder({ name, path, url, apiKey }: FolderProps) {
  const folderUrl = `${url}/api/files/local/${path}`;
  const { data, error } = useSWR([folderUrl, apiKey], fetcher);

  const [expand, setExpand] = useState(false)

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>{name}...</div>;

  console.log(data.children);

  return (
    <div>
      <li className={styles.folder} onClick={() => setExpand(!expand)}>
        {name}
        {expand && (
          <ul>
            {data.children.map((file: GCodeFile) => (
              <MachineCode name={file.name} />
            ))}
          </ul>
        )}
      </li>
    </div>
  );
}
