<?php
    
    include("../db.php");
    $json_param = file_get_contents("php://input");   
    $model = json_decode($json_param);
    $page = $model->page;
    $offset = $model->page * $model->top;
    

    $queryy = "SELECT 
    r.id, 
    r.title, 
    r.title_en,
    r.price,
    r.price_new,
	r.price_discount,
    r.gender, 
    r.brand_id, 
    r.age,
    r.description,
    r.description_en,
    r.short_description,
    r.short_description_en,
    r.insert_date,
    r.update_date
    FROM products r
    LEFT JOIN product_size ps ON r.id=ps.product_id 
    LEFT JOIN sizes s ON ps.size_id=s.id";

    $conditions = array();
    if(!empty($model->title)){
        $conditions[] = "r.title LIKE '%{$model->title}%'";
    }
    if(!empty($model->brand_id)){
        $conditions[] = "r.brand_id LIKE '%{$model->brand_id}%'";
    }

    if(!empty($model->size_id)){
        $conditions[] = "s.id={$model->size_id}";
    }

    $sql = $queryy;
    if (count($conditions) > 0) {
      $sql .= " WHERE " . implode(' AND ', $conditions);
    }
    $sql .= " GROUP BY r.id order by id desc LIMIT {$offset},{$model->top}";
    $upit1 = mysqli_query($con, $sql);

    $queryy1 = "SELECT 
    COUNT(*) AS count
    FROM products r
    LEFT JOIN product_size ps ON r.id=ps.product_id 
    LEFT JOIN sizes s ON ps.size_id=s.id";

    
    $sql1 = $queryy1;
    if (count($conditions) > 0) {
      $sql1 .= " WHERE " . implode(' AND ', $conditions);
    }
    $sql1 .= " GROUP BY r.id";
    $upit2 = mysqli_query($con, $sql1);
    $rowcount = mysqli_num_rows($upit2);
   
    $product_array = array();
    $sizesarray = array();
    $featuresarray = array();
    $blog['data'] = new stdClass();
    $product_array['total'] = $rowcount;
    $product_array['data'] = array();

   
    while($result = mysqli_fetch_assoc($upit1)){
        
        $result['image_path'] = "";
        $images = mysqli_query($con, "SELECT * FROM product_image WHERE product_id={$result['id']} order by priority asc LIMIT 1"); 
        while($row = mysqli_fetch_assoc($images)){      
            $result['image_path'] = $row['image_path'];
        }
        
        $result['brand'] = new stdClass();
        $settlements = mysqli_query($con, "SELECT id, name, image_path FROM brands WHERE id={$result['brand_id']}");  
        while($row = mysqli_fetch_assoc($settlements)){
            $result['brand']->id = $row['id'];
            $result['brand']->name = $row['name'];  
            $result['brand']->image_path = $row['image_path'];  
        }
        
        $result['sizes'] = array();
        $sizes = mysqli_query($con, "SELECT size_id, quantity FROM product_size WHERE product_id={$result['id']}");
        while($size = mysqli_fetch_assoc($sizes)){
            $fetch_data = mysqli_query($con, "SELECT id, name FROM sizes WHERE id={$size['size_id']}");
            while($row = mysqli_fetch_assoc($fetch_data)){
                $sizesarray['id'] = $row['id'];
                $sizesarray['name'] = $row['name'];
                $sizesarray['quantity'] = $size['quantity'];
            }
            array_push($result['sizes'], $sizesarray);
        }
        
        array_push($product_array['data'], $result);
    }
    
    $jsonData = json_encode($product_array, JSON_PRETTY_PRINT);
    echo ($jsonData);
?>