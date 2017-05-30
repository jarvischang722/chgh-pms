-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- 主機: localhost
-- 建立日期: 2017 年 05 月 29 日 00:14
-- 伺服器版本: 5.5.53-0ubuntu0.14.04.1
-- PHP 版本: 5.5.9-1ubuntu4.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 資料庫: `pms_chgh`
--

-- --------------------------------------------------------

--
-- 資料表結構 `patient_todo_record`
--

CREATE TABLE IF NOT EXISTS `patient_todo_record` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `medical_record_id` varchar(11) COLLATE utf8_unicode_ci NOT NULL COMMENT '病患號碼',
  `todo_id` int(11) NOT NULL COMMENT '�ݿ�ƶ�����id',
  `todo_date` date NOT NULL COMMENT '�N��ƶ����ɶ�',
  `patient_name` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '病患姓名',
  `patient_sex` int(1) NOT NULL COMMENT '0=女,1=男，病患性別',
  `patient_birthday` varchar(15) COLLATE utf8_unicode_ci NOT NULL COMMENT '病患生日',
  `nur_id` varchar(10) COLLATE utf8_unicode_ci NOT NULL COMMENT '護理站id兼名稱',
  `bed_no` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '病床號碼',
  `is_finish` varchar(1) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'N' COMMENT '�O�_�����Ӷ���(Y=�����AN=������)',
  `last_update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '�ݿ�ƶ��̫��s�ɶ�',
  `update_user` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '�ݿ�ƶ��̫��s��',
  PRIMARY KEY (`id`),
  UNIQUE KEY `todo_limit` (`medical_record_id`,`todo_id`,`todo_date`) COMMENT '特定病患，每天的待辦事項不能重覆'
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='�f�H���ݿ�ƶ�����' AUTO_INCREMENT=187 ;

--
-- 資料表的匯出資料 `patient_todo_record`
--

INSERT INTO `patient_todo_record` (`id`, `medical_record_id`, `todo_id`, `todo_date`, `patient_name`, `patient_sex`, `patient_birthday`, `nur_id`, `bed_no`, `is_finish`, `last_update_time`, `update_user`) VALUES
(175, '1691028', 1, '2017-05-28', '陳０女', 1, '19270715', '101', '10-05', 'Y', '2017-05-28 09:53:11', 'test'),
(176, '1691028', 1, '2017-05-29', '陳０女', 1, '19270715', '101', '10-05', 'N', '2017-05-28 09:53:11', 'test'),
(177, '1691028', 2, '2017-05-28', '陳０女', 1, '19270715', '101', '10-05', 'Y', '2017-05-28 09:53:11', 'test'),
(178, '1691028', 2, '2017-05-29', '陳０女', 1, '19270715', '101', '10-05', 'N', '2017-05-28 09:53:11', 'test'),
(179, 'A431654', 1, '2017-05-28', '吳０彬', 0, '19791221', '101', '10-07', 'Y', '2017-05-28 09:53:11', 'test'),
(180, 'A431654', 1, '2017-05-29', '吳０彬', 0, '19791221', '101', '10-07', 'N', '2017-05-28 09:53:11', 'test'),
(181, 'A431654', 2, '2017-05-28', '吳０彬', 0, '19791221', '101', '10-07', 'N', '2017-05-28 09:53:11', 'test'),
(182, 'A431654', 2, '2017-05-29', '吳０彬', 0, '19791221', '101', '10-07', 'N', '2017-05-28 09:53:11', 'test'),
(183, 'B203195', 4, '2017-05-29', '謝０春美', 1, '19381214', '101', '10-08', 'N', '2017-05-28 11:53:26', 'test'),
(184, 'B203195', 4, '2017-05-28', '謝０春美', 1, '19381214', '101', '10-08', 'N', '2017-05-28 11:53:26', 'test'),
(186, '2880385', 4, '2017-05-28', '施０鳳', 1, '19381111', '101', '10-09', 'N', '2017-05-28 11:53:26', 'test');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
