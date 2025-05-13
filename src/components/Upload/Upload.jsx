import React, { useRef, useState } from "react";
import { UploadCloud } from "react-feather";
import "./Upload.css";

const Upload = ({onUploadFinish}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploaded(true);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      fileInputRef.current.files = e.dataTransfer.files;
      setIsUploaded(true);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div
      className={`upload-container ${isDragging ? "dragging" : ""} ${isUploaded ? "uploaded" : ""}`}
      onClick={handleUploadClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ cursor: "pointer" }}
    >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleFileChange}
        id = "upload"
        required
      />
      <UploadCloud className="upload-icon" />
      <p className="upload-text">Cargar un archivo o arrastrar y soltar</p>
      <p className="upload-formats">PNG, JPG, GIF hasta 10 MB</p>

      {preview && <img src={preview} alt="Vista previa" className="upload-preview" />}
    </div>
  );
};

export default Upload;
