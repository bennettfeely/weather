<?php
	$hostname = 'localhost';
	$dbname = 'goofball_weather';
	$db_user = 'goofball_whether';
	$db_password = 'gbT!u8b4me';
	$link = mysql_connect($hostname, $db_user, $db_password);

	$connect = mysql_select_db($dbname, $link) or die(mysql_error());

	$query = mysql_query("SELECT * FROM weather_table");

	$rows = array();
	while($row = mysql_fetch_assoc($query)) {
	    $rows[] = $row;
	}
	echo json_encode($rows);

?>