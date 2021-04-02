import { FileArray } from "chonky";

export default function updateDir(data: any): FileArray {

  return data.map((file: GCodeFile) => {
      return {
        id: file.name,
        name: file.name,
        isDir: (file.type === "folder"),
        size: file.size,
        modDate: file.date,
        path: file.path,
      }
    })
}
