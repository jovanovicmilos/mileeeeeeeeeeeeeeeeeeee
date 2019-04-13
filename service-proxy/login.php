<?php
class Login extends Rest {
    private $id;
    private $user;
    private $tableName = 'users';
    public $dbConn;

    function setId($id) { $this->id = $id; }
    function getId() { return $this->id; }
    function setUser($user) { $this->user = $user; }
    function getUser() { return $this->user; }

    public function __construct(){
        $db = new DbConnection();
        $this->dbConn = $db->connect();
    }

    public function login() {
        $user = $this->getUser();
        $email = $this->validateParameter('email', $user['email'], STRING);
        $pass = $this->validateParameter('pass', $user['pass'], STRING);
        try{
        $stmt = $this->dbConn->prepare("SELECT * FROM users WHERE email = :email AND password = :pass");
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":pass", $pass);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if(!is_array($user) || !isset($user)){
            $this->throwError(INVALID_USER_PASS, "Email or Password is incorect.");
        }

        if($user['verify'] == 0){
            $this->returnResoponse(USER_NOT_ACTIVE, "User is not activated. Check your email for activation link!");
        }

        $payload = [
            'iat' => time(),
            'iss' => 'localhost',
            'exp' => time() + (15*60),
            'userId' => $user['id']
        ];

        $token = JWT::encode($payload, SECRETE_KEY);
        $data = ['token' => $token];
        $this->returnResoponse(SUCCESS_RESPONSE, $data);
        }catch (Exception $e){
            $this->returnResoponse(JWT_PROCESSING_ERROR, $e->getMessage());
        }
    }
    
    public function getUserData() {
        $this->validateToken();
        $token = $this->getBearerToken();
        $payload = JWT::decode($token, SECRETE_KEY, ['HS256']);

        $stmt = $this->dbConn->prepare("SELECT * FROM users WHERE id = :userId");
        $stmt->bindParam(":userId", $payload->userId);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->returnResoponse(SUCCESS_RESPONSE, $user);
    }
}

?>