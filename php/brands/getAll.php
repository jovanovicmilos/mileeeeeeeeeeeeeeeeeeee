<?php
    
    include("../db.php");
    $data = json_decode(file_get_contents("php://input"));
    $offset = $data->page * 10;
    $query = mysqli_query($con, "SELECT * FROM brands WHERE name LIKE '%{$data->name}%' order by id desc LIMIT {$offset},10");
    $count = mysqli_query($con, "SELECT * FROM brands WHERE name LIKE '%{$data->name}%'");
    $rowcount = mysqli_num_rows($count);

    $tags = array();
    $tags['total'] = $rowcount;
    $tags['data']  = array();
    while($rez = mysqli_fetch_assoc($query)){
		 array_push($tags['data'], $rez);
    }

    $jsonData = json_encode($tags, JSON_NUMERIC_CHECK);
    echo ($jsonData);


?>