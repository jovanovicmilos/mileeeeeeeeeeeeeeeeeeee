-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Sep 09, 2019 at 04:00 PM
-- Server version: 5.7.25
-- PHP Version: 7.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `e_shop`
--

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `name` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_path` text COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `image_path`) VALUES
(1, 'adidas', '1.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(1024) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'clothing'),
(2, 'shoes'),
(4, 'underware');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `title` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title_en` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `price_new` decimal(10,2) DEFAULT NULL,
  `price_discount` tinyint(1) NOT NULL DEFAULT '0',
  `description` text COLLATE utf8mb4_unicode_ci,
  `description_en` text COLLATE utf8mb4_unicode_ci,
  `color` varchar(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` varchar(6) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `age` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_information` text COLLATE utf8mb4_unicode_ci,
  `item_information_en` text COLLATE utf8mb4_unicode_ci,
  `insert_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `parent_id`, `title`, `title_en`, `price`, `price_new`, `price_discount`, `description`, `description_en`, `color`, `gender`, `age`, `type`, `item_information`, `item_information_en`, `insert_date`, `update_date`) VALUES
(203, 202, 'Neka crna majica', 'Neka crna majica', '120.00', '0.00', 0, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,', '000000', 'female', 'women', 'clothing', '<p><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,</p>', '<p><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,</p>', '2019-05-14 17:35:38', '2019-05-14 17:35:38'),
(202, NULL, 'Neka crna majica', 'Neka crna majica', '120.00', '0.00', 0, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,', 'FF0000', 'female', 'women', 'clothing', '<p><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,</p>', '<p><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,</p>', '2019-05-14 17:27:08', '2019-05-14 17:27:08'),
(205, 202, 'Neka crna majica', 'Neka crna majica', '120.00', '0.00', 0, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,', '12EA65', 'female', 'women', 'clothing', '<p><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,</p>', '<p><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,</p>', '2019-05-14 18:07:23', '2019-05-14 18:07:23');

-- --------------------------------------------------------

--
-- Table structure for table `product_image`
--

CREATE TABLE `product_image` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `priority` int(11) DEFAULT NULL,
  `position` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_image`
--

INSERT INTO `product_image` (`id`, `product_id`, `image_path`, `priority`, `position`) VALUES
(504, 185, 'cbbc2dc078198449946a277a73028b03-cover.jpg', 0, 'cover'),
(505, 185, 'cbbc2dc078198449946a277a73028b03-slider0.png', 1, 'slider'),
(506, 185, 'cbbc2dc078198449946a277a73028b03-main0.png', 1, 'main'),
(507, 185, '28f9b87658672cb85347836a8248886e-cover.jpg', 0, 'cover'),
(508, 184, 'e48c8795200e44ee7356936dbc064b70-main0.png', 1, 'main'),
(512, 198, '5fc6f99f91cd6ef28d318e560fcf6cb5-cover.jpg', 0, 'cover'),
(513, 198, '5fc6f99f91cd6ef28d318e560fcf6cb5-slider0.png', 1, 'slider'),
(514, 198, 'cbf6a7a882bf5be6aea31e9926d92739-slider1.png', 2, 'slider'),
(515, 198, '5fc6f99f91cd6ef28d318e560fcf6cb5-main0.png', 1, 'main'),
(516, 199, '5c2c604fb294cae720167a23a484296b-cover.jpg', 0, 'cover'),
(517, 199, '5c2c604fb294cae720167a23a484296b-slider0.png', 1, 'slider'),
(518, 199, '5c2c604fb294cae720167a23a484296b-main0.png', 1, 'main'),
(519, 200, '12e05d436d0d7d90502fc79c65d3aa83-cover.jpg', 0, 'cover'),
(520, 200, '12e05d436d0d7d90502fc79c65d3aa83-slider0.png', 1, 'slider'),
(521, 200, '4c2075e6236ea7ca903db4c24319558c-slider1.png', 2, 'slider'),
(522, 200, '12e05d436d0d7d90502fc79c65d3aa83-main0.png', 1, 'main'),
(538, 201, '9e5a4d6a62c3aa9319aa04e03e7d9c6c-cover.jpg', 0, 'cover'),
(539, 201, '9e5a4d6a62c3aa9319aa04e03e7d9c6c-slider0.png', 1, 'slider'),
(540, 201, '221f47e10e864a679a52251b26e1c226-slider1.png', 2, 'slider'),
(541, 201, 'def7bcd6bb455773cb8b440bb41f42c4-slider2.png', 3, 'slider'),
(542, 201, '9e5a4d6a62c3aa9319aa04e03e7d9c6c-main0.png', 1, 'main'),
(547, 197, '512b763aa37f8f76025fff0e5f8fd038-slider0.png', 3, 'slider'),
(549, 197, 'c39406e2b8b3b0c9514236dedc907a16-cover.jpg', 0, 'cover'),
(550, 197, '71b3290347cc4905f4e6657e14120d11-slider0.png', 3, 'slider'),
(551, 197, 'b30fac2082e401e19e31cf2633ca8557-slider0.png', 4, 'slider'),
(552, 197, '1c279a5e336c7c8c1002f91dd609be7b-main0.png', 4, 'main'),
(553, 200, '2b7222ae930d89f13e75f39e0e2a3520-main0.png', 3, 'main'),
(554, 202, '015ef64f7957f957cd09e32f65f6e7b2-cover.jpg', 0, 'cover'),
(555, 202, '015ef64f7957f957cd09e32f65f6e7b2-slider0.png', 1, 'slider'),
(556, 202, '998145b381892ad291c81ac1a41c8cac-slider1.png', 2, 'slider'),
(557, 202, '015ef64f7957f957cd09e32f65f6e7b2-main0.png', 1, 'main'),
(558, 203, '2afd751cf8935480088a418cbd6aef55-cover.jpg', 0, 'cover'),
(559, 203, '2afd751cf8935480088a418cbd6aef55-slider0.png', 1, 'slider'),
(560, 203, '6f7cb9170a6b457203f3a4e7757dd5a9-slider1.png', 2, 'slider'),
(561, 203, '2afd751cf8935480088a418cbd6aef55-main0.png', 1, 'main'),
(566, 205, '90b582a3c5ec2f72f5872712027292c4-cover.jpg', 0, 'cover'),
(567, 205, '90b582a3c5ec2f72f5872712027292c4-slider0.png', 1, 'slider'),
(568, 205, '35c6d1013002a37e3182d2f84f92930b-slider1.png', 2, 'slider'),
(569, 205, '90b582a3c5ec2f72f5872712027292c4-main0.png', 1, 'main');

-- --------------------------------------------------------

--
-- Table structure for table `product_size`
--

CREATE TABLE `product_size` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `size_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_size`
--

INSERT INTO `product_size` (`id`, `product_id`, `size_id`) VALUES
(70, 160, 54),
(69, 159, 54),
(71, 165, 56),
(72, 166, 54),
(73, 167, 53),
(74, 168, 57),
(80, 174, 56),
(81, 178, 56),
(158, 182, 54),
(157, 182, 57),
(415, 183, 57),
(414, 183, 53),
(413, 183, 56),
(412, 183, 54),
(425, 184, 56),
(424, 184, 54),
(411, 185, 54),
(410, 185, 56),
(409, 196, 56),
(502, 197, 56),
(501, 197, 57),
(428, 198, 56),
(429, 198, 57),
(430, 199, 56),
(431, 199, 54),
(432, 199, 53),
(507, 200, 57),
(506, 200, 56),
(505, 201, 54),
(504, 201, 56),
(503, 201, 57),
(513, 202, 58),
(512, 202, 57),
(511, 202, 56),
(514, 203, 58),
(515, 203, 59),
(516, 203, 57);

-- --------------------------------------------------------

--
-- Table structure for table `sizes`
--

CREATE TABLE `sizes` (
  `id` int(11) NOT NULL,
  `size` varchar(12) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sizes`
--

INSERT INTO `sizes` (`id`, `size`) VALUES
(56, '90'),
(53, '60'),
(54, '62'),
(57, '92'),
(58, '94'),
(59, '66');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_image`
--
ALTER TABLE `product_image`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_size`
--
ALTER TABLE `product_size`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sizes`
--
ALTER TABLE `sizes`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=206;

--
-- AUTO_INCREMENT for table `product_image`
--
ALTER TABLE `product_image`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=570;

--
-- AUTO_INCREMENT for table `product_size`
--
ALTER TABLE `product_size`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=517;

--
-- AUTO_INCREMENT for table `sizes`
--
ALTER TABLE `sizes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
