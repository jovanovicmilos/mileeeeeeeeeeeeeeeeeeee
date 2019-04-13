<?php 
include('../db.php');

    $data = json_decode($_POST["post"]);

    mysqli_query($con, "UPDATE sizes SET 
        name='$data->name'
        WHERE id='$data->id'");   

?>
