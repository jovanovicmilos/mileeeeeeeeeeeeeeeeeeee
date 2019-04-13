<?php
class Product extends Rest {
    private $id;
    private $name;
    private $image_path;
    private $image_file;
    private $tableName = 'products';
    private $filter;
    private $product;
    public $dbConn;

    function setId($id) { $this->id = $id; }
    function getId() { return $this->id; }
    function setName($name) { $this->name = $name; }
    function getName() { return $this->name; }
    function setImagePath($image_path) { $this->image_path = $image_path; }
    function getImagePath() { return $this->image_path; }
    function setImageFile($f) { $this->image_file = $f; }
    function getImageFile() { return $this->image_file; }
    function setFilter($filter) { $this->filter = $filter; }
    function getFilter() { return $this->filter; }
    function setProduct($product) { $this->product = $product; }
    function getProduct() { return $this->product; }

    public function __construct(){
        $db = new DbConnection();
        $this->dbConn = $db->connect();
    }

    public function getAll() {
        $products = new stdClass();
        $filter = $this->getFilter();

        $title = $this->validateParameter('title', $filter['title'], STRING, false);
        $page = $this->validateParameter('page', $filter['page'], INTEGER, false);
        $top = $this->validateParameter('top', $filter['top'], INTEGER, false);
        $brand_id = $this->validateParameter('brand_id', $filter['brand_id'], STRING, false);
        $size_id = $this->validateParameter('size_id', $filter['size_id'], STRING, false);
        $gender = $this->validateParameter('gender', $filter['gender'], STRING, false);
        $price_discount = $this->validateParameter('price_discount', $filter['price_discount'], BOOLEAN, false);
        $offset = ($page - 1) * $top;

        $sql = "SELECT 
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
                    LEFT JOIN sizes s ON ps.size_id=s.id ";

        $conditions = array();
        if(!empty($title)){
            $conditions[] = "r.title LIKE '%{$title}%'";
        }

        if(!empty($brand_id)){
            $conditions[] = "r.brand_id LIKE '%{$brand_id}%'";
        }

        if(!empty($size_id)){
            $conditions[] = "s.id in [2]";
        }
        
        if(!empty($price_discount)){
            $conditions[] = "r.price_discount={$price_discount}";
        }
        
        if(!empty($filter['priceFrom'])){
            $conditions[] = "r.price >= {$filter['priceFrom']}";
        }
        if(!empty($filter['priceTo'])){
            $conditions[] = "r.price <= {$filter['priceTo']}";
        }
        
        if($gender != ''){
            $conditions[] = "r.gender={$gender}";
        }
        
        if(!empty($filter['update_date'])){
            $unFormatedDate = strtotime($filter['update_date']);
            $update_date = date('Y-m-d H:i:s', $unFormatedDate);
            $conditions[] = "r.update_date >= '{$update_date}'";
        }
        
    
        if(!empty($filter['insert_date'])){
            $unFormatedDate = strtotime($filter['insert_date']);
            $update_date = date('Y-m-d H:i:s', $unFormatedDate);
            $conditions[] = "r.insert_date >= '{$update_date}'";
        }
        
        if (count($conditions) > 0) {
            $sql .= " WHERE " . implode(' AND ', $conditions);
        }
        
        $count = $this->dbConn->prepare($sql);
        $count->execute();
        $products->total = $count->rowCount();

        $sql .= " GROUP BY r.id order by id desc LIMIT {$offset},{$filter['top']}";

        $stmt = $this->dbConn->prepare($sql);
        $stmt->execute();


        $products->data = array();
        while($result = $stmt->fetch(PDO::FETCH_ASSOC)){
            $result['image_path'] = "";
            $images = $this->dbConn->prepare("SELECT * FROM product_image WHERE product_id={$result['id']} order by priority asc LIMIT 1");
            $images->execute();
            while($row = $images->fetch(PDO::FETCH_ASSOC)){
                $result['image_path'] = $row['image_path'];
            }
            
            $result['brand'] = new stdClass();
            $brand_stmt = $this->dbConn->prepare("SELECT id, name, image_path FROM brands WHERE id={$result['brand_id']}");  
            $brand_stmt->execute();
            while($row = $brand_stmt->fetch(PDO::FETCH_ASSOC)){
                $result['brand']->id = $row['id'];
                $result['brand']->name = $row['name'];  
                $result['brand']->image_path = $row['image_path'];  
            }
            
            $result['sizes'] = array();
            $size_stmt = $this->dbConn->prepare("SELECT size_id, quantity FROM product_size WHERE product_id={$result['id']}");
            $size_stmt->execute();
            while($size = $size_stmt->fetch(PDO::FETCH_ASSOC)){
                $sizes =$this->dbConn->prepare("SELECT id, name FROM sizes WHERE id={$size['size_id']}");
                $sizes->execute();
                while($row = $sizes->fetch(PDO::FETCH_ASSOC)){
                    $sizesarray['id'] = $row['id'];
                    $sizesarray['name'] = $row['name'];
                    $sizesarray['quantity'] = $size['quantity'];
                }
                array_push($result['sizes'], $sizesarray);
            }
            
            $result['images'] = array();
            $image_stmt = $this->dbConn->prepare("SELECT * FROM product_image WHERE product_id={$result['id']} ORDER BY priority ASC LIMIT 1"); 
            $image_stmt->execute();
            while($row = $image_stmt->fetch(PDO::FETCH_ASSOC)){
                    $imagesarray['id'] = $row['id'];
                    $imagesarray['priority'] = $row['priority'];
                    $imagesarray['image_path'] = $row['image_path'];
                    array_push($result['images'], $imagesarray);
            }
            
            array_push($products->data, $result);
        }     
        return $products;
    }

