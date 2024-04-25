-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: Inventarios
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accesorio`
--

DROP TABLE IF EXISTS `accesorio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accesorio` (
  `Num_Serie` varchar(45) NOT NULL,
  `Accesorio` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Num_Serie`),
  CONSTRAINT `accesorio_ibfk_1` FOREIGN KEY (`Num_Serie`) REFERENCES `equipo` (`Num_Serie`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accesorio`
--

LOCK TABLES `accesorio` WRITE;
/*!40000 ALTER TABLE `accesorio` DISABLE KEYS */;
/*!40000 ALTER TABLE `accesorio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `almacen`
--

DROP TABLE IF EXISTS `almacen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `almacen` (
  `Cod_Barras` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Categoria` varchar(45) DEFAULT NULL,
  `Articulo` varchar(45) DEFAULT NULL,
  `Marca` varchar(100) DEFAULT NULL,
  `Descripcion` varchar(400) DEFAULT NULL,
  `Unidad` varchar(45) DEFAULT NULL,
  `Existencia` int DEFAULT NULL,
  `eliminado` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Cod_Barras`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `almacen`
--

LOCK TABLES `almacen` WRITE;
/*!40000 ALTER TABLE `almacen` DISABLE KEYS */;
/*!40000 ALTER TABLE `almacen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empleado`
--

DROP TABLE IF EXISTS `empleado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleado` (
  `Num_emp` int NOT NULL AUTO_INCREMENT,
  `Nom` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Área` varchar(45) DEFAULT NULL,
  `Num_Jefe` int DEFAULT NULL,
  PRIMARY KEY (`Num_emp`),
  KEY `Num_Jefe_idx` (`Num_Jefe`),
  CONSTRAINT `Num_Jefe` FOREIGN KEY (`Num_Jefe`) REFERENCES `empleado` (`Num_emp`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=841 DEFAULT CHARSET=utf8mb3 COMMENT='			';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleado`
--

LOCK TABLES `empleado` WRITE;
/*!40000 ALTER TABLE `empleado` DISABLE KEYS */;
INSERT INTO `empleado` VALUES (663,'NAVARRO JIMENEZ MARTHA LIDIA','DIRECCION GENERAL',663),(775,'Moises','SISTEMAS',663);
/*!40000 ALTER TABLE `empleado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipo`
--

DROP TABLE IF EXISTS `equipo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipo` (
  `N_Inventario` int NOT NULL AUTO_INCREMENT,
  `Num_Serie` varchar(45) NOT NULL,
  `Equipo` varchar(45) NOT NULL,
  `Marca` varchar(45) NOT NULL,
  `Modelo` varchar(45) NOT NULL,
  `Num_emp` int NOT NULL,
  `Ubi` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  PRIMARY KEY (`Num_Serie`),
  KEY `auto` (`N_Inventario`),
  KEY `Num_emp_idx` (`Num_emp`),
  CONSTRAINT `Num_RespE` FOREIGN KEY (`Num_emp`) REFERENCES `empleado` (`Num_emp`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipo`
--

LOCK TABLES `equipo` WRITE;
/*!40000 ALTER TABLE `equipo` DISABLE KEYS */;
/*!40000 ALTER TABLE `equipo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facturas_almacen`
--

DROP TABLE IF EXISTS `facturas_almacen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facturas_almacen` (
  `Num_Fact` varchar(10) NOT NULL,
  `Ffact` date DEFAULT NULL,
  `Proveedor` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Num_Fact`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facturas_almacen`
--

LOCK TABLES `facturas_almacen` WRITE;
/*!40000 ALTER TABLE `facturas_almacen` DISABLE KEYS */;
INSERT INTO `facturas_almacen` VALUES ('1','2023-03-15',NULL),('2','2023-03-15',NULL);
/*!40000 ALTER TABLE `facturas_almacen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `factus_productos`
--

DROP TABLE IF EXISTS `factus_productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `factus_productos` (
  `Cod_Barras` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Nfactura` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Cantidad` int NOT NULL,
  `FIngreso` date NOT NULL,
  PRIMARY KEY (`Cod_Barras`,`Nfactura`),
  KEY `FK_NDFA` (`Nfactura`),
  CONSTRAINT `FK_CBA` FOREIGN KEY (`Cod_Barras`) REFERENCES `almacen` (`Cod_Barras`),
  CONSTRAINT `FK_NDFA` FOREIGN KEY (`Nfactura`) REFERENCES `facturas_almacen` (`Num_Fact`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `factus_productos`
--

LOCK TABLES `factus_productos` WRITE;
/*!40000 ALTER TABLE `factus_productos` DISABLE KEYS */;
/*!40000 ALTER TABLE `factus_productos` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `Actualizar_ExistenciasInsert` AFTER INSERT ON `factus_productos` FOR EACH ROW BEGIN
	if ((select count(suma) from (select sum(salidas_productos.Cantidad_Salida) as suma from salidas_productos where Cod_BarrasS = new.Cod_Barras) P) = 1) then
			update almacen set Existencia = (select sum(factus_productos.Cantidad) from factus_productos where Cod_Barras = new.Cod_Barras) - (select sum(salidas_productos.Cantidad_Salida) from salidas_productos where Cod_BarrasS = new.Cod_Barras) where Cod_Barras = new.Cod_Barras;
		else
			update almacen set Existencia = (select sum(factus_productos.Cantidad) from factus_productos where Cod_Barras = new.Cod_Barras) where Cod_Barras = new.Cod_Barras;
	end if; 
  END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `Actualizar_Existencias` AFTER UPDATE ON `factus_productos` FOR EACH ROW BEGIN
  if ((select count(suma) from (select sum(salidas_productos.Cantidad_Salida) as suma from salidas_productos where Cod_BarrasS = old.Cod_Barras) P) = 1) then
	update almacen set Existencia = (select sum(factus_productos.Cantidad) from factus_productos where Cod_Barras = old.Cod_Barras) - (select sum(salidas_productos.Cantidad_Salida) from salidas_productos where Cod_BarrasS = old.Cod_Barras) where Cod_Barras = old.Cod_Barras;
  else
	update almacen set Existencia = (select sum(factus_productos.Cantidad) from factus_productos where Cod_Barras = old.Cod_Barras) where Cod_Barras = old.Cod_Barras;
  end if; 
  END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `mobiliario`
--

DROP TABLE IF EXISTS `mobiliario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mobiliario` (
  `Num_Inventario` int NOT NULL,
  `Articulo` varchar(100) NOT NULL,
  `Descripcion` varchar(400) NOT NULL,
  `Num_emp` int NOT NULL,
  `Ubicacion` varchar(400) DEFAULT NULL,
  `Cantidad` int DEFAULT NULL,
  `AreaM` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`Articulo`,`Descripcion`,`Num_emp`),
  KEY `Num_emp_idx` (`Num_emp`),
  CONSTRAINT `Num_RespM` FOREIGN KEY (`Num_emp`) REFERENCES `empleado` (`Num_emp`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mobiliario`
--

LOCK TABLES `mobiliario` WRITE;
/*!40000 ALTER TABLE `mobiliario` DISABLE KEYS */;
/*!40000 ALTER TABLE `mobiliario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `monitor`
--

DROP TABLE IF EXISTS `monitor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monitor` (
  `Num_Serie` varchar(45) NOT NULL,
  `Monitor` varchar(100) DEFAULT NULL,
  `Num_Serie_Monitor` varchar(45) DEFAULT NULL,
  `Num_Inv_Mon` int DEFAULT NULL,
  PRIMARY KEY (`Num_Serie`),
  CONSTRAINT `monitor_ibfk_1` FOREIGN KEY (`Num_Serie`) REFERENCES `equipo` (`Num_Serie`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monitor`
--

LOCK TABLES `monitor` WRITE;
/*!40000 ALTER TABLE `monitor` DISABLE KEYS */;
/*!40000 ALTER TABLE `monitor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mouse`
--

DROP TABLE IF EXISTS `mouse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mouse` (
  `Num_Serie` varchar(45) NOT NULL,
  `Mouse` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Num_Serie`),
  CONSTRAINT `mouse_ibfk_1` FOREIGN KEY (`Num_Serie`) REFERENCES `equipo` (`Num_Serie`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mouse`
--

LOCK TABLES `mouse` WRITE;
/*!40000 ALTER TABLE `mouse` DISABLE KEYS */;
/*!40000 ALTER TABLE `mouse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pcs`
--

DROP TABLE IF EXISTS `pcs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pcs` (
  `Num_Serie` varchar(45) NOT NULL,
  `Hardware` varchar(100) DEFAULT NULL,
  `Software` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Num_Serie`),
  CONSTRAINT `pcs_ibfk_1` FOREIGN KEY (`Num_Serie`) REFERENCES `equipo` (`Num_Serie`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pcs`
--

LOCK TABLES `pcs` WRITE;
/*!40000 ALTER TABLE `pcs` DISABLE KEYS */;
/*!40000 ALTER TABLE `pcs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permisos`
--

DROP TABLE IF EXISTS `permisos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permisos` (
  `permiso` enum('1','2','3','4') NOT NULL,
  `usuario` varchar(25) NOT NULL,
  `modulo` enum('ALMACÉN','MOBILIARIO','EQUIPOS','RESPONSIVAS','USUARIOS','EMPLEADOS','PETICIONES') NOT NULL,
  PRIMARY KEY (`permiso`,`usuario`,`modulo`),
  KEY `usuario` (`usuario`),
  CONSTRAINT `permisos_ibfk_1` FOREIGN KEY (`usuario`) REFERENCES `usuario` (`Usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permisos`
--

LOCK TABLES `permisos` WRITE;
/*!40000 ALTER TABLE `permisos` DISABLE KEYS */;
INSERT INTO `permisos` VALUES ('1','Moises','ALMACÉN'),('1','Moises','MOBILIARIO'),('1','Moises','EQUIPOS'),('1','Moises','RESPONSIVAS'),('1','Moises','USUARIOS'),('1','Moises','EMPLEADOS'),('1','Moises','PETICIONES'),('2','Moises','ALMACÉN'),('2','Moises','MOBILIARIO'),('2','Moises','EQUIPOS'),('2','Moises','RESPONSIVAS'),('2','Moises','USUARIOS'),('2','Moises','EMPLEADOS'),('3','Moises','ALMACÉN'),('3','Moises','MOBILIARIO'),('3','Moises','EQUIPOS'),('3','Moises','RESPONSIVAS'),('3','Moises','USUARIOS'),('3','Moises','EMPLEADOS'),('4','Moises','ALMACÉN'),('4','Moises','MOBILIARIO'),('4','Moises','EQUIPOS'),('4','Moises','RESPONSIVAS'),('4','Moises','USUARIOS'),('4','Moises','EMPLEADOS');
/*!40000 ALTER TABLE `permisos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `peticion`
--

DROP TABLE IF EXISTS `peticion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `peticion` (
  `Num_Pet` int NOT NULL AUTO_INCREMENT,
  `User` varchar(45) DEFAULT NULL,
  `Cod_Barras` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Cantidad` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Num_Pet`),
  KEY `User_idx` (`User`),
  KEY `Cod_Barras_idx` (`Cod_Barras`),
  CONSTRAINT `Cod_BarrasPedido` FOREIGN KEY (`Cod_Barras`) REFERENCES `almacen` (`Cod_Barras`),
  CONSTRAINT `User` FOREIGN KEY (`User`) REFERENCES `usuario` (`Usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `peticion`
--

LOCK TABLES `peticion` WRITE;
/*!40000 ALTER TABLE `peticion` DISABLE KEYS */;
/*!40000 ALTER TABLE `peticion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salida_almacen`
--

DROP TABLE IF EXISTS `salida_almacen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salida_almacen` (
  `N_Reporte` int NOT NULL AUTO_INCREMENT,
  `Solicitante` int NOT NULL,
  `Cod_Barras` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `FSalida` date DEFAULT NULL,
  `Proveedor` int DEFAULT NULL,
  `Cantidad` int DEFAULT NULL,
  PRIMARY KEY (`N_Reporte`,`Solicitante`,`Cod_Barras`),
  KEY `Cod_Barras_idx` (`Cod_Barras`),
  KEY `Proveedor_idx` (`Proveedor`),
  KEY `Solicitante` (`Solicitante`),
  CONSTRAINT `Cod_BarrasBaja` FOREIGN KEY (`Cod_Barras`) REFERENCES `almacen` (`Cod_Barras`),
  CONSTRAINT `Proveedor` FOREIGN KEY (`Proveedor`) REFERENCES `empleado` (`Num_emp`),
  CONSTRAINT `Solicitante` FOREIGN KEY (`Solicitante`) REFERENCES `empleado` (`Num_emp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salida_almacen`
--

LOCK TABLES `salida_almacen` WRITE;
/*!40000 ALTER TABLE `salida_almacen` DISABLE KEYS */;
/*!40000 ALTER TABLE `salida_almacen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salidas_productos`
--

DROP TABLE IF EXISTS `salidas_productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salidas_productos` (
  `Cod_BarrasS` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `FSalida` datetime NOT NULL,
  `Num_EmpS` int NOT NULL,
  `Cantidad_Salida` int DEFAULT NULL,
  PRIMARY KEY (`Cod_BarrasS`,`FSalida`,`Num_EmpS`),
  KEY `FKNES` (`Num_EmpS`),
  CONSTRAINT `FKCBS` FOREIGN KEY (`Cod_BarrasS`) REFERENCES `almacen` (`Cod_Barras`),
  CONSTRAINT `FKNES` FOREIGN KEY (`Num_EmpS`) REFERENCES `empleado` (`Num_emp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salidas_productos`
--

LOCK TABLES `salidas_productos` WRITE;
/*!40000 ALTER TABLE `salidas_productos` DISABLE KEYS */;
/*!40000 ALTER TABLE `salidas_productos` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `Actualizar_ExistenciasInsercion2` AFTER INSERT ON `salidas_productos` FOR EACH ROW BEGIN
		if ((select count(suma) from (select sum(salidas_productos.Cantidad_Salida) as suma from salidas_productos where Cod_BarrasS = new.Cod_BarrasS) P) = 1) then
            update almacen set Existencia = (select sum(factus_productos.Cantidad) from factus_productos where Cod_Barras = new.Cod_BarrasS) - (select sum(salidas_productos.Cantidad_Salida) from salidas_productos where Cod_BarrasS = new.Cod_BarrasS) where Cod_Barras = new.Cod_BarrasS;
        else
			update almacen set Existencia = (select sum(factus_productos.Cantidad) from factus_productos where Cod_Barras = new.Cod_BarrasS) where Cod_Barras = new.Cod_BarrasS;
        end if; 
	END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `Actualizar_Existencias2` AFTER UPDATE ON `salidas_productos` FOR EACH ROW BEGIN
	if ((select count(suma) from (select sum(salidas_productos.Cantidad_Salida) as suma from salidas_productos where Cod_BarrasS = old.Cod_BarrasS) P) = 1) then
	update almacen set Existencia = (select sum(factus_productos.Cantidad) from factus_productos where Cod_Barras = old.Cod_BarrasS) - (select sum(salidas_productos.Cantidad_Salida) from salidas_productos where Cod_BarrasS = old.Cod_BarrasS) where Cod_Barras = old.Cod_BarrasS;
  else
	update almacen set Existencia = (select sum(factus_productos.Cantidad) from factus_productos where Cod_Barras = old.Cod_BarrasS) where Cod_Barras = old.Cod_BarrasS;
  end if; 
  END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `soli_car`
--

DROP TABLE IF EXISTS `soli_car`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `soli_car` (
  `Cod_Barras_SC` varchar(45) NOT NULL,
  `cantidad_SC` int DEFAULT NULL,
  `emp_SC` int NOT NULL,
  `Acept` tinyint(1) DEFAULT NULL,
  `request_date` datetime NOT NULL,
  `delivered_ware` tinyint(1) DEFAULT NULL,
  `sended` tinyint(1) DEFAULT NULL,
  `delivered_soli` tinyint(1) DEFAULT NULL,
  `cerrada` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`Cod_Barras_SC`,`emp_SC`,`request_date`),
  KEY `FKSC_EM` (`emp_SC`),
  CONSTRAINT `FKSC_CB` FOREIGN KEY (`Cod_Barras_SC`) REFERENCES `almacen` (`Cod_Barras`),
  CONSTRAINT `FKSC_EM` FOREIGN KEY (`emp_SC`) REFERENCES `empleado` (`Num_emp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `soli_car`
--

LOCK TABLES `soli_car` WRITE;
/*!40000 ALTER TABLE `soli_car` DISABLE KEYS */;
/*!40000 ALTER TABLE `soli_car` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `ASEPSE` BEFORE UPDATE ON `soli_car` FOR EACH ROW BEGIN
		IF NEW.delivered_ware = 1 AND NEW.delivered_soli = 1 THEN
        SET NEW.cerrada = 1;
		end if;
	END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `teclado`
--

DROP TABLE IF EXISTS `teclado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teclado` (
  `Num_Serie` varchar(45) NOT NULL,
  `Teclado` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Num_Serie`),
  CONSTRAINT `teclado_ibfk_1` FOREIGN KEY (`Num_Serie`) REFERENCES `equipo` (`Num_Serie`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teclado`
--

LOCK TABLES `teclado` WRITE;
/*!40000 ALTER TABLE `teclado` DISABLE KEYS */;
/*!40000 ALTER TABLE `teclado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `Num_Emp` int DEFAULT NULL,
  `Usuario` varchar(45) NOT NULL,
  `Pass` varchar(45) NOT NULL,
  PRIMARY KEY (`Usuario`),
  KEY `Num_emp_idx` (`Num_Emp`),
  CONSTRAINT `Num_EmpUser` FOREIGN KEY (`Num_Emp`) REFERENCES `empleado` (`Num_emp`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (775,'Moises','clarac');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-23 23:44:00
