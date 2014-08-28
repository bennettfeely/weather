<?php
	$hostname = 'localhost';
	$dbname = 'goofball_weather';
	$db_user = 'goofball_whether';
	$db_password = 'gbT!u8b4me';

	$con = mysqli_connect($hostname, $db_user, $db_password, $dbname);

	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}


	$geo = $_POST["geo"];
	$address = $_POST["address"];
	$browser = $_POST["browser"];
	$os = $_POST["os"];
	$time = $_POST["time"];

	$sql = "INSERT INTO `weather_table` (geo, address, browser, os, time) VALUES ('$geo', '$address', '$browser', '$os', '$time')";

	if (!mysqli_query($con, $sql)) {
	  die('Error: ' . mysqli_error($con));
	}
	echo "1 record added";

	mysqli_close($con);

?>