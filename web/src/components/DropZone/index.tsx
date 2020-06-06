import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";

import "./style.css";

interface Props {
  onFileSelected: (file: File) => void;
}

const DropZone: React.FC<Props> = ({ onFileSelected }) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles[0]) {
      const file = acceptedFiles[0];

      const fileUrl = URL.createObjectURL(file);

      setSelectedFileUrl(fileUrl);
      onFileSelected(file);
    }
  }, [onFileSelected]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  return (
    <div
      {...getRootProps()}
      className={"dropzone " + (isDragReject ? "dropzone-invalid" : "")}
    >
      <input {...getInputProps()} accept="image/*" />
      {selectedFileUrl ? (
        <img src={selectedFileUrl} alt="Imagem do estabelecimento" />
      ) : (
        <p>
          <FiUpload />
          {isDragReject ? "Arquivo inválido" : "Imagem do estabelecimento"}
        </p>
      )}
    </div>
  );
};

export default DropZone;
