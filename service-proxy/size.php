<?php
    class Size extends Rest {
        private $id;
        private $name;
        private $tableName = 'sizes';
        private $filter;
        public $dbConn;

        function setId($id) { $this->id = $id; }
        function getId() { return $this->id; }
        function setName($name) { $this->name = $name; }
        function getName() { return $this->name; }
        function setFilter($filter) { $this->filter = $filter; }
        function getFilter() { return $this->filter; }

        public function __construct(){
            $db = new DbConnection();
            $this->dbConn = $db->connect();
        }

        public function getAll() {
            $sizes = new stdClass();
            $filter = $this->getFilter();

            $name = $this->validateParameter('name', $filter['name'], STRING, false);
            $page = $this->validateParameter('page', $filter['page'], INTEGER, false);
            $offset = $page * 10;
            $sql = "SELECT * FROM " . $this->tableName . " 
                    WHERE name LIKE '%{$name}%' 
                    ORDER BY id desc LIMIT {$offset},10";
            $stmt = $this->dbConn->prepare($sql);
            $stmt->execute();
            $sizes->data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $count = $this->dbConn->prepare("SELECT * FROM " . $this->tableName);
            $count->execute();
            $sizes->total = $count->rowCount();
            return $sizes;

        }
        
        public function getAllSelect() {
            $sql = "SELECT * FROM " . $this->tableName . "";
            $stmt = $this->dbConn->prepare($sql);
            $stmt->execute();
            $sizes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $sizes;
        }

        public function getOne(){
            $id = $this->validateParameter('id', $this->getId(), INTEGER);
            $sql = "SELECT *
                    FROM " . $this->tableName . " 
                    WHERE id = :id";
            $stmt = $this->dbConn->prepare($sql);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $size = $stmt->fetch(PDO::FETCH_ASSOC);
            return $size;
        }

        public function delete(){
            $id = $this->validateParameter('id', $this->getId(), INTEGER);
            $stmt = $this->dbConn->prepare('DELETE FROM ' . $this->tableName . ' WHERE id = :id');
            $stmt->bindParam(':id', $id);
            if($stmt->execute()){
                return 'Successfully deleted size!';
            }else{
                return false;
            }
        }

        public function edit(){
            $sql = "UPDATE " . $this->tableName . " SET
                        name='{$this->getName()}'
                        WHERE id='{$this->getId()}'";

            $stmt = $this->dbConn->prepare($sql);
            if($stmt->execute()){
                return 'Successfully updated size!';
            }else{
                return false;
            }
        }

        public function add(){
            $sql = 'INSERT INTO ' . $this->tableName . '(id, name) 
                    VALUES(null, :name)';
            $stmt = $this->dbConn->prepare($sql);
            $stmt->bindParam(':name', $this->name);

            if($stmt->execute()){
                return 'Successfully added new size!';
            }else{
                return false;
            }
        }
    }

?>