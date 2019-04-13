<?php 
include('../db.php');
if($con){
    echo "Success";
    $data = json_decode($_POST["post"]);
//echo $data->blog_id;
//print_r($data);

$php_format_date = strtotime($data->update_date);
$update_date = date('Y-m-d H:i:s', $php_format_date);
$description = addcslashes($data->description, "'");
$description_en = addcslashes($data->description_en, "'");
$short_description = addcslashes($data->short_description, "'");
$short_description_en = addcslashes($data->short_description_en, "'");
$price_new = empty($data->price_new) ? "0" : $data->price_new;
$brand_id = empty($data->brand_id) ? "0" : $data->brand_id;
$age = empty($data->age) ? "0" : $data->age;
//$convertpost = '"' . $data->blog_post . "'";

mysqli_query($con, "UPDATE products SET 
	title='$data->title', 
	title_en='$data->title_en', 
    price='$data->price', 
    price_new='$price_new', 
 	price_discount='$data->price_discount',
	gender='$data->gender', 
	brand_id='$brand_id',
    age='$age',
    description='$description',
    description_en='$description_en',
    short_description='$short_description',
    short_description_en='$short_description_en',
    update_date='$update_date'
	WHERE id='$data->id'");
    //agents
    $deletesizes = mysqli_query($con, "DELETE FROM product_size WHERE product_id={$data->id}");
    for($i = 0; $i < sizeof($data->sizes);$i++)
    {
        mysqli_query($con,  "INSERT INTO product_size(product_id, size_id, quantity) VALUES ({$data->id},{$data->sizes[$i]->id},{$data->sizes[$i]->quantity})");
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
            mysqli_query($con,  "INSERT INTO product_image VALUES (null, '".$data->id."', '".$filename."', '".$num."')");
            $filename_arr[] = $filename;
        }

        $arr = array('name' => $filename_arr);
        echo json_encode($arr);
    }
    
    foreach($data->imagefordelete as $key){
        for($i = 0; $i < sizeof($key);$i++)
        {
            mysqli_query($con, "DELETE FROM product_image WHERE id={$key[$i]->id}");
        }  
    }
    foreach($data->images as $key){
        mysqli_query($con,  "UPDATE product_image SET priority={$key->priority} WHERE id={$key->id}");
    }
   
}
?>
