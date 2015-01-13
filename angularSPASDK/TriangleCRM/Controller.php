<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
include 'Autoloader.php';


            ////function index_autoloader($class)
//{
//    $parts = explode('\\', $class);
//    require end($parts) . '.php';
//}
//
//spl_autoload_register('index_autoloader');
use TriangleCRM\TriangleAPI as api;


/**
 * Description of Controller
 *
 * @author e
 */
class Controller {
    public $action;
    public $api;
    
    public function __construct($action) {
        $this->action = $action;
        $this->api = new api();
    }

    public function ProcessRequestJson($vars){
        $result = NULL;
        $vars = json_decode($vars,true);
       if(!empty($this->action)){
          
           $action = strtolower($this->action);
           switch($action){
            case 'createprospect':
                $result = $this->api->CreateProspect($vars);
            break;
            case 'createsubscription':
                $vars['creditCard'] = $this->decryptCard($vars['creditCard']);
                $result = $this->api->CreateSubscription($vars);
            break;
            case 'fireaffiliatepixel':
                $result = $this->api->FireAffiliatePixel($vars);
            break;
            case 'bootstrap':
                    $result = $this->api->GetModel($vars['name']);
                break;
           }
       }   
       return json_encode((array)$result);
    }
    
    public function ProcessRequest($vars){
        $result = NULL;
       if(!empty($this->action)){
           
           $action = strtolower($this->action);
           switch($action){
            case 'createprospect':
                $result =  $this->api->CreateProspect($vars);
            break;
            case 'firepixel':
                $result =  $this->api->FireAffiliatePixel($vars);
            break;
            case 'bootstrap':
                    $result = $this->api->GetModel($vars['name']);
                break;
           }
       }   
       return $result;
    }
    
    
    private function decryptCard($cc_number) {
        $private = "-----BEGIN ENCRYPTED PRIVATE KEY-----
MIIBpjBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQIq0UkspCNef4CAggA
MBQGCCqGSIb3DQMHBAj7PG6jCIaPCgSCAWAHr/a9ookhpkECG9AdVlIsQOhMnliw
bVLyDwnf9rpxxPy5xFP/aM9Q9L7Q9vsxAtQJNU2WBWIqcoodZW8I3Z7EctFduuO9
OvoZju/8yvz0eaeH4VUgm9y8haMcBDjj1upgULyG0LdJJm1dcX2x1jqfrV0ksHPC
yjUuIWXDLxYTvG4QUPt1bKsnbKfuEV+hSsKj9t7xWfBP2H/KmePT3QTygvUd0PCD
7qhHeo0o8iZzAufmx2Jk5zxgmOr0YyDTLnNKMitYJQetdRRiCBFQ5XAt1neAxTTF
C4kf3w6Yx4Xk6POKAG6iqFSd/w1NNYnf+1YDjL9BKxxBH7ZsmU1LWAaSbdkaYln2
m6C5q/oSgMGdrX4kLL0chcN8/8ZdWNNN6ssqr8vIgUKTqG6eoGn26VhmsHltE7ra
yCt4i9PyC5Zs50cLrWnCMyFkm4EYQ60e/muzMb4OFhO9Nx9MVY8s91Ex
-----END ENCRYPTED PRIVATE KEY-----";
        if (function_exists("openssl_pkey_get_private") == true) {
            if (!$privateKey = openssl_pkey_get_private($private, "RmJJd135@$^"))
                die('Loading Private Key failed ');

            //Decrypt
            $decrypted_text = "";
            if (!openssl_private_decrypt(base64_decode($cc_number), $decrypted_text, $privateKey, OPENSSL_SSLV23_PADDING))
                die('Failed to decrypt data');

            //Free key
            openssl_free_key($privateKey);
            //print($decrypted_text."--heres the card number");
            return $decrypted_text;
        }else {
            die("no openssl_pkey installed");
        }
    }
    
    function GetModel($param) {
        return json_encode($this->api->GetModel($param));
    }
    
}

if(isset($_POST['data'])){
    $data = $_POST;
}
else{
    $data = json_decode(file_get_contents('php://input'), true);
}
$controller;

if(!empty($data['action'])){
    
    $controller = new Controller($data['action']);
    //if you want to pass JSON
    // you post should look like action=firepixel&data={data:data}
    if(!empty($data['data'])){
        
        echo $controller->ProcessRequestJson($data['data']);
    }else{
        echo $controller->ProcessRequest($data);
    }
}



