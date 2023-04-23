-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema Inventarios
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema Inventarios
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS Inventarios DEFAULT CHARACTER SET utf8 ;
USE Inventarios ;

-- -----------------------------------------------------
-- Table Inventarios.`Empleado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Inventarios.`Empleado` (
  Num_emp INT NOT NULL AUTO_INCREMENT,
  Nom NVARCHAR(45) NULL,
  AP VARCHAR(45) NULL,
  AM VARCHAR(45) NULL,
  Área VARCHAR(45) NULL,
  Num_Jefe INT NULL,
  PRIMARY KEY (Num_emp),
  INDEX Num_Jefe_idx (Num_Jefe ASC),
  CONSTRAINT Num_Jefe
    FOREIGN KEY (Num_Jefe)
    REFERENCES Inventarios.`Empleado` (Num_emp)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
COMMENT = '			';


-- -----------------------------------------------------
-- Table Inventarios.`Usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Inventarios.`Usuario` (
  Num_Emp INT NULL,
  User VARCHAR(45) NOT NULL,
  Pass VARCHAR(45) NULL,
  PRIMARY KEY (User),
  INDEX Num_emp_idx (Num_Emp ASC),
  CONSTRAINT Num_EmpUser
    FOREIGN KEY (Num_Emp)
    REFERENCES Inventarios.`Empleado` (Num_emp)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table Inventarios.`Equipo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Inventarios.`Equipo` (
  Num_Serie VARCHAR(45) NOT NULL,
  Equipo VARCHAR(45) NULL,
  Marca VARCHAR(45) NULL,
  Modelo VARCHAR(45) NULL,
  Marca_Mouse VARCHAR(45) NULL,
  Marca_Teclado VARCHAR(45) NULL,
  Marca_Monitor VARCHAR(45) NULL,
  Num_emp INT NULL,
  PRIMARY KEY (Num_Serie),
  INDEX Num_emp_idx (Num_emp ASC),
  CONSTRAINT Num_RespE
    FOREIGN KEY (Num_emp)
    REFERENCES Inventarios.`Empleado` (Num_emp)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table Inventarios.`Mobiliario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Inventarios.`Mobiliario` (
  Num_Inventario INT NOT NULL AUTO_INCREMENT,
  Descripcion VARCHAR(400) NULL,
  Num_emp INT NULL,
  PRIMARY KEY (Num_Inventario),
  INDEX Num_emp_idx (Num_emp ASC),
  CONSTRAINT Num_RespM
    FOREIGN KEY (Num_emp)
    REFERENCES Inventarios.`Empleado` (Num_emp)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table Inventarios.`Facturas_Almacen`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Inventarios.`Facturas_Almacen` (
  Num_Fact INT NOT NULL AUTO_INCREMENT,
  Ffact DATE NULL,
  PRIMARY KEY (Num_Fact))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table Inventarios.`Almacen`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Inventarios.`Almacen` (
  Cod_Barras NVARCHAR(45) NOT NULL,
  FIngreso DATE NULL,
  Categoria VARCHAR(45) NULL,
  Articulo VARCHAR(45) NULL,
  Marca VARCHAR(100) NULL,
  Descripcion VARCHAR(400) NULL,
  Proveedor VARCHAR(45) NULL,
  NFact INT NULL,
  Unidad VARCHAR(45) NULL,
  Cantidad INT NULL,
  Existencia INT NULL,
  PRIMARY KEY (Cod_Barras),
  INDEX NFact_idx (NFact ASC),
  CONSTRAINT NFact
    FOREIGN KEY (NFact)
    REFERENCES Inventarios.`Facturas_Almacen` (Num_Fact)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table Inventarios.`Salida_Almacen`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Inventarios.`Salida_Almacen` (
  N_Reporte INT NOT NULL AUTO_INCREMENT,
  Solicitante INT NOT NULL,
  Cod_Barras NVARCHAR(45) NOT NULL,
  FSalida DATE NULL,
  Proveedor INT NULL,
  Cantidad INT NULL,
  PRIMARY KEY (N_Reporte, Solicitante, Cod_Barras),
  INDEX Cod_Barras_idx (Cod_Barras ASC),
  INDEX Proveedor_idx (Proveedor ASC),
  CONSTRAINT Cod_BarrasBaja
    FOREIGN KEY (Cod_Barras)
    REFERENCES Inventarios.`Almacen` (Cod_Barras)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT Solicitante
    FOREIGN KEY (Solicitante)
    REFERENCES Inventarios.`Empleado` (Num_emp)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT Proveedor
    FOREIGN KEY (Proveedor)
    REFERENCES Inventarios.`Empleado` (Num_emp)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table Inventarios.`Peticion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Inventarios.`Peticion` (
  Num_Pet INT NOT NULL AUTO_INCREMENT,
  User VARCHAR(45) NULL,
  Cod_Barras NVARCHAR(45) NULL,
  Cantidad VARCHAR(45) NULL,
  PRIMARY KEY (Num_Pet),
  INDEX User_idx (User ASC),
  INDEX Cod_Barras_idx (Cod_Barras ASC),
  CONSTRAINT User
    FOREIGN KEY (User)
    REFERENCES Inventarios.`Usuario` (User)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT Cod_BarrasPedido
    FOREIGN KEY (Cod_Barras)
    REFERENCES Inventarios.`Almacen` (Cod_Barras)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table Inventarios.`Responsivas_M`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Inventarios.`Responsivas_M` (
  Num_Emp INT NOT NULL,
  Num_Inventario INT NOT NULL,
  PRIMARY KEY (Num_Emp, Num_Inventario),
  INDEX Num_Inventario_idx (Num_Inventario ASC),
  CONSTRAINT Num_empRespM
    FOREIGN KEY (Num_Emp)
    REFERENCES Inventarios.`Empleado` (Num_emp)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT Num_Inventario
    FOREIGN KEY (Num_Inventario)
    REFERENCES Inventarios.`Mobiliario` (Num_Inventario)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table Inventarios.`Responsivas_E`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Inventarios.`Responsivas_E` (
  Num_emp INT NOT NULL,
  Num_Serie NVARCHAR(45) NOT NULL,
  PRIMARY KEY (Num_emp, Num_Serie),
  INDEX Num_Serie_idx (Num_Serie ASC),
  CONSTRAINT Num_empRespE
    FOREIGN KEY (Num_emp)
    REFERENCES Inventarios.`Empleado` (Num_emp)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT Num_Serie
    FOREIGN KEY (Num_Serie)
    REFERENCES Inventarios.`Equipo` (Num_Serie)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table Inventarios.`Facturas_Almacen`
-- -----------------------------------------------------
START TRANSACTION;
USE Inventarios;

COMMIT;


-- -----------------------------------------------------
-- Data for table Inventarios.`Almacen`
-- -----------------------------------------------------
START TRANSACTION;
USE Inventarios;

COMMIT;


-- -----------------------------------------------------
-- Data for table Inventarios.`Responsivas_M`
-- -----------------------------------------------------
START TRANSACTION;
USE Inventarios;

COMMIT;


-- -----------------------------------------------------
-- Data for table Inventarios.`Responsivas_E`
-- -----------------------------------------------------
START TRANSACTION;
USE Inventarios;

COMMIT;

select*from almacen;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Alice_07';
flush privileges;

select*from usuario where User = "armando" and Pass = "clarac";
select*from almacen;
select*from facturas_almacen;

alter table usuario modify token nvarchar(20);

update usuario set token = "4dnM3k0nl9z" where User = "armando";
delete from facturas_almacen where Ffact = "2023-04-14";
delete from almacen where FIngreso = "2023-04-14";
select*from usuario;