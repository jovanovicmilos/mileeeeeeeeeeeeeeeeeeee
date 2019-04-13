<?php
use Restserver\Libraries\REST_Controller;
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . 'libraries/REST_Controller.php';
require APPPATH . 'libraries/Format.php';

class Size extends REST_Controller {

    protected $table = 'sizes';
    function __construct()
    {
        // Construct the parent class
        parent::__construct();

        // Configure limits on our controller methods
        // Ensure you have created the 'limits' table and enabled 'limits' within application/config/rest.php
        // $this->methods['index_get']['limit'] = 500; // 500 requests per hour per user/key
        // $this->methods['show_get']['limit'] = 100; // 100 requests per hour per user/key
        // $this->methods['create_post']['limit'] = 50; // 50 requests per hour per user/key
    }

    public function index_get() {
        $this->response($this->db->get($this->table)->result(), REST_Controller::HTTP_OK);
    }

    //get by id
    public function show_get($id) {
        $product = $this->db->where('id', $id)->get($this->table)->row();
        $this->response($product, REST_Controller::HTTP_OK);
    }

    //create new Product
    public function create_post()
    {
        $data = [
            'id' => null,
            'size' => $this->post('size'),
        ];

        $this->db->insert($this->table, $data);  
        $this->set_response($this->db->insert_id(), REST_Controller::HTTP_CREATED);
    }

    //update new Product
    public function update_post()
    {
        $data = [
            'id' => $this->post('id'),
            'size' => $this->post('size'),
        ];
        
        $this->db->where('id', $this->post('id'))->update($this->table, $data); 
        $this->set_response($data, REST_Controller::HTTP_OK);
    }

    public function delete_get($id) {
        $this->db->where('id', $id)->delete($this->table); 
        $this->set_response($id, REST_Controller::HTTP_OK);
    }

}
