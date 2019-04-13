<?php
use Restserver\Libraries\REST_Controller;
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . 'libraries/REST_Controller.php';
require APPPATH . 'libraries/Format.php';

class Product extends REST_Controller {

    protected $table = 'products';
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

        $page = $this->get('page');
        $size = $this->get('size');
        $sortBy = $this->get('sortBy');
        $search = $this->get('search');

        $config['per_page'] = (int) $size;
        $config['current_page'] = (int) $page - 1;
        $config['total_pages'] = ceil($config['total_rows'] / $config['per_page']);
        $config['total_rows'] = (int) $this->db->count_all($this->table);
        $config['total_rows_filtered'] = 
        $this->db->like('name', $search)->or_like('description', $search)->order_by($sortBy)->get($this->table)->num_rows();
        $config['content'] = 
        $this->db->like('name', $search)->or_like('description', $search)->order_by($sortBy)->get($this->table, $config['per_page'], $config['current_page'] * $config['per_page'])->result();

        $this->response($config, REST_Controller::HTTP_OK);
    }

    //get by id
    public function show_get($id) {
        $product = $this->db->where('id', $id)->get($this->table)->row();
        $this->response($product, REST_Controller::HTTP_OK);
    }

    //create new Product
    public function create_post()
    {
        $params = json_decode($_POST["post"]);
        
        $price = floatval($this->post('price'));
        $data = [
            'id' => null,
            'title' => $params->title,
            'title_en' => $params->title_en,
            'price' => $params->price,
            'price_new' => $params->price_new,
            'price_discount' => $params->price_discount,
            'description' => $params->description,
            'description_en' => $params->description_en,
            'gender' => $params->gender,
            'item_information' => $params->item_information,
            'item_information_en' => $params->item_information_en,
            'insert_date' => date('Y-m-d H:i:s'),
            'update_date' => date('Y-m-d H:i:s')
        ];
        // Executed insert of new product
        $this->db->insert($this->table, $data);  
        
        $sizes = $params->sizes;
        for($i = 0; $i < sizeof($sizes);$i++)
        {
            $productSizeData = [
                'product_id' => $this->db->insert_id(),
                'size_id' => $sizes[$i]->id,
                'quantity' => $sizes[$i]->quantity
            ];

            $this->db->insert('product_size', $productSizeData);
        }

        $target_dir = "./application/uploads/images/products/";
        if(isset($_FILES['files']['name'])){
            $countfiles = count($_FILES['files']['name']);
            $filename_arr = array(); 
            for ($i = 0; $i < $countfiles; $i++) 
            {
                $time = time() + $i;
                $filename = md5($time) . "-" . basename($_FILES['files']['name'][$i]);
                move_uploaded_file($_FILES['files']['tmp_name'][$i], $target_dir.$filename);
                $num = $i + 1;
                $imageData = [
                    'product_id' => $this->db->insert_id(),
                    'image_path' => $filename,
                    'priority' => $num
                ];
    
                $this->db->insert('product_image', $imageData); 
                $filename_arr[] = $filename;
            }

            $arr = array('name' => $filename_arr);
        }
        
        $this->set_response($params, REST_Controller::HTTP_CREATED);
    }

    //update new Product
    public function update_post()
    {
        $data = [
            'name' => $this->post('name'),
            'name_en' => $this->post('name_en'),
            'price' => $this->post('price'),
            'price_new' => $this->post('price_new'),
            'price_discount' => $this->post('price_discount'),
            'description' => $this->post('description'),
            'description_en' => $this->post('description_en'),
            'gender' => $this->post('gender'),
            'item_information' => $this->post('item_information'),
            'item_information_en' => $this->post('item_information_en'),
            'update_date' => date('Y-m-d H:i:s')
        ];

        $this->db->where('id', $this->post('id'))->update($this->table, $data); 
        $this->set_response($data, REST_Controller::HTTP_OK);
    }

    public function delete_get($id) {
        $this->db->where('id', $id)->delete($this->table); 
        $this->set_response($id, REST_Controller::HTTP_OK);
    }

}
