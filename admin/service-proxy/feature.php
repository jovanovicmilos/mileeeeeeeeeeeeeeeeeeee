<?php
    class Feature extends Rest {
        private $id;
        private $name;
        private $name_en;
        private $group_id;
        private $tableName = 'features';
        public $dbConn;
        private $filter;
       

        function setId($id) { $this->id = $id; }
        function getId() { return $this->id; }
        function setName($name) { $this->name = $name; }
        function getName() { return $this->name; }
        function setNameEn($name_en) { $this->name_en = $name_en; }
        function getNameEn() { return $this->name_en; }
        function setGroupId($group_id) { $this->group_id = $group_id; }
        function getGroupId() { return $this->group_id; }
        function setFilter($filter) { $this->filter = $filter; }
        function getFilter() { return $this->filter; }

        public function __construct(){
            $db = new DbConnection();
            $this->dbConn = $db->connect();
        }

        public function getAllFeatureWithGroups() {
            $sql = "SELECT * FROM features_group order by id desc";
            $stmt = $this->dbConn->prepare($sql);
            $stmt->execute();            
            $features = array();
            while($rez = $stmt->fetch(PDO::FETCH_ASSOC)){
                $rez['features'] = array();
                $locations = $this->dbConn->prepare("SELECT id, name, group_id FROM features WHERE group_id={$rez['id']}");
                $locations->execute();
                while($row = $locations->fetch(PDO::FETCH_ASSOC)){
                    $agentsarray['id'] = $row['id'];
                    $agentsarray['name'] = $row['name'];
                    array_push($rez['features'], $agentsarray);
                }

                array_push($features, $rez);
            }
            return $features;
        }
        
//        public function getAllSelect() {
//            $sql = "SELECT * FROM " . $this->tableName . "";
//            $stmt = $this->dbConn->prepare($sql);
//            $stmt->execute();
//            $brands = $stmt->fetchAll(PDO::FETCH_ASSOC);
//            return $brands;
//        }
//
//        public function getOne(){
//            $id = $this->validateParameter('id', $this->getId(), INTEGER);
//            $sql = "SELECT *
//                    FROM brands
//                    WHERE id = :id";
//            $stmt = $this->dbConn->prepare($sql);
//            $stmt->bindParam(':id', $id);
//            $stmt->execute();
//            $brand = $stmt->fetch(PDO::FETCH_ASSOC);
//            return $brand;
//        }
//
//        public function delete(){
//            $id = $this->validateParameter('id', $this->getId(), INTEGER);
//            $stmt = $this->dbConn->prepare('DELETE FROM ' . $this->tableName . ' WHERE id = :id');
//            $stmt->bindParam(':id', $id);
//            if($stmt->execute()){
//                return 'Successfully deleted brand!';
//            }else{
//                return false;
//            }
//        }
//
//        public function edit(){
//            if(!isset($_FILES['file']['name'])){
//                $this->setImagePath($this->getImagePath());
//            }else{
//                $target_dir = "../images/brands/";
//                $time = time();
//                $this->setImagePath(md5($time) . "-" . basename($_FILES['file']['name']));
//                $target_file = $target_dir . $this->getImagePath();
//                $imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);
//                move_uploaded_file($_FILES['file']['tmp_name'], $target_file);
//            }
//
//            $sql = "UPDATE brands SET
//                        name='{$this->getName()}',
//                        image_path='{$this->getImagePath()}'
//                        WHERE id='{$this->getId()}'";
//
//            $stmt = $this->dbConn->prepare($sql);
//            if($stmt->execute()){
//                return 'Successfully updated brand!';
//            }else{
//                return false;
//            }
//        }
//
//        public function add(){
//            if(isset($_FILES['file']['name'])){
//                $target_dir = "../images/brands/";
//                $time = time();
//                $this->setImagePath(md5($time) . "-" . basename($_FILES['file']['name']));
//                $target_file = $target_dir . $this->getImagePath();
//                $imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);
//                move_uploaded_file($_FILES['file']['tmp_name'], $target_file);
//            }
//
//            $sql = "INSERT INTO 
//                    brands(name, image_path)
//                    VALUES ('".$this->getName()."', '{$this->getImagePath()}')";
//
//            $stmt = $this->dbConn->prepare($sql);
//            if($stmt->execute()){
//                return 'Successfully added new brand!';
//            }else{
//                return false;
//            }
//        }
    }

?>