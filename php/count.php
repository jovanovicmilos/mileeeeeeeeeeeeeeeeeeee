<?php
    include("db.php");
    $json = json_decode(file_get_contents("php://input"));

    header("HTTP/1.1 200 OK");
    $queryproducts = mysqli_query($con, "SELECT COUNT(*) AS count FROM products");
    $querybrands = mysqli_query($con, "SELECT COUNT(*) AS count FROM brands");
    $queryusers = mysqli_query($con, "SELECT COUNT(*) AS count FROM users");
    $queryorders = mysqli_query($con, "SELECT COUNT(*) AS count FROM orders");
    $products = mysqli_fetch_array($queryproducts);
    $brands = mysqli_fetch_array($querybrands);
    $users = mysqli_fetch_array($queryusers);
    $orders = mysqli_fetch_array($queryorders);
    $data = new stdClass();
    $data->products  = $products['count'];      
    $data->brands = $brands['count'];
    $data->users = $users['count'];
    $data->orders = $orders['count'];
    $jsonData = json_encode($data, JSON_NUMERIC_CHECK);
    echo ($jsonData);
       
?>