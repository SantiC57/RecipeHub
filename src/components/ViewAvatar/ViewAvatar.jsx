import React, { useState } from "react";

const ViewAvatar = ({ src, placeholder, uploadingImage }) => {
  const [open, setOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [highQualitySrc, setHighQualitySrc] = useState(null)

  return (
    <>
      {src ? (
        
        <img
          src={src}
          alt="Vista previa"
          className="profile-image"
          onClick={() => setOpen(true)}
          style={{
            cursor: "pointer",
            borderRadius: "50%",
            opacity: uploadingImage ? 0.7 : 1,
          }}
        />
      ) : (
        
        <div onClick={() => setOpen(true)} style={{ cursor: "pointer" }}>
          {typeof placeholder === "function"
            ? placeholder()
            : placeholder}
        </div>
      )}

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <img
            src={src}
            alt="Ampliada"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
              borderRadius: 8,
            }}
          />
        </div>
      )}
    </>
  );
};

export default ViewAvatar;
