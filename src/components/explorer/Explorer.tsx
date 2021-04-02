import React, { useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import updateDir from '../../utils/UpdateDir';

import { FullFileBrowser } from 'chonky';

type ExplorerProps = {
  instance: OctoPiInstance;
};

export default function Explorer({ instance }: ExplorerProps) {
  const root = instance.url + '/api/files/local';

  const [folderUrl, setFolderUrl] = useState(root);

  const folderChain = folderUrl
    .split('files/local')[1]
    .split('/')
    .map((shortPath: string) => {
      shortPath === '' && (shortPath = instance.name);
      return { id: shortPath, name: shortPath, isDir: true };
    });

  const fetcher = (url: string, apiKey: string) => {
    return axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      })
      .then((response) => {
        if (folderUrl === root) {
          return updateDir(response.data.files);
        } else {
          return updateDir(response.data.children);
        }
      })
      .catch(console.error);
  };

  const { data, error } = useSWR([folderUrl, instance.apiKey], fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>{instance.name}...</div>;

  const handleFileAction = (data: any) => {
    switch (data.id) {
      case 'open_files':
        const file = data.payload.targetFile;

        if (file.isDir) {
          console.log('Opening folder', file.name);
          if (file.path) {
            setFolderUrl(root.concat("/", file.path));
          } else {
            const fileName = file.name;
            const index = folderUrl.lastIndexOf(fileName);
            if (index < 0) {
              if (fileName === instance.name)
              setFolderUrl(root)
            } else {
              setFolderUrl(folderUrl.substr(0, index).concat(fileName));
            }
          }
        } else {
          console.log('Opening file', file.name);
        }
        break;
    }
  };

  return (
    <div style={{ height: 300 }}>
      <FullFileBrowser
        files={data}
        folderChain={folderChain}
        onFileAction={handleFileAction}
      />
    </div>
  );
}
