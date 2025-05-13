import React, { useEffect, useState } from "react";
import { Folder } from "lucide-react";
import path from "path";
import Breadcrumbs from "./Breadcrumbs";
import Files from "./Files";
import { getFolderContents } from "@/lib/api/fileManager";

interface FolderItem {
  name: string;
  type: "folder";
  size: string;
  files: number;
}

interface FileItem {
  name: string;
  category: string;
  size: string;
  date: string;
  folder: string;
  fullPath?: string;
}

const AllFolders = () => {
  const [currentPath, setCurrentPath] = useState<string>("");
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFolderContents = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await getFolderContents(currentPath);

        setFolders(data.folders || []);
        setFiles(
          (data.files || []).map((file: FileItem) => ({
            ...file,
            folder: currentPath,
            fullPath: path.join(currentPath, file.name),
          }))
        );
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchFolderContents();
  }, [currentPath]);

  const navigateToFolder = (folderName: string) => {
    setCurrentPath((prev) => (prev ? `${prev}/${folderName}` : folderName));
  };

  const handleBreadcrumbClick = (path: string) => {
    setCurrentPath(path);
  };

  const handleFileDelete = (deletedFileName: string, folder: string) => {
    setFiles((prevFiles) =>
      prevFiles.filter(
        (file) => !(file.name === deletedFileName && file.folder === folder)
      )
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">All Folders</h2>
      </div>

      <Breadcrumbs
        path={currentPath}
        onBreadcrumbClick={handleBreadcrumbClick}
      />

      {isLoading && <div className="p-4 text-center">Loading...</div>}
      {error && <div className="p-4 text-red-500">{error}</div>}

      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {folders.map((folder, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => navigateToFolder(folder.name)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 flex items-center justify-center bg-yellow-100 rounded-lg">
                    <Folder className="text-yellow-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{folder.name}</h3>
                    <p className="text-gray-500 text-sm">{folder.size}</p>
                  </div>
                </div>
                <span className="text-gray-600 text-sm">
                  {folder.files} {folder.files === 1 ? "File" : "Files"}
                </span>
              </div>
            ))}
          </div>

          {files.length > 0 && (
            <Files files={files} onDelete={handleFileDelete} />
          )}
        </>
      )}
    </div>
  );
};

export default AllFolders;
