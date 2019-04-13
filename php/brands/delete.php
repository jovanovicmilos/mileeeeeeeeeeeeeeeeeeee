<?php 
    include("../db.php");
    $id = json_decode(file_get_contents("php://input")); 
    $query = "DELETE FROM brands WHERE id=$id";
    $deleteimage = mysqli_query($con, " SELECT * FROM brends WHERE id={$id}");
     while($rez = mysqli_fetch_assoc($deleteimage)){
         unlink('../../images/brands/' . $rez['image_path']);
     }
    mysqli_query($con, $query);
?>