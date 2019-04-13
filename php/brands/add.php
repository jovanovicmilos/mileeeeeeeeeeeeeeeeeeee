
<?php 
	include("../db.php");
    $arr = json_decode($_POST["post"]);
    $target_dir = "../../images/brands/";
    $time = time();
    $plan_filename = '';
     if(isset($_FILES['file']['name'])){
        $plan_filename = md5($time) . "-" . basename($_FILES['file']['name']);
        $target_file = $target_dir . $plan_filename;
        $imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);
        move_uploaded_file($_FILES['file']['tmp_name'], $target_file);

    }
    $sql = mysqli_query($con,"INSERT INTO brands(name, image_path) VALUES ('".$arr->name."', '$plan_filename')");

?>