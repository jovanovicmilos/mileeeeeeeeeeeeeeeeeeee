<?php
    class Brand extends Rest {
        private $id;
        private $name;
        private $image_path;
        private $image_file;
        private $tableName = 'brands';
        public $dbConn;
        private $filter;
       

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

        public function __construct(){
            $db = new DbConnection();
            $this->dbConn = $db->connect();
        }

        public function getAll() {
            $brands = new stdClass();
            $filter = $this->getFilter();

            $name = $this->validateParameter('name', $filter['name'], STRING, false);
            $page = $this->validateParameter('page', $filter['page'], INTEGER, false);
            $offset = $page * 10;
            $sql = "SELECT * FROM " . $this->tableName . " 
                    WHERE name LIKE '%{$name}%' 
                    ORDER BY id desc LIMIT {$offset},10";
            $stmt = $this->dbConn->prepare($sql);
            $stmt->execute();
            $brands->data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $count = $this->dbConn->prepare("SELECT * FROM " . $this->tableName);
            $count->execute();
            $brands->total = $count->rowCount();
            return $brands;

        }
        
        public function getAllSelect() {
            $sql = "SELECT * FROM " . $this->tableName . "";
            $stmt = $this->dbConn->prepare($sql);
            $stmt->execute();
            $brands = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $brands;
        }

        public function getOne() {
            $id = $this->validateParameter('id', $this->getId(), INTEGER);
            $sql = "SELECT *
                    FROM brands
                    WHERE id = :id";
            $stmt = $this->dbConn->prepare($sql);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $brand = $stmt->fetch(PDO::FETCH_ASSOC);
            return $brand;
        }

        public function delete() {
            $id = $this->validateParameter('id', $this->getId(), INTEGER);
            $stmt = $this->dbConn->prepare('DELETE FROM ' . $this->tableName . ' WHERE id = :id');
            $stmt->bindParam(':id', $id);
            if($stmt->execute()){
                return 'Successfully deleted brand!';
            }else{
                return false;
            }
        }

        public function edit(){
            if(!isset($_FILES['file']['name'])){
                $this->setImagePath($this->getImagePath());
            }else{
                $target_dir = "../images/brands/";
                $time = time();
                $this->setImagePath(md5($time) . "-" . basename($_FILES['file']['name']));
                $target_file = $target_dir . $this->getImagePath();
                $imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);
                move_uploaded_file($_FILES['file']['tmp_name'], $target_file);
            }

            $sql = "UPDATE brands SET
                        name='{$this->getName()}',
                        image_path='{$this->getImagePath()}'
                        WHERE id='{$this->getId()}'";

            $stmt = $this->dbConn->prepare($sql);
            if($stmt->execute()){
                return 'Successfully updated brand!';
            }else{
                return false;
            }
        }

        public function add(){
            if(isset($_FILES['file']['name'])){
                $target_dir = "../images/brands/";
                $time = time();
                $this->setImagePath(md5($time) . "-" . basename($_FILES['file']['name']));
                $target_file = $target_dir . $this->getImagePath();
                $imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);
                move_uploaded_file($_FILES['file']['tmp_name'], $target_file);
            }

            $sql = "INSERT INTO 
                    brands(name, image_path)
                    VALUES ('".$this->getName()."', '{$this->getImagePath()}')";

            $stmt = $this->dbConn->prepare($sql);
            if($stmt->execute()){
                return 'Successfully added new brand!';
            }else{
                return false;
            }
        }
    }

?>