    public function getOne(){
        $id = $this->validateParameter('id', $this->getId(), INTEGER);
        $sql = "SELECT *
                    FROM products
                    WHERE id = :id";
        $stmt = $this->dbConn->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $product = new stdClass();

        $sizesarray= array();
        $imagesarray = array();
        while($result = $stmt->fetch(PDO::FETCH_ASSOC)){

            $result['images'] = array();
            $image_stmt = $this->dbConn->prepare("SELECT * FROM product_image WHERE product_id={$result['id']}"); 
            $image_stmt->execute();
            while($row = $image_stmt->fetch(PDO::FETCH_ASSOC)){
                    $imagesarray['id'] = $row['id'];
                    $imagesarray['priority'] = $row['priority'];
                    $imagesarray['image_path'] = $row['image_path'];
                    array_push($result['images'], $imagesarray);
            }

            $result['brand'] = new stdClass();
            $brand_stmt = $this->dbConn->prepare("SELECT id, name, image_path FROM brands WHERE id={$result['brand_id']}");  
            $brand_stmt->execute();
            while($row = $brand_stmt->fetch(PDO::FETCH_ASSOC)){
                $result['brand']->id = $row['id'];
                $result['brand']->name = $row['name'];  
                $result['brand']->image_path = $row['image_path'];  
            }

            $result['sizes'] = array();
            $size_stmt = $this->dbConn->prepare("SELECT size_id, quantity FROM product_size WHERE product_id={$result['id']}");
            $size_stmt->execute();
            while($size = $size_stmt->fetch(PDO::FETCH_ASSOC)){
                $sizes =$this->dbConn->prepare("SELECT id, name FROM sizes WHERE id={$size['size_id']}");
                $sizes->execute();
                while($row = $sizes->fetch(PDO::FETCH_ASSOC)){
                    $sizesarray['id'] = $row['id'];
                    $sizesarray['name'] = $row['name'];
                    $sizesarray['quantity'] = $size['quantity'];
                }
                array_push($result['sizes'], $sizesarray);
            }
           return $result;
        }   
        
    }

    public function delete() {
        $id = $this->validateParameter('id', $this->getId(), INTEGER);
        $stmt = $this->dbConn->prepare('DELETE FROM ' . $this->tableName . ' WHERE id = :id');
        $stmt->bindParam(':id', $id);
      
        $comments  = $this->dbConn->prepare("DELETE FROM product_comment WHERE product_id=$id");
        $ratings = $this->dbConn->prepare("DELETE FROM product_rating WHERE product_id=$id");
        $sizes = $this->dbConn->prepare("DELETE FROM product_size WHERE product_id=$id");
        $images = $this->dbConn->prepare("DELETE FROM product_image WHERE product_id=$id");
        $deleteimages = $this->dbConn->prepare("SELECT * FROM product_image WHERE product_id=$id");
        
        if ($deleteimages->fetchColumn() > 0){
            while($rez = $deleteimages->fetch(PDO::FETCH_ASSOC)){
                unlink('../images/products/' . $rez['image_path']);
            }
        }
        
        $stmt->execute();
        $comments->execute();
        $ratings->execute();
        $sizes->execute();
        $images->execute();
        
        return "Successfully deleted";

    }

