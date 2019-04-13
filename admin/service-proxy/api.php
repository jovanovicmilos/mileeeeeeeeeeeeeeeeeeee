<?php

    class Api extends Rest {
        public $dbConn;

        public $formdata;

        public function __construct(){
            parent::__construct();
        }

        //BRANDS
        public function getAllBrands(){
            $brand = new Brand();
            $brand->setFilter($this->param);
            $this->returnResoponse(SUCCESS_RESPONSE, $brand->getAll());
        }

        public function getOneBrand(){
            $brand = new Brand();
            $brand->setId($this->param['id']);
            $this->returnResoponse(SUCCESS_RESPONSE, $brand->getOne());
        }

        public function addBrand(){
            $data = json_decode($_POST["post"]);
            $brand = new Brand();
            $brand->setName($data->name);
            $this->returnResoponse(SUCCESS_RESPONSE, $brand->add());
        }

        public function editBrand(){
            $data = json_decode($_POST["post"]);
            $brand = new Brand();
            $brand->setId($data->id);
            $brand->setName($data->name);
            $brand->setImagePath($data->image_path);
            $this->returnResoponse(SUCCESS_RESPONSE, $brand->edit());
        }

        public function deleteBrand(){
            $brand = new Brand();
            $brand->setId($this->param['id']);
            $this->returnResoponse(SUCCESS_RESPONSE, $brand->delete());
        }
        
        public function getAllBrandSelect(){
            $brand = new Brand();
            $this->returnResoponse(SUCCESS_RESPONSE, $brand->getAllSelect());
        }
        

        //SIZES
        public function getAllSizes(){
            $size = new Size();
            $size->setFilter($this->param);
            $this->returnResoponse(SUCCESS_RESPONSE, $size->getAll());
        }

        public function addSize(){
            $size = new Size();
            $size->setName($this->param['name']);
            $this->returnResoponse(SUCCESS_RESPONSE, $size->add());
        }

        public function editSize(){
            $size = new Size();
            $size->setId($this->param['id']);
            $size->setName($this->param['name']);
            $this->returnResoponse(SUCCESS_RESPONSE, $size->edit());
        }

        public function getOneSize(){
            $size = new Size();
            $size->setId($this->param['id']);
            $this->returnResoponse(SUCCESS_RESPONSE, $size->getOne());
        }

        public function deleteSize(){
            $size = new Size();
            $size->setId($this->param['id']);
            $this->returnResoponse(SUCCESS_RESPONSE, $size->delete());
        }
        
        public function getAllSizesSelect(){
            $size = new Size();
            $this->returnResoponse(SUCCESS_RESPONSE, $size->getAllSelect());
        }

        //PRODUCTS
        public function getAllProducts(){
            $product = new Product();
            $product->setFilter($this->param);
            $this->returnResoponse(SUCCESS_RESPONSE, $product->getAll());
        }
        public function getOneProduct(){
            $product = new Product();
            $product->setId($this->param['id']);
            $this->returnResoponse(SUCCESS_RESPONSE, $product->getOne());
        }
        
        public function editProduct(){
            $data = json_decode($_POST["post"]);
            $product = new Product();
            $product->setProduct($data);
            $this->returnResoponse(SUCCESS_RESPONSE, $product->edit());
        }
        
        public function addProduct(){
            $data = json_decode($_POST["post"]);
            $product = new Product();
            $product->setProduct($data);
            $this->returnResoponse(SUCCESS_RESPONSE, $product->add());
        }
        
        
        public function deleteProduct(){
            $product = new Product();
            $product->setId($this->param['id']);
            $this->returnResoponse(SUCCESS_RESPONSE, $product->delete());
        }
        
        //FEATURES
        public function getAllFeatureWithGroups(){
            $feature = new Feature();
            $this->returnResoponse(SUCCESS_RESPONSE, $feature->getAllFeatureWithGroups());
        }
        //loggin

        public function generateToken(){
            $login = new Login();
            $login->setUser($this->param);
            $this->returnResoponse(SUCCESS_RESPONSE, $login->login());
        }
        
        public function getLoggedUser(){
            $login = new Login();
            $this->returnResoponse(SUCCESS_RESPONSE, $login->getUserData());
        }
        
        //count
        public function countTotal(){
            $queryproducts =    $this->dbConn->query("SELECT count(*) FROM products");
            $totalProducts =    $queryproducts->fetchColumn();
            $querybrands =      $this->dbConn->query("SELECT count(*) FROM brands");
            $totalBrands =      $querybrands->fetchColumn();
            $queryusers =       $this->dbConn->query("SELECT count(*) FROM users");
            $totalUsers =       $queryusers->fetchColumn();
            $queryorders =      $this->dbConn->query("SELECT count(*) FROM orders");
            $totalOrders =      $queryorders->fetchColumn();
         
            $data = new stdClass();

            $data->products  = !$totalProducts ? $totalProducts = 0 : $totalProducts = $totalProducts; 
            $data->brands = !$totalBrands ? $totalBrands = 0 : $totalBrands = $totalBrands;
            $data->users = !$totalUsers ? $totalUsers = 0 : $totalUsers = $totalUsers;
            $data->orders = !$totalOrders ? $totalOrders = 0 : $totalOrders = $totalOrders;
            $this->returnResoponse(SUCCESS_RESPONSE, $data);
        }

        public function addCustomer(){
            $name = $this->validateParameter('name', $this->param['name'], STRING, false);
            $email = $this->validateParameter('email', $this->param['email'], STRING, false);
            $addr = $this->validateParameter('addr', $this->param['addr'], STRING, false);
            $mobile = $this->validateParameter('mobile', $this->param['mobile'], STRING, false);

            try{
                $token = $this->getBearerToken();
                $payload = JWT::decode($token, SECRETE_KEY, ['HS256']);

                $stmt = $this->dbConn->prepare("SELECT * FROM users WHERE id = :userId");
                $stmt->bindParam(":userId", $payload->userId);
                $stmt->execute();
                $user = $stmt->fetch(PDO::FETCH_ASSOC);

                if(!is_array($user) || !isset($user)){
                    $this->throwError(INVALID_USER_PASS, "This user is not found in out database.");
                }

                if($user['active'] == 0){
                    $this->returnResoponse(USER_NOT_ACTIVE, "This user may be deactivated. Please contact admin!");
                }

                $cust = new Customer();
                $cust->setName($name);
                $cust->setEmail($email);
                $cust->setAddress($addr);
                $cust->setMobile($mobile);
                $cust->setCreatedBy($payload->userId);
                $cust->setCreatedOn(date('Y-m-d'));

                if(!$cust->insert()){
                    $message = "Faild to insert";
                }else{
                    $message = "Inserted successufully";
                }
                $this->returnResoponse(SUCCESS_RESPONSE, $message);
            }catch (Exception $e){
                $this->returnResoponse(ACCESS_TOKEN_ERRORS, $e->getMessage());
            }
        }

        public function updateCustomer(){
            $customerId = $this->validateParameter('customerId', $this->param['customerId'], INTEGER);
            $name = $this->validateParameter('name', $this->param['name'], STRING, false);
            $addr = $this->validateParameter('addr', $this->param['addr'], STRING, false);
            $mobile = $this->validateParameter('mobile', $this->param['mobile'], STRING, false);


            $cust = new Customer();
            $cust->setId($customerId);
            $cust->setName($name);
            $cust->setAddress($addr);
            $cust->setMobile($mobile);
            $cust->setUpdateBy($this->userId);
            $cust->setUpdateOn(date('Y-m-d'));

            if(!$cust->update()){
                $message = "Faild to update";
            }else{
                $message = "Updated successufully";
            }
            $this->returnResoponse(SUCCESS_RESPONSE, $message);

        }

        public function deleteCustomer() {
            $customerId = $this->validateParameter('customerId', $this->param['customerId'], INTEGER);
            $cust = new Customer();
            $cust->setId($customerId);

            if(!$cust->delete()){
                $message = "Failed to delete";
            }else{
                $message = "Deleted successufully";
            }
            $this->returnResoponse(SUCCESS_RESPONSE, $message);
        }

        public function getCustomerDetails()  {

            $customerId = $this->validateParameter('customerId', $this->param['customerId'], INTEGER);

            $cust = new Customer();
            $cust->setId($customerId);
            $customer = $cust->getCustomerById();
            if(!is_array($customer)){
                $this->returnResoponse(SUCCESS_RESPONSE, ['message'=> 'Customer details are not found']);
            }

            $response['customerId'] = $customer['id'];
            $response['customerName'] = $customer['name'];
            $response['email'] = $customer['email'];
            $response['mobile'] = $customer['mobile'];
            $response['address'] = $customer['address'];
            $response['created_by'] = $customer['created_user'];
            $response['lastUpdatedBy'] = $customer['updated_user'];

            $this->returnResoponse(SUCCESS_RESPONSE, $response);
        }


    }

?>