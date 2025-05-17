import React, { useState } from "react";
import { Footer } from "../../components/footer/Footer";
import Upload from "../../components/Upload/Upload";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./support.css";
import { Navbar } from "../../components/Navbar/Navbar";

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
        
        <Navbar />
        
        <div className="support-container">
            <h2 className="support-title">Soporte</h2>
            <p className="support-subtitle">
            Si tienes alguna duda o sugerencia, ¡queremos saber de ti!
            </p>
            <form className="support-form" onSubmit={handleSubmit}>
            
    
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
    
    
            <button type="submit" className="support-button">
                Enviar
            </button>
            </form>
        </div>
    <Footer />
    </>
    );

}
export default ContactUs;