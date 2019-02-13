<?php 
	if($_POST){
		if($_POST['accion'] == 'crear'){
			// Crear nuevo registro en BD
			require_once '../funciones/bd.php';

			// Validar las entradas con filtros de saneamiento de PHP
			$nombre = filter_var($_POST['nombre'], FILTER_SANITIZE_STRING);
			$empresa = filter_var($_POST['empresa'], FILTER_SANITIZE_STRING);
			$telefono = filter_var($_POST['telefono'], FILTER_SANITIZE_STRING);
			
			try{
				// Prepare statements
				$statement = $conn->prepare("INSERT INTO contactos (nombre, empresa, telefono) VALUES (?, ?, ?)");
				// Insertar 3 strings
				$statement->bind_param("sss", $nombre, $empresa, $telefono);
				$statement->execute();
				
				if($statement->affected_rows == 1){
					$respuesta = array(
						'respuesta' => 'correcto',
						'datos' => array(
							 'id_insertado' => $statement->insert_id,
							 'nombre' => $nombre,
							 'empresa' => $empresa,
							 'telefono' => $telefono
						)
					);
				}

				$statement->close();
				$conn->close();

			}catch (Exception $e){
				$respuesta = array(
					'error' => $e->getMessage()
				);
			}
		
			echo json_encode($respuesta);
		}

		if($_POST['accion'] == 'editar'){
			require_once '../funciones/bd.php';

			// Validar las entradas con filtros de saneamiento de PHP
			$nombre = filter_var($_POST['nombre'], FILTER_SANITIZE_STRING);
			$telefono = filter_var($_POST['telefono'], FILTER_SANITIZE_STRING);
			$empresa = filter_var($_POST['empresa'], FILTER_SANITIZE_STRING);
			$id = filter_var($_POST['id'], FILTER_SANITIZE_NUMBER_INT);

			try{
				$stmt = $conn->prepare("UPDATE contactos SET nombre = ?, empresa = ?, telefono = ? WHERE id = ?");
				$stmt->bind_param('sssi', $nombre, $empresa, $telefono, $id);
				$stmt->execute();

				if($stmt->affected_rows == 1){
					$respuesta = array(
						'respuesta'=>'correcto'
					);
				}else{
					$respuesta = array(
						'respuesta'=>'error'
					);
				}

				$stmt->close();
				$conn->close();

			}catch(Exception $e){
				$respuesta = array(
					'error' => $e->getMessage()
				);
			}

			echo json_encode($respuesta);
		}
	}
	
	if($_GET){
		if($_GET['accion'] == 'borrar'){
			require_once '../funciones/bd.php';
			$id = filter_var($_GET['id'], FILTER_SANITIZE_NUMBER_INT);
			
			try{
				$stmt = $conn->prepare("DELETE FROM contactos WHERE id = ?");
				$stmt->bind_param("i", $id);
				$stmt->execute();
				if($stmt->affected_rows == 1){
					$respuesta = array(
						'respuesta' => 'correcto'
					);
				}
				$stmt->close();
				$conn->close();
				
			}catch (Exception $e){
				$respuesta = array(
					'error'=> $e->getMessage()
				);
			}

			echo json_encode($respuesta);
		}	
	}
	

 ?>