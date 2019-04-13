<?php

    include("../db.php");
    $json_param = file_get_contents("php://input");   
    $model = json_decode($json_param);
    $upit1 = mysqli_query($con, " SELECT * FROM sizes WHERE id={$model->id}");
    
    while($res = mysqli_fetch_assoc($upit1)){
        $jsonData = json_encode($res, JSON_NUMERIC_CHECK);
        echo ($jsonData);
    }

?>