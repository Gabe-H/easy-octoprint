/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { FullFileBrowser, FileData } from 'chonky';
import { useDropzone } from 'react-dropzone';
import updateDir from '../utils/UpdateDir';
import LoadPrint from '../utils/LoadPrint';
import DeleteFile from '../utils/DeleteFile';
import NewFolder from '../utils/NewFolder';
import NewFolderModal from './NewFolderModal';
import PrinterState from './PrinterState';

type ExplorerProps = {
  instance: OctoPiInstance;
  folderCallback: any;
};

export default function Explorer({ instance, folderCallback }: ExplorerProps) {
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const root = instance.url.concat('/api/files/local');

  const [folderUrl, setFolderUrl] = useState(root);
  const [activeFile, setActiveFile] = useState<FileAndPath>();
  const [selectedFile, setSelectedFile] = useState("");

  const folderChain = folderUrl
    .split('files/local')[1]
    .split('/')
    .map((shortPath: string) => {
      let modPath = shortPath;
      if (shortPath === '') modPath = instance.name;
      return { id: modPath, name: modPath, isDir: true };
    });

  const fetcher = (url: string, apiKey: string) => {
    return axios({
      method: 'GET',
      url,
      headers: {
        Authorization: 'Bearer '.concat(apiKey),
      },
    })
      .then((response) => {
        if (folderUrl === root)
          return updateDir(response.data.files);
        return updateDir(response.data.children);
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
          if (folderUrl.split('/api/files/local/')[1])
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
              return console.log(file.name, 'upload successful');
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileAction = (action: any) => {
    // console.log(data);
    switch (action.id) {
      case 'open_files': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let file: FileData;
        if (action.payload.targetFile) {
          file = action.payload.targetFile;
        } else {
          // eslint-disable-next-line prefer-destructuring
          file = action.payload.files[0];
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
      }
      case 'mouse_click_file':
        if (action.payload.file.type === 'machinecode')
          setActiveFile({
            name: action.payload.file.name,
            path: action.payload.file.path,
          });
        break;
      case 'create_folder':
        setFolderModalOpen(true);
        break;
      case 'upload_files':
        open();
        break;
      case 'delete_files':
        action.state.selectedFiles.forEach((fileToDelete: FileData) => {
          DeleteFile({
            file: {
              name: fileToDelete.name,
              path: folderUrl,
            },
            instance,
          });
        });
        break;
      default:
        break;
    }
  };

  const handleLoad = () => {
    if (activeFile)
      LoadPrint({
        file: {
          name: activeFile.name,
          path: activeFile.path,
        },
        instance,
      });
  };

  folderCallback(folderUrl);

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
          setSelectedFile(name);
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
      <PrinterState instance={instance}/>
    </div>
  );
}
