<?php 
include("../db.php");
$id = json_decode(file_get_contents("php://input")); 
print_r($id);

$query = "DELETE FROM products WHERE id=$id";
//$categories = "DELETE FROM 	product_category WHERE product_id=$id";
$comments  = "DELETE FROM product_comment WHERE product_id=$id";
$ratings = "DELETE FROM product_rating WHERE product_id=$id";
$sizes = "DELETE FROM product_size WHERE product_id=$id";
$images = "DELETE FROM product_image WHERE product_id=$id";
$deleteimages = mysqli_query($con, "SELECT * FROM product_image WHERE product_id=$id");

if (mysqli_num_rows($deleteimages) > 0){
    while($rez = mysqli_fetch_assoc($deleteimages)){
        unlink('../../images/products/' . $rez['image_path']);
    }
}


mysqli_query($con, $query);
//mysqli_query($con, $categories);
mysqli_query($con, $comments);
mysqli_query($con, $ratings);
mysqli_query($con, $sizes);
mysqli_query($con, $images);

?>