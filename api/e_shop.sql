-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 08, 2019 at 07:07 PM
-- Server version: 5.7.19
-- PHP Version: 7.1.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
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
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_en` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `price_new` decimal(10,2) DEFAULT NULL,
  `price_discount` tinyint(1) NOT NULL DEFAULT '0',
  `description` text COLLATE utf8mb4_unicode_ci,
  `description_en` text COLLATE utf8mb4_unicode_ci,
  `gender` varchar(6) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_information` text COLLATE utf8mb4_unicode_ci,
  `item_information_en` text COLLATE utf8mb4_unicode_ci,
  `insert_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `name_en`, `price`, `price_new`, `price_discount`, `description`, `description_en`, `gender`, `item_information`, `item_information_en`, `insert_date`, `update_date`) VALUES
(1, 'Milos123231', 'Gace_en', '100.01', '100.12', 0, 'Gace_en', 'Gace_en', 'men', 'Gace_en', 'Gace_en', '0000-00-00 00:00:00', '2019-03-24 14:50:08'),
(4, 'Milos123231', 'Gace_en', '100.01', '100.12', 0, 'Gace_en', 'Gace_en', 'men', 'Gace_en', 'Gace_en', '2019-03-24 15:00:51', '2019-03-24 15:00:51'),
(5, 'Milos123231', 'Gace_en', '100.01', '100.12', 0, 'Gace_en', 'Gace_en', 'men', 'Gace_en', 'Gace_en', '2019-03-24 15:01:20', '2019-03-24 15:01:20'),
(6, 'Milos123231', 'Gace_en', '100.01', '100.12', 0, 'Gace_en', 'Gace_en', 'men', 'Gace_en', 'Gace_en', '2019-03-24 15:03:45', '2019-03-24 15:03:45'),
(2, 'a', 'a', '100.01', '100.33', 0, 'asd', 'asd', 'women', 'asd', 'asd', '2019-03-24 15:24:09', '2019-03-24 00:00:00'),
(3, 'Milos123231', 'Gace_en', '100.01', '100.12', 0, 'Gace_en', 'Gace_en', 'men', 'Gace_en', 'Gace_en', '0000-00-00 00:00:00', '2019-03-24 14:50:42');

-- --------------------------------------------------------

--
-- Table structure for table `sizes`
--

DROP TABLE IF EXISTS `sizes`;
CREATE TABLE IF NOT EXISTS `sizes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `size` varchar(12) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sizes`
--

INSERT INTO `sizes` (`id`, `size`) VALUES
(53, '60'),
(54, '62');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
