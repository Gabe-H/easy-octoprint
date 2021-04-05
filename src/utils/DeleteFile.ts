import axios from "axios";

interface DeleteFileProps {
  file: FileAndPath,
  instance: OctoPiInstance
}

export default function DeleteFile({ file, instance }: DeleteFileProps) {
  const requestUrl = file.path.concat('/', file.name);

  // const body = JSON.stringify();

  axios({
    method: 'DELETE',
    url: requestUrl,
    headers: {
      Authorization: `Bearer ${instance.apiKey}`
    }
  })
}
