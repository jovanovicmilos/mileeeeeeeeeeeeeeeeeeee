
<?php 
	include("../db.php");
    $arr = json_decode($_POST["post"]);
    $time = time();
    $sql = mysqli_query($con,"INSERT INTO sizes(name) VALUES ('".$arr->name."')");

?>