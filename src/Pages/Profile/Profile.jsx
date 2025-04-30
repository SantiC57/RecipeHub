import { useState } from 'react';
import './Profile.css';
import { Navbar } from '../../components/Navbar/Navbar';

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    name: 'Usuario Ejemplo',
    email: 'usuario@ejemplo.com',
    password: '',
    confirmPassword: '',
    profileImage: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        profileImage: URL.createObjectURL(e.target.files[0])
      });
    }
  };

  const handleSubmit = () => {
    // Aquí iría la lógica para enviar los datos al backend
    alert('Cambios guardados exitosamente');
  };

  return (
      <div className="profile-container">
        <Navbar/>
      <h2 className="profile-title">
        Configuración<br />de Perfil
      </h2>
      
      <div className="form-container">
        <div className="profile-section">
          {formData.profileImage ? (
            <img 
              src={formData.profileImage} 
              alt="Foto de perfil" 
              className="profile-image"
            />
          ) : (
            <div className="profile-image-placeholder">
              <span>Foto</span>
            </div>
          )}
          <input 
            type="file" 
            id="profileImage" 
            accept="image/*" 
            onChange={handleImageChange}
            className="image-input" 
          />
          <label htmlFor="profileImage" className="upload-button">
            Cambiar foto
          </label>
        </div>

        <div className="form-row">
          <div className="form-column">
            <div className="form-group">
              <label className="form-label">Nombre completo</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-column">
            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
        </div>
        
        <div className="divider"></div>
        
        <h3 className="section-title">Cambiar contraseña</h3>
        
        <div className="form-group">
          <label className="form-label">Nueva contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;