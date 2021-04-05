import React, { useCallback, useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import updateDir from '../utils/UpdateDir';
import LoadPrint from '../utils/LoadPrint';
import DeleteFile from '../utils/DeleteFile';
import NewFolder from '../utils/NewFolder';
import styles from '../styles/explorer.module.css';
import NewFolderModal from './NewFolderModal';
import { useDropzone } from 'react-dropzone';

import { FullFileBrowser, FileData } from 'chonky';

type ExplorerProps = {
  instance: OctoPiInstance;
};

export default function Explorer({ instance }: ExplorerProps) {
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const root = instance.url.concat('/api/files/local');

  const [folderUrl, setFolderUrl] = useState(root);
  const [activeFile, setActiveFile] = useState<FileAndPath>();

  const folderChain = folderUrl
    .split('files/local')[1]
    .split('/')
    .map((shortPath: string) => {
      shortPath === '' && (shortPath = instance.name);
      return { id: shortPath, name: shortPath, isDir: true };
    });

  const fetcher = (url: string, apiKey: string) => {
    return axios({
      method: 'GET',
      url: url,
      headers: {
        Authorization: 'Bearer '.concat(apiKey),
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

  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onabort = () => console.log('File reading was aborted');
        reader.onerror = () => console.log('File reading has failed');
        reader.onload = () => {
          const formData = new FormData();

          // Fill the formData object
          formData.append('file', file);
          formData.append('filename', file.name);
          folderUrl.split('/api/files/local/')[1] &&
            formData.append('path', folderUrl.split('/api/files/local/')[1]);

          axios({
            method: 'POST',
            url: root,
            data: formData,
            headers: {
              'Content-Type': `multipart/form-data`,
              Authorization: 'Bearer '.concat(instance.apiKey),
            },
          })
            .then(() => {
              console.log(file.name, 'upload successful');
            })
            .catch(console.log);
        };
      });
    },
    [folderUrl]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  const { data, error } = useSWR([folderUrl, instance.apiKey], fetcher, {
    refreshInterval: 1500,
  });

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>{instance.name}...</div>;

  const handleFileAction = (data: any) => {
    console.log(data);
    switch (data.id) {
      case 'open_files':
        var file: any;
        if (data.payload.targetFile) {
          file = data.payload.targetFile;
        } else {
          file = data.payload.files[0];
        }
        if (file.isDir) {
          console.log('Opening folder', file.name);
          if (file.path) {
            setFolderUrl(root.concat('/', file.path));
          } else {
            const fileName: string = file.name;
            const index = folderUrl.lastIndexOf(fileName.concat('/'));
            if (index < 0) {
              if (fileName === instance.name) setFolderUrl(root);
            } else {
              setFolderUrl(folderUrl.substr(0, index).concat(fileName));
            }
          }
        } else {
          console.log('Opening file', file.name);
        }
        break;
      case 'mouse_click_file':
        if (data.payload.file.type === 'machinecode')
          setActiveFile({
            name: data.payload.file.name,
            path: data.payload.file.path,
          });
        break;
      case 'create_folder':
        setFolderModalOpen(true);
        break;
      case 'upload_files':
        open();
        break;
      case 'delete_files':
        data.state.selectedFiles.map((fileToDelete: FileData) => {
          DeleteFile({
            file: {
              name: fileToDelete.name,
              path: folderUrl,
            },
            instance: instance,
          });
        });
        break;
      default:
        break;
    }
  };

  const handleLoad = () => {
    activeFile &&
      LoadPrint({
        file: {
          name: activeFile.name,
          path: activeFile.path,
        },
        instance: instance,
      });
  };

  return (
    <div>
      <NewFolderModal
        folderModalOpen={folderModalOpen}
        onCloseModal={() => setFolderModalOpen(false)}
        callback={(name: string) => {
          NewFolder({
            file: {
              name,
              path: folderUrl,
            },
            instance,
          });
        }}
      />
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div style={{ height: '500px' }}>
          <FullFileBrowser
            files={data}
            folderChain={folderChain}
            onFileAction={handleFileAction}
          />
        </div>
      </div>
      {activeFile && (
        <>
          <div className={styles.activeFile}>{activeFile.name}</div>
          <button
            type="button"
            className={styles.loadButton}
            onClick={handleLoad}
          >
            Print file
          </button>
        </>
      )}
    </div>
  );
}
