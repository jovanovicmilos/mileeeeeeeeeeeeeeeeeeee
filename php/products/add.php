
<?php 
	include("../db.php");

	$arr = json_decode($_POST["post"]);
    $description = addcslashes($arr->description, "'");
    $description_en = addcslashes($arr->description_en, "'");
    $short_description = addcslashes($arr->short_description, "'");
    $short_description_en = addcslashes($arr->short_description_en, "'");
    $price_new = empty($arr->price_new) ? "0" : $arr->price_new;
    $brand_id = empty($arr->brand_id) ? "0" : $arr->brand_id;
    $age = empty($arr->age) ? "0" : $arr->age;
	$php_format_date = strtotime($arr->update_date);
    $update_date = date('Y-m-d H:i:s', $php_format_date);
    $sql = mysqli_query($con, 
                        "INSERT INTO products(
                        title,
                        title_en, 
                        price,
                        price_new,
                        price_discount,
                        gender,
                        brand_id,
                        age,
                        description,
                        description_en,
                        short_description,
                        short_description_en,
                        update_date
                        ) VALUES ( 
                        '".$arr->title."', 
                        '".$arr->title_en."',
                        '".$arr->price."',
                        '".$price_new."',
                        '".$arr->price_discount."',
                        '".$arr->gender."',
                        '".$brand_id."',
                        '".$age."',
                        '".$description."',
                        '".$description_en."',
                        '".$short_description."',
                        '".$short_description_en."',
                        '".$update_date."')");
//
    
    $last_id = mysqli_insert_id($con);
    
    for($i = 0; $i < sizeof($arr->sizes);$i++)
    {
        mysqli_query($con,  "INSERT INTO product_size(product_id, size_id, quantity) VALUES ({$last_id},{$arr->sizes[$i]->id},{$arr->sizes[$i]->quantity})");
    }  
    
    $target_dir = "../../images/products/";
    if(isset($_FILES['files']['name'])){
	 	$countfiles = count($_FILES['files']['name']);
        $filename_arr = array(); 
        for ( $i = 0;$i < $countfiles;$i++ ){
            $time = time() + $i;
            $filename = md5($time) . "-" . basename($_FILES['files']['name'][$i]);
            move_uploaded_file($_FILES['files']['tmp_name'][$i],$target_dir.$filename);
            $num = $i + 1;
            mysqli_query($con,  "INSERT INTO product_image VALUES (null, '".$last_id."', '".$filename."', '".$num."')");
            $filename_arr[] = $filename;
        }
        $arr = array('name' => $filename_arr);
        echo json_encode($arr);
    }

?>