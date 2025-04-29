import React, {useState} from "react";
import { Footer } from "../../components/footer/Footer";
import "./publication.css";
import  Upload from "/src/components/Upload/Upload";
import { useNavigate} from "react-router-dom";
import FoodService from "../../assets/Food Service.ico";
import { Navbar } from "../../components/Navbar/Navbar";


const Publication = () => {
	const navigate = useNavigate();
	const [showSuccess, setShowSuccess] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
	
		// Aquí puedes validar que los campos estén completos
		const titulo = document.getElementById("titulo").value;
		const ingredientes = document.getElementById("ingredientes").value;
		const preparacion = document.getElementById("preparacion").value;
		const upload = document.getElementById("upload").value;
		const tiempoPreparacion = document.getElementById("tiempo-prepa").value;
	
		if (!titulo || !ingredientes || !preparacion || !upload || !tiempoPreparacion) {
			alert("Por favor, completa todos los campos obligatorios.");
			return;
		}
	
		// Si pasa la validación, muestra mensaje de éxito
		setShowSuccess(true);
		setTimeout(() => setShowSuccess(false), 4000);
	
	};
	


  return (
    <>
	<div className="publication-navbar"></div>
	  <Navbar />
      <section className="publication">
        <h2 className="publication-title">Publicar Nueva Receta</h2>

        <form className="publication-form" onSubmit={handleSubmit}>

          <fieldset className="publication-recipe">
            <label htmlFor="titulo" className="publication-label">Titulo de la receta</label>
            <input type="text" id="titulo" className="publication-input" placeholder="Ej. Pastas Bolognesa" required />
          </fieldset>

          <fieldset className="publication-recipe">
            <label htmlFor="ingredientes" className="publication-label">Ingredientes</label>
            <textarea id="ingredientes" className="publication-textarea" placeholder="Lista de ingredientes..." required></textarea>
          </fieldset>

          <fieldset className="publication-recipe">
            <label htmlFor="preparacion" className="publication-label">Preparación</label>
            <textarea id="preparacion" className="publication-textarea" placeholder="Pasos para preparar" required></textarea>
          </fieldset>

          <fieldset className="publication-recipe">
            <label htmlFor="upload" className="publication-label">Subir Foto</label>
            <Upload />
          </fieldset>

          <fieldset className="publication-recipe">
            <label htmlFor="tiempo-prepa" className="publication-label">Tiempo Preparación </label>
            <select id="tiempo-prepa" className="publication-input" required>
							<option>10 minutos</option>
  						<option>15 minutos</option>
  						<option>30 minutos</option>
 						 	<option>45 minutos</option>
  						<option>1 hora</option>
							<option>2 hora</option>
							<option>3 hora</option>
							</select>

          </fieldset>

          <div className="publication-actions">
            <button type="submit" className="publication-button publication-button--cancel" onClick={() => navigate("/")}>Cancelar</button>
            <button type="submit" className="publication-button publication-button--save">Publicar</button>


          </div>
        </form>
				{showSuccess && (
 			 <div className="xbox-achievement">
   			 <img src={FoodService} alt="icon" className="achievement-icon" />
    			<div>
      			<p className="achievement-title">¡Receta publicada!</p>
      			<p className="achievement-subtitle">Tu receta se ha guardado con éxito</p>
    			</div>
  			</div>
				)}

      </section>
      <Footer />
    </>
  );
}

export default Publication;