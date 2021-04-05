import axios from 'axios';

interface LoadPrintProps {
  file: FileAndPath;
  instance: OctoPiInstance;
}

export default function LoadPrint({ file, instance }: LoadPrintProps) {
  const requestUrl = instance.url.concat('/api/files/local/', file.path);
  console.log(requestUrl);

  axios({
    method: 'POST',
    url: requestUrl,
    data: {
      command: 'select',
      print: true,
    },
    headers: {
      Authorization: 'Bearer '.concat(instance.apiKey),
    },
  });
}
