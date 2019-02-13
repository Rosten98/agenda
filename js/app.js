const formularioContactos = document.querySelector('#contacto'),
	  listadoContactos = document.querySelector('#listado-contactos tbody'),
	  inputBuscador = document.querySelector('#buscar');

eventListeners();

function eventListeners(){
	// Cuando el formulario de crear o editar se ejecuta
	formularioContactos.addEventListener('submit', leerFormulario);

	// Listener para eliminar 
	if(listadoContactos){
		listadoContactos.addEventListener('click', eliminarContacto);	
	}

	// Buscador
	inputBuscador.addEventListener('input', buscarContactos);

	numeroContactos();

}

function leerFormulario(e){
	e.preventDefault();
	
	// Leer los input
	const nombre = document.querySelector('#nombre').value,
		  empresa = document.querySelector('#empresa').value,
		  telefono = document.querySelector('#telefono').value,
		  accion = document.querySelector('#accion').value;

	if(nombre === '' || empresa === '' || telefono === ''){
		mostrarNotificacion("Todos los campos son obligatorios", "error");
	}else{
		// Pasa la validación, crea llamado a Ajax
		const infoContacto = new FormData();
		infoContacto.append('nombre', nombre);
		infoContacto.append('empresa', empresa);
		infoContacto.append('telefono', telefono);
		infoContacto.append('accion', accion);

		// console.log(...infoContacto); //... -> Spread operator
		if(accion === 'crear'){
			// Crearemos un contacto
			insertarBD(infoContacto);
		}else{
			// Editaremos el contacto
			// Leer el id
			const idRegistro = document.querySelector('#id').value;
			infoContacto.append('id', idRegistro);
			actualizarRegistro(infoContacto);
		}
	}
}

function insertarBD(infoContacto){
	const xhr = new XMLHttpRequest();
	xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);
	xhr.onload = function(){
		if(this.status === 200){
			console.log( JSON.parse(xhr.responseText) );
			const respuesta = JSON.parse(xhr.responseText);
			
			// Insertar nuevo elemento en la <table>  
			const nuevoContacto = document.createElement('tr');

			nuevoContacto.innerHTML = `
				<td>${respuesta.datos.nombre}</td>
				<td>${respuesta.datos.empresa}</td>
				<td>${respuesta.datos.telefono}</td>
			`;

			// Crear contenedor para los botones
			const contenedorAcciones = document.createElement('td');

			// Crear el icono editar
			const iconoEditar = document.createElement('i');
			iconoEditar.classList.add('fas', 'fa-pen-square');

			// Crear enlace para editar
			const btnEditar = document.createElement('a');
			btnEditar.appendChild(iconoEditar);
			btnEditar.href=`editar.php?id=${respuesta.datos.id_insertado}`;
			btnEditar.classList.add('btn', 'btn-editar');

			// Agregarlo al padre
			contenedorAcciones.appendChild(btnEditar);

			// Crear icono eliminar
			const iconoEliminar = document.createElement('i');
			iconoEliminar.classList.add('fas', 'fa-trash-alt');

			// Crear boton eliminar
			const btnEliminar = document.createElement('button');
			btnEliminar.appendChild(iconoEliminar);
			btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
			btnEliminar.classList.add('btn', 'btn-borrar');

			// Agregar al padre
			contenedorAcciones.appendChild(btnEliminar);

			// Agregar al <tr>
			nuevoContacto.appendChild(contenedorAcciones); 

			// Agregar con los contactos
			listadoContactos.appendChild(nuevoContacto);

			// Resetear formulario
			document.querySelector('form').reset();

			// Mostrar notificacion
			mostrarNotificacion('Contacto creado correctamente', 'correcto');

			// Actualizar numero contenedor
			numeroContactos();
		}
	}
	xhr.send(infoContacto);
}

// Editar contacto
function actualizarRegistro(infoContacto) {
	// console.log(...infoContacto);

	// Crear objeto
	const xhr = new XMLHttpRequest();
	// Abrir conexion
	xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);
	// Leer respuesta
	xhr.onload = function(){
		if(this.status === 200){
			const respuesta = JSON.parse(xhr.responseText);
			console.log(respuesta);

			if(respuesta.respuesta === 'correcto'){
				// Mostrar notificacion
				mostrarNotificacion('Contacto editado correctamente', 'correcto');
			}else{
				// Notificacion error
				mostrarNotificacion('Hubo un error', 'error');
			}
			// Despues de 3 segundos redireccionar
			setTimeout(()=>{
				window.location.href="index.php"
			}, 2000);
		}
	}
	// Enviar petición
	xhr.send(infoContacto);
}	

// Eliminar contacto
function eliminarContacto(e){
	if(e.target.classList.contains('btn-borrar')){
		// Tomar id del elemento al que se le ha dado click
		const id = e.target.getAttribute('data-id');
		console.log(id);
		// Preguntar si están seguros
		const respuesta = confirm('¿Estás seguro de eliminar?');

		if(respuesta){
			// Llamado a AJAX
			// Crear objeto
			const xhr = new XMLHttpRequest();
			// Abrir conexión
			xhr.open('GET', `inc/modelos/modelo-contactos.php?id=${id}&accion=borrar`, true);
			// Leer la respuesta
			xhr.onload = function(){
				if(this.status === 200){
					const resultado = JSON.parse(xhr.responseText);
					console.log(resultado);

					if(resultado.respuesta === 'correcto'){
						// Eliminar registro del DOM
						e.target.parentElement.parentElement.remove();

						// Mostrar notificacion
						mostrarNotificacion('Contacto eliminado', 'correcto');

						// Actualizar numero de contactos
						numeroContactos();
					}else{
						// Mostrar notificación
						mostrarNotificacion('Hubo un error', 'error');
					}
				}
			}
			// Enviar petición
			xhr.send();
			
		}
	}
}

// Notificación en pantalla
function mostrarNotificacion(mensaje, clase){
	const notificacion = document.createElement('div');
	notificacion.classList.add(clase, 'notificacion', 'sombra');
	notificacion.textContent = mensaje;
	
	// Formulario
	formularioContactos.insertBefore(notificacion, document.querySelector('form div'));

	// Ocultar y mostrar la notificacion
	setTimeout(()=>{
		notificacion.classList.add('visible');
		setTimeout(()=>{
			notificacion.classList.remove('visible');
			setTimeout(()=>{
				notificacion.remove();
			}, 500);
			
		}, 3000);
	}, 100);
}

// Buscar contactos
function buscarContactos(e) {
	// console.log(e.target.value);
	const expresion = new RegExp(e.target.value, "i"),
		  registros = document.querySelectorAll('tbody tr');

	registros.forEach(registro => {
		registro.style.display = 'none';

		if(registro.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) != -1){
			registro.style.display = 'table-row';
		}

		numeroContactos();
	});
}

// Mostrar el número de contactos
function numeroContactos() {
	const totalContactos = document.querySelectorAll('tbody tr'),
		  contenedorNumero = document.querySelector('.total-contactos span');
	let total = 0;

	totalContactos.forEach(contacto =>{
		if(contacto.style.display === '' || contacto.style.display === 'table-row'){
			total++;
		}
	});
	// console.log(total);
	contenedorNumero.textContent = total;
}