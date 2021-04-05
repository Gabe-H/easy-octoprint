import axios from 'axios';
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone';

interface MassUploadProps {
  octopiInstances: Array<OctoPiInstance>;
  folderUrls: Array<string>;
}

export default function MassUpload({ octopiInstances, folderUrls }: MassUploadProps) {

  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file: File) => {
        octopiInstances.map((instance) => {
          var root = instance.url.concat('/api/files/local');
          const reader = new FileReader();
          reader.readAsDataURL(file);

          reader.onabort = () => console.log('File reading was aborted');
          reader.onerror = () => console.log('File reading has failed');
          reader.onload = () => {
            const formData = new FormData();

            // Fill the formData object
            formData.append('file', file);
            formData.append('filename', file.name);
            folderUrls.map((url) => {
              if (url.startsWith(instance.url))
              url.split('/api/files/local/')[1] &&
                formData.append('path', url.split('/api/files/local/')[1]);
            })
            // formData.append('path', instance.url.concat(''));

            axios({
              method: 'post',
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
        })
      });
    },
    []
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <button type="button" style={{ width: '10vw', height: '25px'}} onClick={open}>Upload</button>
    </div>
  )
}
