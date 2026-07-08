-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ecommersreact
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `idCliente` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `apellido` varchar(45) NOT NULL,
  `telefono` varchar(30) NOT NULL,
  PRIMARY KEY (`idCliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detallepedido`
--

DROP TABLE IF EXISTS `detallepedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detallepedido` (
  `idDetallePedido` int NOT NULL AUTO_INCREMENT,
  `cantidad` int NOT NULL,
  `precioUnitario` decimal(10,2) NOT NULL,
  `idProducto` int NOT NULL,
  `idPedido` int NOT NULL,
  `nombreProducto` varchar(45) NOT NULL,
  `talle` varchar(15) NOT NULL,
  PRIMARY KEY (`idDetallePedido`),
  KEY `idProducto_idx` (`idProducto`),
  KEY `idPedido_idx` (`idPedido`),
  CONSTRAINT `idPedidoDetalle` FOREIGN KEY (`idPedido`) REFERENCES `pedido` (`idPedido`),
  CONSTRAINT `idProductoDetalle` FOREIGN KEY (`idProducto`) REFERENCES `producto` (`idProducto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detallepedido`
--

LOCK TABLES `detallepedido` WRITE;
/*!40000 ALTER TABLE `detallepedido` DISABLE KEYS */;
/*!40000 ALTER TABLE `detallepedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imagenesproducto`
--

DROP TABLE IF EXISTS `imagenesproducto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imagenesproducto` (
  `idImagen` int NOT NULL AUTO_INCREMENT,
  `src` varchar(100) NOT NULL,
  `esPrincipal` tinyint NOT NULL,
  `idProducto` int NOT NULL,
  PRIMARY KEY (`idImagen`),
  KEY `idProducto_idx` (`idProducto`),
  CONSTRAINT `idProducto` FOREIGN KEY (`idProducto`) REFERENCES `producto` (`idProducto`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagenesproducto`
--

LOCK TABLES `imagenesproducto` WRITE;
/*!40000 ALTER TABLE `imagenesproducto` DISABLE KEYS */;
INSERT INTO `imagenesproducto` VALUES (1,'/productos/buzo.jpg',1,1),(2,'/productos/campera.jpg',1,3),(3,'/productos/remRustyNegra.png',1,4),(4,'/productos/remRipcurlBordo.png',1,2),(5,'/productos/remRustyNegra1.png',0,4),(7,'/productos/remBillaBongBlanca.png',1,5),(8,'/productos/remBillaBongRosa.png',1,6),(9,'/productos/remCaliforniaAzulFrancia.png',1,7),(10,'/productos/remSantaCruzVioleta.png',1,8);
/*!40000 ALTER TABLE `imagenesproducto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido`
--

DROP TABLE IF EXISTS `pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido` (
  `idPedido` int NOT NULL AUTO_INCREMENT,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('pendiente','confirmado','cancelado') NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `idCliente` int NOT NULL,
  `numeroPedido` int NOT NULL,
  PRIMARY KEY (`idPedido`),
  KEY `idCliente_idx` (`idCliente`),
  CONSTRAINT `idCliente` FOREIGN KEY (`idCliente`) REFERENCES `cliente` (`idCliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido`
--

LOCK TABLES `pedido` WRITE;
/*!40000 ALTER TABLE `pedido` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto` (
  `idProducto` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `descripcion` varchar(45) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `esDestacado` tinyint NOT NULL,
  `enOferta` tinyint NOT NULL,
  `precioOferta` decimal(10,2) NOT NULL,
  `categoria` varchar(45) NOT NULL,
  PRIMARY KEY (`idProducto`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES (1,'Producto test','prueba',1000.00,1,0,500.00,'Abrigos'),(2,'Remera Rip Curl','algodon, corte clasico',12000.00,1,0,10000.00,'Remeras'),(3,'Prod','prueba',100.00,1,0,50.00,'Abrigos'),(4,'Remera Rusty','algodon, corte clasico',12000.00,1,0,10000.00,'Remeras'),(5,'Remera BillaBong','Blanca, algodon premium',12000.00,1,1,11000.00,'Remeras'),(6,'Remera BillaBong','Rosa, algodon premium',12000.00,1,1,10000.00,'Remeras'),(7,'Remera California','Azul francia, algodon premium',12000.00,1,1,10000.00,'Remeras'),(8,'Remera Santa Cruz','Violeta, algodo premium',12000.00,1,0,0.00,'Remeras');
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productostock`
--

DROP TABLE IF EXISTS `productostock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productostock` (
  `idProductoStock` int NOT NULL AUTO_INCREMENT,
  `talle` varchar(15) NOT NULL,
  `IdProduct` int NOT NULL,
  `stock` int NOT NULL,
  PRIMARY KEY (`idProductoStock`),
  KEY `idProducto_idx` (`IdProduct`),
  CONSTRAINT `idProduct` FOREIGN KEY (`IdProduct`) REFERENCES `producto` (`idProducto`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productostock`
--

LOCK TABLES `productostock` WRITE;
/*!40000 ALTER TABLE `productostock` DISABLE KEYS */;
INSERT INTO `productostock` VALUES (1,'s',4,5),(2,'m',4,5),(3,'L',4,3),(4,'xl',4,0),(5,'xxl',4,1),(6,'s',5,1),(7,'m',5,2),(8,'l',5,3),(9,'xl',5,4),(10,'xxl',5,1),(11,'s',6,1),(12,'m',6,1),(13,'l',6,2),(14,'xl',6,1),(15,'xxl',6,1),(16,'s',7,1),(17,'m',7,1),(18,'l',7,1),(19,'xl',7,0),(20,'xxl',7,0),(21,'s',8,1),(22,'m',8,0),(23,'l',8,0),(24,'xl',8,0),(25,'xxl',8,0);
/*!40000 ALTER TABLE `productostock` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-08 17:15:43
