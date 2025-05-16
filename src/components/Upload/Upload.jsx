// src/components/Upload/Upload.jsx
import React, { useRef, useState } from "react";
import { UploadCloud } from "react-feather";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../api/firebaseConfig"; // ajusta la ruta según tu estructura
import "./Upload.css";

const Upload = ({onUploadFinish}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);

  const uploadToFirebase = async (file) => {
    const storageRef = ref(storage, `recetas/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    onUploadFinish(url); // enviamos la URL al padre
  };

  const handleFile = async (file) => {
    if (file) {
      setPreview( URL.createObjectURL(file) );
      onUploadStart?.();
      await uploadToFirebase(file);
    }
  };

  const handleFileChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      className={`upload-container ${isDragging ? "dragging" : ""}`}
      onClick={() => fileInputRef.current.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      style={{ cursor: "pointer" }}
    >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleFileChange}
      />
      <UploadCloud className="upload-icon" />
      <p className="upload-text">Cargar un archivo o arrastrar y soltar</p>
      <p className="upload-formats">PNG, JPG, GIF hasta 10 MB</p>
      {preview && <img src={preview} alt="Vista previa" className="upload-preview" />}
    </div>
  );
};

export default Upload;