    public function edit() { 
        
        $data = $this->getProduct();
        $update_date = date('Y-m-d H:i:s');
        $description = addcslashes($data->description, "'");
        $description_en = addcslashes($data->description_en, "'");
        $short_description = addcslashes($data->short_description, "'");
        $short_description_en = addcslashes($data->short_description_en, "'");
        $price_new = empty($data->price_new) ? "0" : $data->price_new;
        $brand_id = empty($data->brand_id) ? "0" : $data->brand_id;
        $age = empty($data->age) ? "0" : $data->age;

        $sql = "UPDATE products SET 
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
                WHERE id='$data->id'";
            //agents
        
            $stmt = $this->dbConn->prepare($sql);
            $stmt->execute();
               
          
            $deletesizes = $this->dbConn->prepare("DELETE FROM product_size WHERE product_id={$data->id}");
            $deletesizes->execute();
            for($i = 0; $i < sizeof($data->sizes);$i++)
            {
                $insertsize = $this->dbConn->prepare("INSERT INTO product_size(product_id, size_id, quantity) VALUES ({$data->id},{$data->sizes[$i]->id},{$data->sizes[$i]->quantity})");
                $insertsize->execute();
            }  
            
            $target_dir = "../images/products/";
            if(isset($_FILES['files']['name'])){
                $countfiles = count($_FILES['files']['name']);
                $filename_arr = array(); 
                for ( $i = 0;$i < $countfiles;$i++ ){
                    $time = time() + $i;
                    $filename = md5($time) . "-" . basename($_FILES['files']['name'][$i]);
                    move_uploaded_file($_FILES['files']['tmp_name'][$i],$target_dir.$filename);
                    $num = $i + 1;
                    $insertimage = $this->dbConn->prepare("INSERT INTO product_image VALUES (null, '".$data->id."', '".$filename."', '".$num."')");
                    $insertimage->execute();
                    $filename_arr[] = $filename;
                }

                $arr = array('name' => $filename_arr);
               
            }

            foreach($data->imagefordelete as $key){
                for($i = 0; $i < sizeof($key);$i++)
                {
                    $deleteimage = $this->dbConn->prepare("DELETE FROM product_image WHERE id={$key[$i]->id}");
                    $deleteimage->execute();
                }  
            }
            foreach($data->images as $key){
                $updateimage = $this->dbConn->prepare("UPDATE product_image SET priority={$key->priority} WHERE id={$key->id}");
                $updateimage->execute();
            }
        
           return 'Successfully edited brand!';
    }

    public function add(){
        $arr = $this->getProduct();
        $description = addcslashes($arr->description, "'");
        $description_en = addcslashes($arr->description_en, "'");
        $short_description = addcslashes($arr->short_description, "'");
        $short_description_en = addcslashes($arr->short_description_en, "'");
        $price_new = empty($arr->price_new) ? "0" : $arr->price_new;
        $brand_id = empty($arr->brand_id) ? "0" : $arr->brand_id;
        $age = empty($arr->age) ? "0" : $arr->age;
        $update_date = date('Y-m-d H:i:s');
        $sql = "INSERT INTO products(
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
                    '".$update_date."')";
        
        $insert = $this->dbConn->prepare($sql);
        $insert->execute();
        $last_id = $this->dbConn->lastInsertId();

        for($i = 0; $i < sizeof($arr->sizes);$i++)
        {
            $insertsize = $this->dbConn->prepare("INSERT INTO product_size(product_id, size_id, quantity) VALUES ({$last_id},{$arr->sizes[$i]->id},{$arr->sizes[$i]->quantity})");
            $insertsize->execute();
        }  
        
        foreach($arr->features as $key){
        for($i = 0; $i < sizeof($key);$i++)
            {
                $insertfeature = $this->dbConn->prepare("INSERT INTO product_feature VALUES (null, {$last_id},{$key[$i]->id})");
                $insertfeature->execute();
            }  
        }

        $target_dir = "../images/products/";
        if(isset($_FILES['files']['name'])){
            $countfiles = count($_FILES['files']['name']);
            $filename_arr = array(); 
            for ( $i = 0;$i < $countfiles;$i++ ){
                $time = time() + $i;
                $filename = md5($time) . "-" . basename($_FILES['files']['name'][$i]);
                move_uploaded_file($_FILES['files']['tmp_name'][$i],$target_dir.$filename);
                $num = $i + 1;
                $insertimage = $this->dbConn->prepare("INSERT INTO product_image VALUES (null, '".$last_id."', '".$filename."', '".$num."')");
                $insertimage->execute();
                $filename_arr[] = $filename;
            }
            $arr = array('name' => $filename_arr);
        }
        
        return 'Successfully added new brand!';
    }
}

?>