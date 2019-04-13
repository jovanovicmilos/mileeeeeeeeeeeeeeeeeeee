<?php 
include('../db.php');

    $data = json_decode($_POST["post"]);

    $filename = "";
    print_r($data);
    if(!isset($_FILES['file']['name'])){
         $filename = $data->image_path;
      }else{
        $target_dir = "../../images/brands/";
        $time = time();
        $filename = md5($time) . "-" . basename($_FILES['file']['name']);
        $target_file = $target_dir . $filename;
        $imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);
        move_uploaded_file($_FILES['file']['tmp_name'], $target_file);
    }

    mysqli_query($con, "UPDATE brands SET 
        name='$data->name', 
        image_path='$filename'
        WHERE id='$data->id'");   

?>
