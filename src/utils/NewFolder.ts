import axios from "axios";

interface NewFolderProps {
  file: FileAndPath,
  instance: OctoPiInstance
}

export default function NewFolder({ file, instance }: NewFolderProps) {
  const requestUrl = instance.url.concat('/api/files/local');
  console.log(requestUrl)

  const formData = new FormData();

  formData.append('foldername', file.name)
  file.path.split('/api/files/local/')[1] && formData.append('path', file.path.split('/api/files/local/')[1])

  axios({
    method: 'post',
    url: requestUrl,
    data: formData,
    headers: {
      'Content-Type': `multipart/form-data`,
      Authorization: 'Bearer '.concat(instance.apiKey),
    }
  }).catch(console.log)
}
