<?php

    class DbConnection{
        private $server = 'localhost';
        private $dbname = 'estore_db';
        private $user =  'root';
        private $pass = 'root';

        public function connect(){
            try{
                $conn = new PDO('mysql:host=' .$this->server .';dbname=' .$this->dbname, $this->user, $this->pass);
                $conn->exec("set names utf8");
                $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                return $conn;
            }catch(Exception $e) {
                echo "Database error" . $e->getMessage();
            }

        }
    }

?>