<?php 
    include("../db.php");
    $id = json_decode(file_get_contents("php://input")); 
    $query = "DELETE FROM sizes WHERE id=$id";
    mysqli_query($con, $query);
?>