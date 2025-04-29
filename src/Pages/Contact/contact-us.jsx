import React, { useState } from "react";
import { Footer } from "../../components/footer/Footer";
import Upload from "../../components/Upload/Upload";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./contact-us.css";

const ContactUs = () => {
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        pais: "",
        telefono: "",
        descripcion: "",
        archivo: null,
        aceptarPolitica: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "file") {
            setFormData((prevState) => ({ ...prevState, [name]: e.target.files[0], }));
        } else if (type === "checkbox") {
            setFormData((prevState) => ({ ...prevState, [name]: e.target.checked, }));
        } else {
            setFormData((prevState) => ({ ...prevState, [name]: e.target.value, }));
        }

    };

    const handleSubmit = (e) => {


        e.preventDefault();

        if (!formData.email.includes('@') || !formData.email.includes('.')) {
            Swal.fire("Por favor, ingresa un correo electrónico válido");
            return;
        }
        
        if (formData.telefono && !/^\d{7,15}$/.test(formData.telefono.replace(/\D/g, ''))) {
            Swal.fire("Por favor, ingresa un número de teléfono válido");
            return;
        }
        console.log("Datos del formulario:", formData);



        setFormData({
            nombre: "",
            email: "",
            pais: "",
            telefono: "",
            descripcion: "",
            archivo: null,
            aceptarPolitica: false,
        });
        Swal.fire({title:"Formulario enviado con éxito!", icon: "success", draggable: true});

        setTimeout(() => {
            navigate("/");
          }, 1000); 

    };

    return (
        <>
        
        
        
        <div className="contact-container">
            <h2 className="contact-title">Contáctanos</h2>
            <p className="contact-subtitle">
            Si tienes alguna duda o sugerencia, ¡queremos saber de ti!
            </p>
            <form className="contact-form" onSubmit={handleSubmit}>
            
            <div className="form-group">
                <label htmlFor="nombre">Nombre y Apellido</label>
                <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ingresa tu nombre completo"
                required
                />
            </div>
            
    
            <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ingresa tu correo"
                required
                />
            </div>
    
            <div className="form-group">
                <label htmlFor="pais">País</label>
                <select
                id="pais"
                name="pais"
                value={formData.pais}
                onChange={handleChange}
                required
                >
                <option value="">Selecciona el país</option>
                <option value="México">México</option>
                <option value="Colombia">Colombia</option>
                <option value="Argentina">Argentina</option>
                <option value="España">España</option>
                {/* Agrega más países o genera dinámicamente */}
                </select>
            </div>
    
            <div className="form-group">
                <label htmlFor="telefono">Teléfono</label>
                <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ingresa tu número de teléfono"
                />
            </div>
    
    
            <div className="form-group">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Escribe un mensaje detallado..."
                rows="4"
                required
                />
            </div>
    
            <div className="form-group file-input-container">
                <label htmlFor="upload">Subir Archivo</label>
                <Upload/>
            </div>
    
            <div className="form-group checkbox-group">
                <label className="checkbox-label">
                <input
                    type="checkbox"
                    name="aceptarPolitica"
                    checked={formData.aceptarPolitica}
                    onChange={handleChange}
                    required
                />
                Acepto la Política de Privacidad
                </label>
                <a href="#politica" className="privacy-link">
                Política de Privacidad
                </a>
            </div>
    
            <button type="submit" className="contact-button">
                Enviar
            </button>
            </form>
        </div>
    <Footer />
    </>
    );

}
export default ContactUs;