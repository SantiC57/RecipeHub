import React, {useState, useEffect} from "react";
import { Footer } from "../../components/footer/Footer";
import "./publication.css";
import Upload from "/src/components/Upload/Upload";
import { useNavigate} from "react-router-dom";
import FoodService from "../../assets/Food Service.ico";
import { Navbar } from "../../components/Navbar/Navbar";
import api from "../../api/axiosConfig";
import Swal from "sweetalert2";

const Publication = ({onSubmit, selectedRecipe}) => {
	const navigate = useNavigate();
	const [showSuccess, setShowSuccess] = useState(false);
	const [errors, setErrors] = useState({});
	const [recipe, setRecipe] = useState({ 
		titulo: "", 
		ingredientes: "", 
		imagen: "",
		preparacion: "", 
		tiempo: "",
		categoria: "",
		coccion: "",
		usuarioId: JSON.parse(localStorage.getItem("currentUser"))?.id || null
	});

	const [isUploading, setIsUploading] = useState(false);

	useEffect(() => {
		if (selectedRecipe){
			setRecipe(selectedRecipe);
		}
	}, [selectedRecipe]);	

	const handleChange = (e) => {
		const { name, value } = e.target;
		setRecipe({ ...recipe, [name]: value });

		if(errors[name]){
			setErrors({ ...errors, [name]: null });
		}
	};

	const handleUploadFinish = (url) => {
		setRecipe({ ...recipe, imagen: url });
		setIsUploading(false);
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		try {
			const { titulo, ingredientes, preparacion, tiempo, imagen, categoria, coccion, usuarioId } = recipe;
		
			if (!titulo || !ingredientes || !preparacion || !imagen || !tiempo || !categoria) {
				Swal.fire("Por favor, completa todos los campos obligatorios.");
				return;
			}
			
			// Verificamos que tenemos un usuarioId
			if (!usuarioId) {
				Swal.fire("Debes iniciar sesión para publicar una receta.");
				navigate("/login");
				return;
			}
			
			// Creamos el objeto para enviar directamente
			const recipeToSend = {
				titulo,
				ingredientes,
				preparacion,
				imagen,
				tiempo,
				categoria,
				coccion,
				usuarioId
			};
			
			// Enviamos directamente al backend para evitar transformaciones adicionales
			const response = await api.post('/recetas', recipeToSend);
			console.log("Receta guardada con éxito:", response.data);
			
			// Limpiamos el formulario
			setRecipe({ 
				titulo: "", 
				ingredientes: "", 
				imagen: null,
				preparacion: "", 
				tiempo: "",
				categoria: "",
				coccion: "",
				usuarioId: usuarioId // Mantenemos el ID del usuario
			});
			
			setShowSuccess(true);
			setTimeout(() => {
				setShowSuccess(false);
				navigate("/"); // Opcional: navegar a la página principal después de publicar
			}, 2000);
} catch (error) {
	console.error("Error al guardar receta:", error.response?.data || error.message);
	Swal.fire({
		title: `Error al guardar la receta: ${error.response?.data?.message || "Verifica los campos e intenta nuevamente"}`,
		icon: "error",
		draggable: true
	});
}

	};
	
	return (
		<>
			<div className="publication-navbar"></div>
			<Navbar />
			<section className="publication">
				<h2 className="publication-title">Publicar Nueva Receta</h2>

				<form className="publication-form" onSubmit={handleSubmit}>
					<fieldset className="publication-recipe">
						<label htmlFor="titulo" className="publication-label">Título de la receta</label>
						<input 
							type="text" 
							id="titulo" 
							className="publication-input" 
							placeholder="Ej. Pastas Bolognesa" 
							name="titulo" 
							required 
							value={recipe.titulo} 
							onChange={handleChange}
						/>
					</fieldset>

					<fieldset className="publication-recipe">
						<label htmlFor="categoria" className="publication-label">Categoría</label>
						<select 
							id="categoria" 
							className="publication-input" 
							name="categoria" 
							required 
							value={recipe.categoria} 
							onChange={handleChange}
						>
							<option value="">Selecciona una categoría</option>
							<option>Pastas</option>
							<option>Carnes</option>
							<option>Mariscos</option>
							<option>Sopas</option>
							<option>Ensaladas</option>
							<option>Postres</option>
							<option>Salsas</option>
						</select>
					</fieldset>

					<fieldset className="publication-recipe">
						<label htmlFor="ingredientes" className="publication-label">Ingredientes</label>
						<textarea 
							id="ingredientes" 
							className="publication-textarea" 
							placeholder="Lista de ingredientes..." 
							name="ingredientes" 
							required 
							value={recipe.ingredientes} 
							onChange={handleChange}
						></textarea>
					</fieldset>

					<fieldset className="publication-recipe">
						<label htmlFor="preparacion" className="publication-label">Preparación</label>
						<textarea 
							id="preparacion" 
							className="publication-textarea" 
							placeholder="Pasos para preparar" 
							name="preparacion"
							required 
							value={recipe.preparacion} 
							onChange={handleChange}
						></textarea>
					</fieldset>

					<fieldset className="publication-recipe">
						<label htmlFor="upload" className="publication-label">Subir Foto</label>
						<Upload onUploadStart={() => setIsUploading(true)} onUploadFinish={handleUploadFinish} />					
					</fieldset>

					<fieldset className="publication-recipe">
						<label htmlFor="tiempo" className="publication-label">Tiempo Preparación</label>
						<select 
							id="tiempo" 
							className="publication-input" 
							name="tiempo" 
							required 
							value={recipe.tiempo} 
							onChange={handleChange}
						>
							<option value="">Selecciona el tiempo de preparación</option>
							<option>10 minutos</option>
							<option>15 minutos</option>
							<option>20 minutos</option>
							<option>25 minutos</option>
							<option>30 minutos</option>
							<option>45 minutos</option>
							<option>1 hora</option>
							<option>2 horas</option>
							<option>3 horas</option>
						</select>
					</fieldset>

					<fieldset className="publication-recipe">
						<label htmlFor="coccion" className="publication-label">Tiempo de Cocción</label>
						<select 
							id="coccion" 
							className="publication-input" 
							name="coccion" 
							value={recipe.coccion} 
							onChange={handleChange}
						>
							<option value="">Selecciona el tiempo de cocción</option>
							<option>10 minutos</option>
							<option>15 minutos</option>
							<option>20 minutos</option>
							<option>25 minutos</option>
							<option>30 minutos</option>
							<option>35 minutos</option>
							<option>40 minutos</option>
							<option>45 minutos</option>
							<option>1 hora</option>
						</select>
					</fieldset>

					<div className="publication-actions">
						{/* Botón type="button" para evitar envío del formulario */}
						<button 
							type="button" 
							className="publication-button publication-button--cancel" 
							onClick={() => navigate("/")}
						>
							Cancelar
						</button>
						<button 
							type="submit"
  							className="publication-button publication-button--save"
  							disabled={isUploading}
						>	
  							{isUploading ? "Subiendo imagen..." : "Publicar"}
						</button>
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
};

export default Publication;