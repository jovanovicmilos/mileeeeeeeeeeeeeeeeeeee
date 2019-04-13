<?php
// Connecting to database as mysqli_connect("hostname", "username", "password", "database name");
$con = mysqli_connect("localhost", "root", "", "estore_db");
mysqli_set_charset($con,"utf8");
?>