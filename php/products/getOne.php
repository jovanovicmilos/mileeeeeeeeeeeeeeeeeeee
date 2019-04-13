<?php

    include("../db.php");
    $json_param = file_get_contents("php://input");   
    $model = json_decode($json_param);
    $upit1 = mysqli_query($con, " SELECT * FROM products WHERE id={$model->id}");
    
    $sizesarray= array();
    $imagesarray = array();

    while($res = mysqli_fetch_assoc($upit1)){
        
        
        $res['images'] = array();
        $images = mysqli_query($con, "SELECT * FROM product_image WHERE product_id={$res['id']}"); 
        while($row = mysqli_fetch_assoc($images)){
                $imagesarray['id'] = $row['id'];
                $imagesarray['priority'] = $row['priority'];
                $imagesarray['image_path'] = $row['image_path'];
                array_push($res['images'], $imagesarray);
        }
        
        $res['brand'] = new stdClass();
        $settlements = mysqli_query($con, "SELECT id, name, image_path FROM brands WHERE id={$res['brand_id']}");  
        while($row = mysqli_fetch_assoc($settlements)){
            $res['brand']->id = $row['id'];
            $res['brand']->name = $row['name'];  
            $res['brand']->image_path = $row['image_path'];  
        }
        
        $res['sizes'] = array();
        $sizes = mysqli_query($con, "SELECT size_id, quantity FROM product_size WHERE product_id={$res['id']}");
        while($size = mysqli_fetch_assoc($sizes)){
            $fetch_data = mysqli_query($con, "SELECT id, name FROM sizes WHERE id={$size['size_id']}");
            while($row = mysqli_fetch_assoc($fetch_data)){
                $sizesarray['id'] = $row['id'];
                $sizesarray['name'] = $row['name'];
                $sizesarray['quantity'] = $size['quantity'];
            }
            array_push($res['sizes'], $sizesarray);
        }
        //return json
        $jsonData = json_encode($res, JSON_NUMERIC_CHECK);
        echo ($jsonData);
    }

?>