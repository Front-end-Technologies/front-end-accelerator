import { GitHubContent, WebcontainerFileSystem } from "@/interfaces";
import { createHttp } from "@/lib/api";

export const fetchFolderFiles = async (url: string) => {
  const http = createHttp();

  const folderData: GitHubContent[] = await http.get(url);

  const folderFiles = await Promise.all(
    folderData.map(async (folderFile) => {
      if (folderFile.type === "dir") {
        const subFolderFiles: GitHubContent[] = await fetchFolderFiles(
          folderFile.url,
        );
        return {
          ...folderFile,
          contents: subFolderFiles,
        };
      }
      const folderFileData: GitHubContent[] = await http.get(
        folderFile.download_url,
        { responseType: "text" },
      );

      return {
        ...folderFile,
        contents: folderFileData,
      };
    }),
  );

  return folderFiles;
};

export const mapGithubToWebcontainerFileSystem = (
  input: GitHubContent[],
): WebcontainerFileSystem => {
  const output: WebcontainerFileSystem = {};

  input.forEach((item) => {
    if (item.type === "file") {
      output[item.name] = {
        file: {
          contents: item.contents as string,
        },
      };
    } else if (item.type === "dir") {
      output[item.name] = {
        directory: mapGithubToWebcontainerFileSystem(
          item.contents as GitHubContent[],
        ),
      };
    }
  });

  return output;
};
