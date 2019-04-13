<?php
    
    include("../db.php");
    $data = json_decode(file_get_contents("php://input"));
    $sql = "SELECT * FROM sizes order by name asc";
    $query = mysqli_query($con, $sql);
    $tags = array();
    while($rez = mysqli_fetch_assoc($query)){
        array_push($tags, $rez);
    }
    $jsonData = json_encode($tags, JSON_PRETTY_PRINT);
    echo ($jsonData);

?>