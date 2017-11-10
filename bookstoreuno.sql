-- phpMyAdmin SQL Dump
-- version 4.5.0.2
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jun 22, 2017 at 01:23 AM
-- Server version: 10.0.17-MariaDB
-- PHP Version: 5.6.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bookstoreuno`
--

-- --------------------------------------------------------

--
-- Table structure for table `address`
--

CREATE TABLE `address` (
  `ID` int(11) NOT NULL,
  `OwnerID` int(11) NOT NULL,
  `Country` varchar(45) NOT NULL,
  `State` varchar(2) NOT NULL,
  `Street` varchar(100) NOT NULL,
  `ZipCode` int(5) NOT NULL,
  `Type` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `authors`
--

CREATE TABLE `authors` (
  `ID` int(11) NOT NULL,
  `FirstName` varchar(45) NOT NULL,
  `MiddleInitial` varchar(1) DEFAULT NULL,
  `LastName` varchar(45) NOT NULL,
  `Bio` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `ID` int(11) NOT NULL,
  `ISBN` varchar(45) NOT NULL,
  `Title` varchar(100) NOT NULL,
  `Genre` varchar(100) DEFAULT NULL,
  `Details` mediumtext,
  `Price` int(11) DEFAULT NULL,
  `Rating` int(11) DEFAULT NULL,
  `Cover` varchar(100) DEFAULT NULL,
  `Year` int(11) DEFAULT NULL,
  `PublisherID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`ID`, `ISBN`, `Title`, `Genre`, `Details`, `Price`, `Rating`, `Cover`, `Year`, `PublisherID`) VALUES
