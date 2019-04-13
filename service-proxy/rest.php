<?php
    require_once('constants.php');
    class Rest {
        protected $request;
        protected $serviceName;
        protected $param;
        protected $dbConn;
        protected $userId;

        public function __construct(){
            if($_SERVER['REQUEST_METHOD'] !== 'POST'){
                $this->throwError(REQUEST_METHOD_NOT_VALID, 'Request Method is not valid');
            }
            $handler = fopen('php://input', 'r');
            $this->request = stream_get_contents($handler);
            $this->validateRequest($this->request);

            $db = new DbConnection();
            $this->dbConn = $db->connect();

            //deafult for all services access check if set token
//            if('generatetoken' != strtolower($this->serviceName)){
//                $this->validateToken();
//            }
        }

        public function validateRequest($request){

            if(!isset($_GET['api']) || $_GET['api'] == ''){
                $this->throwError(API_NAME_REQUIRED, "API name requires");
            }
            $this->serviceName = $_GET['api'];

            if($_SERVER['CONTENT_TYPE'] === 'application/json'){
                $data = json_decode($this->request, true);

                if(!isset($data['param']) || !is_array($data['param'])){
                    $this->throwError(API_PARAM_REQUIRED, "API PARAM is required");
                }
                $this->param = $data['param'];
            }
//                $data = json_decode($this->request, true);

//            if(!isset($data['name']) || $data['name'] == ''){
//                $this->throwError(API_NAME_REQUIRED, "API name requires ");
//            }


//            if(!isset($data['param']) || !is_array($data['param'])){
//                $this->throwError(API_PARAM_REQUIRED, $data['param']);
//            }
//           $this->throwError(API_PARAM_REQUIRED, $data['param']);

//                $this->throwError(REQUEST_CONTENTTYPE_NOT_VALID, "Request content type is not valid");
//            }else{

//            }


        }

        public function proccessApi(){
            $api = new API;
            $this->serviceName = $_GET['api'];
            $rMethod = new reflectionMethod('API', $this->serviceName);
            if(!method_exists($api, $this->serviceName)){
                $this->throwError(API_DOST_NOT_EXIST, 'API does not exist!');
            }
            $rMethod->invoke($api);
        }

        public function validateParameter($fieldName, $value, $dataType, $required = true){
            if($required == true && empty($value) == true){
                $this->throwError(VALIDATE_PARAMETER_REQUIRED, $fieldName . " parameter is required.");
            }

            switch ($dataType){
                case BOOLEAN:
                    if(!is_bool($value)){
                        $this->throwError(VALIDATE_PARAMETER_DATATYPE, 'Datatype is not valid for ' . $fieldName);
                    }
                    break;
                case INTEGER:
                    if(!is_numeric($value)){
                        $this->throwError(VALIDATE_PARAMETER_DATATYPE, 'Datatype is not valid for ' . $fieldName . '. It should be numeric.');
                    }
                    break;
                case STRING:
                    if(!is_string($value)){
                        $this->throwError(VALIDATE_PARAMETER_DATATYPE, 'Datatype is not valid for ' . $fieldName . '. It should be string.');
                    }
                    break;
                default:
                    $this->throwError(VALIDATE_PARAMETER_DATATYPE, 'Datatype is not valid for ' . $fieldName);
                    break;
            }
            return $value;

        }

        public function throwError($code, $message){
            header("content-type: application/json");
            $errorMsg = json_encode(['error' => ['status' => $code, 'message' => $message]]);
            echo $errorMsg; exit;
        }

        public function returnResoponse($code, $data){
            header('content-type: application/json');
            $response = json_encode(['response' => ['status' => $code, 'result' => $data]], JSON_NUMERIC_CHECK);
            echo $response; exit;
        }

        public function getAuthorizationHeader() {
            $headers = null;
            if(isset($_SERVER['Authorization'])){
                $headers = trim($_SERVER['Authorization']);
            }
            else if(isset($_SERVER['HTTP_AUTHORIZATION'])){
                $headers = trim($_SERVER['HTTP_AUTHORIZATION']);
            }
            else if(function_exists('apache_request_headers')){
                $requestHeaders = apache_request_headers();

                $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
                if(isset($requestHeaders['Authorization'])){
                    $headers = trim($requestHeaders['Authorization']);
                }
            }
            return $headers;
        }

        public function getBearerToken() {
            $headers = $this->getAuthorizationHeader();

            if(!empty($headers)){
                if(preg_match('/Bearer\s(\S+)/',$headers, $matches)){
                    return $matches[1];
                }
            }
            $this->throwError(AUTHORIZATION_HEADER_NOT_FOUND, 'Access Token Not Found');
        }

        public function validateToken() {
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

                if($user['verify'] == 0){
                    $this->returnResoponse(USER_NOT_ACTIVE, "This user may be deactivated. Please contact admin!");
                }
                $this->userId = $payload->userId;

            }catch (Exception $e){
                $this->returnResoponse(ACCESS_TOKEN_ERRORS, $e->getMessage());
            }
        }

    }
?>