<?php 
	define('DB_USER', 'root');
	define('DB_PASSWORD', '');
	define('DB_HOST', 'localhost');
	define('DB_NAME', 'agenda_udemy');

	$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

	// Si sale 1 esta bien
	// echo $conn->ping();

 ?>