(22, '9781455570249', 'Make Your Bed: Little Things That Can Change Your Life...And Maybe the World', 'Self help', 'On May 17, 2014, Admiral William H. McRaven addressed the graduating class of the University of Texas at Austin on their Commencement day. Taking inspiration from the university''s slogan, "What starts here changes the world," he shared the ten principles he learned during Navy Seal training that helped him overcome challenges not only in his training and long Naval career, but also throughout his life; and he explained how anyone can use these basic lessons to change themselves-and the world-for the better.\r\n\r\nAdmiral McRaven''s original speech went viral with over 10 million views. Building on the core tenets laid out in his speech, McRaven now recounts tales from his own life and from those of people he encountered during his military service who dealt with hardship and made tough decisions with determination, compassion, honor, and courage. Told with great humility and optimism, this timeless book provides simple wisdom, practical advice, and words of encouragement that will inspire readers to achieve more, even in life''s darkest moments.', NULL, NULL, 'Covers/22.jpg', NULL, NULL),
(43, '9780385543026', 'Camino Island', 'Science Fiction', 'A gang of thieves stage a daring heist from a secure vault deep below Princeton University’s Firestone Library. Their loot is priceless, but Princeton has insured it for twenty-five million dollars.\r\n     Bruce Cable owns a popular bookstore in the sleepy resort town of Santa Rosa on Camino Island in Florida. He makes his real money, though, as a prominent dealer in rare books. Very few people know that he occasionally dabbles in the black market of stolen books and manuscripts.\r\n     Mercer Mann is a young novelist with a severe case of writer’s block who has recently been laid off from her teaching position. She is approached by an elegant, mysterious woman working for an even more mysterious company. A generous offer of money convinces Mercer to go undercover and infiltrate Bruce Cable’s circle of literary friends, ideally getting close enough to him to learn his secrets.\r\n     But eventually Mercer learns far too much, and there’s trouble in paradise as only John Grisham can deliver it.', NULL, NULL, 'Covers/43.jpg', NULL, NULL),
(44, '9780385490818', 'The Handmaid''s Tale', 'Science Fiction', 'It is the world of the near future, and Offred is a Handmaid in the home of the Commander and his wife. She is allowed out once a day to the food market, she is not permitted to read, and she is hoping the Commander makes her pregnant, because she is only valued if her ovaries are viable. Offred can remember the years before, when she was an independent woman, had a job of her own, a husband and child. But all of that is gone now...everything has changed.', NULL, NULL, 'Covers/44.jpg', NULL, NULL),
(45, '9781593080181', 'Moby-Dick', 'Adventure', 'On a previous voyage, a mysterious white whale had ripped off the leg of a sea captain named Ahab. Now the crew of the Pequod, on a pursuit that features constant adventure and horrendous mishaps, must follow the mad Ahab into the abyss to satisfy his unslakeable thirst for vengeance. Narrated by the cunningly observant crew member Ishmael, Moby-Dick is the tale of the hunt for the elusive, omnipotent, and ultimately mystifying white whale—Moby Dick.', NULL, NULL, 'Covers/45.jpg', NULL, NULL),
(46, '9780446310789', 'To Kill a Mockingbird', 'Drama', 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it, To Kill A Mockingbird became both an instant bestseller and a critical success when it was first published in 1960. It went on to win the Pulitzer Prize in 1961 and was later made into an Academy Award-winning film, also a classic.', NULL, NULL, 'Covers/46.jpg', NULL, NULL),
(47, '9780345479174', 'Trump: The Art of the Deal', 'Self Help', 'Trump reveals the business secrets that have made him America’s foremost deal maker!', NULL, NULL, 'Covers/47.jpg', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `books_authors`
--

CREATE TABLE `books_authors` (
  `ID` int(11) NOT NULL,
  `BookID` int(11) NOT NULL,
  `AuthorID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `books_publishers`
--

CREATE TABLE `books_publishers` (
  `ID` int(11) NOT NULL,
  `BookID` int(11) NOT NULL,
  `PublisherID` int(11) NOT NULL,
  `YearPublished` year(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `creditcard`
--

CREATE TABLE `creditcard` (
  `ID` int(11) NOT NULL,
  `FirstName` varchar(45) NOT NULL,
  `MiddleInitial` varchar(1) NOT NULL,
  `LastName` varchar(45) NOT NULL,
  `Number` int(100) NOT NULL,
  `SecurityCode` int(3) NOT NULL,
  `ExpirationDate` varchar(5) NOT NULL,
  `BillingAddressID` int(11) NOT NULL,
  `OwnerID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `publishers`
--

CREATE TABLE `publishers` (
  `ID` int(11) NOT NULL,
  `Name` varchar(45) NOT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL,
  `AddressID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `ID` int(11) NOT NULL,
  `Email` varchar(30) NOT NULL,
  `username` varchar(20) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `Nickname` varchar(20) DEFAULT NULL,
  `FirstName` varchar(20) DEFAULT NULL,
  `MiddleInitial` varchar(1) DEFAULT NULL,
  `LastName` varchar(20) DEFAULT NULL,
  `token` char(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users_creditcards`
--

CREATE TABLE `users_creditcards` (
  `ID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `CreditCardID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `OwnerID` (`OwnerID`);

--
-- Indexes for table `authors`
--
ALTER TABLE `authors`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `ISBN` (`ISBN`),
  ADD KEY `PublisherID` (`PublisherID`);

--
-- Indexes for table `books_authors`
--
ALTER TABLE `books_authors`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `BookID` (`BookID`),
  ADD KEY `AuthorID` (`AuthorID`);

--
-- Indexes for table `books_publishers`
--
ALTER TABLE `books_publishers`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `BookID` (`BookID`),
  ADD KEY `PublisherID` (`PublisherID`);

--
-- Indexes for table `creditcard`
--
ALTER TABLE `creditcard`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `BillingAddressID` (`BillingAddressID`),
  ADD KEY `OwnerID` (`OwnerID`),
  ADD KEY `BillingAddressID_2` (`BillingAddressID`),
  ADD KEY `OwnerID_2` (`OwnerID`);

--
-- Indexes for table `publishers`
--
ALTER TABLE `publishers`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `AddressID` (`AddressID`),
  ADD KEY `AddressID_2` (`AddressID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `Nickname` (`Nickname`);

--
-- Indexes for table `users_creditcards`
--
ALTER TABLE `users_creditcards`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `CreditCardID` (`CreditCardID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `address`
--
ALTER TABLE `address`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `authors`
--
ALTER TABLE `authors`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;
--
-- AUTO_INCREMENT for table `books_authors`
--
ALTER TABLE `books_authors`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `books_publishers`
--
ALTER TABLE `books_publishers`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `creditcard`
--
ALTER TABLE `creditcard`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `publishers`
--
ALTER TABLE `publishers`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `users_creditcards`
--
ALTER TABLE `users_creditcards`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `address`
--
ALTER TABLE `address`
  ADD CONSTRAINT `address_ibfk_1` FOREIGN KEY (`OwnerID`) REFERENCES `user` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `books_authors`
--
ALTER TABLE `books_authors`
  ADD CONSTRAINT `books_authors_ibfk_1` FOREIGN KEY (`BookID`) REFERENCES `books` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `books_authors_ibfk_2` FOREIGN KEY (`AuthorID`) REFERENCES `authors` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `books_publishers`
--
ALTER TABLE `books_publishers`
  ADD CONSTRAINT `books_publishers_ibfk_1` FOREIGN KEY (`BookID`) REFERENCES `books` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `books_publishers_ibfk_2` FOREIGN KEY (`PublisherID`) REFERENCES `publishers` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `publishers`
--
ALTER TABLE `publishers`
  ADD CONSTRAINT `publishers_ibfk_1` FOREIGN KEY (`AddressID`) REFERENCES `address` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users_creditcards`
--
ALTER TABLE `users_creditcards`
  ADD CONSTRAINT `users_creditcards_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`ID`),
  ADD CONSTRAINT `users_creditcards_ibfk_2` FOREIGN KEY (`CreditCardID`) REFERENCES `creditcard` (`ID`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
