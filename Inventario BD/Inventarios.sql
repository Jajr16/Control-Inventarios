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
CREATE SCHEMA IF NOT EXISTS `Inventarios` DEFAULT CHARACTER SET utf8 ;
USE `Inventarios` ;

-- -----------------------------------------------------
-- Table `Inventarios`.`Empleado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Inventarios`.`Empleado` (
  `Num_emp` INT NOT NULL AUTO_INCREMENT,
  `Nom` NVARCHAR(45) NULL,
  `AP` VARCHAR(45) NULL,
  `AM` VARCHAR(45) NULL,
  `Área` VARCHAR(45) NULL,
  `Num_Jefe` INT NULL,
  PRIMARY KEY (`Num_emp`),
  INDEX `Num_Jefe_idx` (`Num_Jefe` ASC),
  CONSTRAINT `Num_Jefe`
    FOREIGN KEY (`Num_Jefe`)
    REFERENCES `Inventarios`.`Empleado` (`Num_emp`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
COMMENT = '			';


-- -----------------------------------------------------
-- Table `Inventarios`.`Usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Inventarios`.`Usuario` (
  `Num_Emp` INT NULL,
  `User` VARCHAR(45) NOT NULL,
  `Pass` VARCHAR(45) NULL,
  PRIMARY KEY (`User`),
  INDEX `Num_emp_idx` (`Num_Emp` ASC),
  CONSTRAINT `Num_EmpUser`
    FOREIGN KEY (`Num_Emp`)
    REFERENCES `Inventarios`.`Empleado` (`Num_emp`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Inventarios`.`Equipo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Inventarios`.`Equipo` (
  `Num_Serie` VARCHAR(45) NOT NULL,
  `Equipo` VARCHAR(45) NULL,
  `Marca` VARCHAR(45) NULL,
  `Modelo` VARCHAR(45) NULL,
  `Marca_Mouse` VARCHAR(45) NULL,
  `Marca_Teclado` VARCHAR(45) NULL,
  `Marca_Monitor` VARCHAR(45) NULL,
  `Num_emp` INT NULL,
  PRIMARY KEY (`Num_Serie`),
  INDEX `Num_emp_idx` (`Num_emp` ASC),
  CONSTRAINT `Num_RespE`
    FOREIGN KEY (`Num_emp`)
    REFERENCES `Inventarios`.`Empleado` (`Num_emp`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Inventarios`.`Mobiliario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Inventarios`.`Mobiliario` (
  `Num_Inventario` INT NOT NULL AUTO_INCREMENT,
  `Descripcion` VARCHAR(400) NULL,
  `Num_emp` INT NULL,
  PRIMARY KEY (`Num_Inventario`),
  INDEX `Num_emp_idx` (`Num_emp` ASC),
  CONSTRAINT `Num_RespM`
    FOREIGN KEY (`Num_emp`)
    REFERENCES `Inventarios`.`Empleado` (`Num_emp`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Inventarios`.`Facturas_Almacen`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Inventarios`.`Facturas_Almacen` (
  `Num_Fact` INT NOT NULL AUTO_INCREMENT,
  `Ffact` DATE NULL,
  PRIMARY KEY (`Num_Fact`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Inventarios`.`Almacen`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Inventarios`.`Almacen` (
  `Cod_Barras` NVARCHAR(45) NOT NULL,
  `FIngreso` DATE NULL,
  `Categoria` VARCHAR(45) NULL,
  `Articulo` VARCHAR(45) NULL,
  `Marca` VARCHAR(100) NULL,
  `Descripcion` VARCHAR(400) NULL,
  `Proveedor` VARCHAR(45) NULL,
  `NFact` INT NULL,
  `Unidad` VARCHAR(45) NULL,
  `Cantidad` INT NULL,
  `Existencia` INT NULL,
  PRIMARY KEY (`Cod_Barras`),
  INDEX `NFact_idx` (`NFact` ASC),
  CONSTRAINT `NFact`
    FOREIGN KEY (`NFact`)
    REFERENCES `Inventarios`.`Facturas_Almacen` (`Num_Fact`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Inventarios`.`Salida_Almacen`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Inventarios`.`Salida_Almacen` (
  `N_Reporte` INT NOT NULL AUTO_INCREMENT,
  `Solicitante` INT NOT NULL,
  `Cod_Barras` NVARCHAR(45) NOT NULL,
  `FSalida` DATE NULL,
  `Proveedor` INT NULL,
  `Cantidad` INT NULL,
  PRIMARY KEY (`N_Reporte`, `Solicitante`, `Cod_Barras`),
  INDEX `Cod_Barras_idx` (`Cod_Barras` ASC),
  INDEX `Proveedor_idx` (`Proveedor` ASC),
  CONSTRAINT `Cod_BarrasBaja`
    FOREIGN KEY (`Cod_Barras`)
    REFERENCES `Inventarios`.`Almacen` (`Cod_Barras`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `Solicitante`
    FOREIGN KEY (`Solicitante`)
    REFERENCES `Inventarios`.`Empleado` (`Num_emp`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `Proveedor`
    FOREIGN KEY (`Proveedor`)
    REFERENCES `Inventarios`.`Empleado` (`Num_emp`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Inventarios`.`Peticion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Inventarios`.`Peticion` (
  `Num_Pet` INT NOT NULL AUTO_INCREMENT,
  `User` VARCHAR(45) NULL,
  `Cod_Barras` NVARCHAR(45) NULL,
  `Cantidad` VARCHAR(45) NULL,
  PRIMARY KEY (`Num_Pet`),
  INDEX `User_idx` (`User` ASC),
  INDEX `Cod_Barras_idx` (`Cod_Barras` ASC),
  CONSTRAINT `User`
    FOREIGN KEY (`User`)
    REFERENCES `Inventarios`.`Usuario` (`Usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `Cod_BarrasPedido`
    FOREIGN KEY (`Cod_Barras`)
    REFERENCES `Inventarios`.`Almacen` (`Cod_Barras`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Inventarios`.`Responsivas_M`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Inventarios`.`Responsivas_M` (
  `Num_Emp` INT NOT NULL,
  `Num_Inventario` INT NOT NULL,
  PRIMARY KEY (`Num_Emp`, `Num_Inventario`),
  INDEX `Num_Inventario_idx` (`Num_Inventario` ASC),
  CONSTRAINT `Num_empRespM`
    FOREIGN KEY (`Num_Emp`)
    REFERENCES `Inventarios`.`Empleado` (`Num_emp`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `Num_Inventario`
    FOREIGN KEY (`Num_Inventario`)
    REFERENCES `Inventarios`.`Mobiliario` (`Num_Inventario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Inventarios`.`Responsivas_E`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Inventarios`.`Responsivas_E` (
  `Num_emp` INT NOT NULL,
  `Num_Serie` NVARCHAR(45) NOT NULL,
  PRIMARY KEY (`Num_emp`, `Num_Serie`),
  INDEX `Num_Serie_idx` (`Num_Serie` ASC),
  CONSTRAINT `Num_empRespE`
    FOREIGN KEY (`Num_emp`)
    REFERENCES `Inventarios`.`Empleado` (`Num_emp`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `Num_Serie`
    FOREIGN KEY (`Num_Serie`)
    REFERENCES `Inventarios`.`Equipo` (`Num_Serie`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `Inventarios`.`Facturas_Almacen`
-- -----------------------------------------------------
START TRANSACTION;
USE `Inventarios`;
INSERT INTO `Inventarios`.`Facturas_Almacen` (`Num_Fact`, `Ffact`) VALUES (1, '2023-03-15');
INSERT INTO `Inventarios`.`Facturas_Almacen` (`Num_Fact`, `Ffact`) VALUES (2, '2023-03-15');

COMMIT;


-- -----------------------------------------------------
-- Data for table `Inventarios`.`Almacen`
-- -----------------------------------------------------
START TRANSACTION;
USE `Inventarios`;
INSERT INTO `Inventarios`.`Almacen` (`Cod_Barras`, `FIngreso`, `Categoria`, `Articulo`, `Marca`, `Descripcion`, `Proveedor`, `NFact`, `Unidad`, `Cantidad`, `Existencia`) VALUES ('756981H83', '2023-03-15', 'Papelería', 'Hojas Blancas', 'Scribd', 'Pliego de hojas blancas', 'Lumen', 1, 'Unidad', 10, 10);
INSERT INTO `Inventarios`.`Almacen` (`Cod_Barras`, `FIngreso`, `Categoria`, `Articulo`, `Marca`, `Descripcion`, `Proveedor`, `NFact`, `Unidad`, `Cantidad`, `Existencia`) VALUES ('684F4GFR8', '2023-03-15', 'Limpieza', 'Fabuloso', 'Fab', 'Jabón líquido', 'Chedrahui', 2, 'Unidad', 5, 5);

COMMIT;


-- -----------------------------------------------------
-- Data for table `Inventarios`.`Responsivas_M`
-- -----------------------------------------------------
START TRANSACTION;
USE `Inventarios`;
INSERT INTO `Inventarios`.`Responsivas_M` (`Num_Emp`, `Num_Inventario`) VALUES (758, 2);

COMMIT;


-- -----------------------------------------------------
-- Data for table `Inventarios`.`Responsivas_E`
-- -----------------------------------------------------
START TRANSACTION;
USE `Inventarios`;
INSERT INTO `Inventarios`.`Responsivas_E` (`Num_emp`, `Num_Serie`) VALUES (758, '5415');

COMMIT;

-- TABLAS

create table tokens(
token nvarchar(20) not null primary key,
area nvarchar(45) not null
);

insert into tokens values(
"4dnM3k0nl9s", "SISTEMAS"),	#ACCESO TOTAL
("4dnM3k0nl9z", "DIRECCION GENERAL"), #No puede dar de alta usuarios
("4dnM3k0nl9A", "SERVICIOS GENERALES"),#ALMACEN
("4dnM3k0nPl9Z", "PREESCOLAR"),
("7sdGRq24GPR", "PRIMARIA"),
("57hfGRDGF1HS","SECUNDARIA"),
("SADwa14AFESPP","PREPARATORIA"),
("FGJYGd42DSAFA","ADMINISTRACIÓN");#TEMPORALMENTE ALMACEN

create table Factus_Productos(
Cod_Barras nvarchar(45) not null,
Nfactura nvarchar(10) not null,
 constraint cPFPS primary key(Cod_Barras, Nfactura)
);

create table Salidas_Productos(
Cod_BarrasS nvarchar(45) not null,
FSalida datetime,
Num_EmpS int,
Cantidad_Salida int,
constraint CPSP primary key(Cod_BarrasS, FSalida, Num_EmpS)
);

alter table Salidas_Productos add constraint FKCBS foreign key(Cod_BarrasS) references almacen(Cod_Barras);
alter table Salidas_Productos add constraint FKNES foreign key(Num_EmpS) references empleado(Num_emp);

alter table Factus_Productos add constraint FK_CBA foreign key(Cod_Barras) references almacen(Cod_Barras);
alter table Factus_Productos add constraint FK_NDFA foreign key(Nfactura) references facturas_almacen(Num_Fact);

create unique index FKAEmp on tokens(area);
alter table empleado add constraint FK_A foreign key(Área) references tokens(area); 
alter table usuario add constraint FK_T foreign key(token) references tokens(token);

select*from usuario;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'n0m3l0';
flush privileges;

alter table usuario add column token int not null default 0;
alter table usuario modify token nvarchar(20);

update usuario set token = "4dnM3k0nl9z" where User = "armando";
update almacen set Existencia = 10 where Cod_Barras = 'b';
update empleado set Num_Jefe = 1 where Num_emp = 1;
update empleado set Num_emp = 2 where Num_emp = 758;
update empleado set Num_Jefe = 663;
-- DELETES
delete from factus_productos where FIngreso = "2023-04-28";
delete from facturas_almacen where Ffact = "2023-05-07";
delete from almacen where eliminado = 0;
delete from almacen where eliminado = 1;
delete from salidas_productos where Cod_BarrasS = 'JDFK35J2';
delete from salidas_productos where FSalida = '2023-05-15';
delete from almacen where Cod_Barras = "684F4GFR8";
delete from empleado where Num_emp > 840;
delete from usuario where Num_emp = 107;
-- Quitar columnas
alter table facturas_almacen drop column Cod_Barras;
alter table almacen drop column Cantidad;
alter table almacen drop column NFact;
alter table almacen drop column FIngreso;
alter table almacen drop column Proveedor;
alter table facturas_almacen drop column Cantidad;
alter table facturas_almacen drop column FIngreso;
alter table empleado drop column AM;
-- Agregar columnas
alter table factus_productos add column Cantidad int;
alter table facturas_almacen add column Ffact date;
alter table facturas_almacen add column Proveedor nvarchar(45);
alter table almacen add column eliminado TINYINT(1) not null default 0;
alter table factus_productos add column FIngreso date;

ALTER TABLE empleado AUTO_INCREMENT = 841;

-- almacen.Cod_Barras, almacen.FIngreso, almacen.Categoria, almacen.Articulo, almacen.Marca, almacen.Descripcion, almacen.Proveedor, almacen.NFact
#select*from usuario where User = "armando" and Pass = "clarac";

#select *from almacen order by eliminado;
#select almacen.Cod_Barras, factus_productos.FIngreso, almacen.Categoria, almacen.Articulo, almacen.Marca, almacen.Descripcion, almacen.Unidad, almacen.Existencia, facturas_almacen.Proveedor, facturas_almacen.Num_Fact, facturas_almacen.Ffact, almacen.eliminado from factus_productos inner join almacen on factus_productos.Cod_Barras = almacen.Cod_Barras inner join facturas_almacen on factus_productos.Nfactura = facturas_almacen.Num_Fact  order by almacen.eliminado;

#select almacen.Articulo, factus_productos.Nfactura, factus_productos.Cantidad, factus_productos.FIngreso, facturas_almacen.Ffact, facturas_almacen.Proveedor from factus_productos inner join facturas_almacen on facturas_almacen.Num_Fact = factus_productos.Nfactura inner join almacen on factus_productos.Cod_Barras = almacen.Cod_Barras where factus_productos.Cod_Barras = 's';
#select*from almacen where Cod_Barras = 'd' and eliminado = 1;
#update almacen set eliminado = 1 where Cod_Barras = 'd';
#select*from usuario where Usuario = 'a' and Pass = '123';

#select sum(Cantidad) as suma from factus_productos where Cod_Barras = "s";

ALTER TABLE usuario CHANGE `User` `Usuario` nvarchar(45);

#update almacen set Existencia = ((select sum(factus_productos.Cantidad) from factus_productos where Cod_Barras = 'c') - (select sum(salidas_productos.Cantidad_Salida) from salidas_productos where Cod_BarrasS = 'c')) where Cod_Barras = 'c';


#select  sum(factus_productos.Cantidad) - sum(salidas_productos.Cantidad_Salida) from factus_productos inner join salidas_productos on factus_productos.Cod_Barras = salidas_productos.Cod_BarrasS where factus_productos.Cod_Barras = 'c';
#select sum(factus_productos.Cantidad) from factus_productos where Cod_Barras = 'JDFK35J2';
#select sum(factus_productos.Cantidad) - sum(salidas_productos.Cantidad_Salida) from salidas_productos where factus_productos.Cod_Barras = salidas_productos.Cod_BarrasS;

#UPDATE tabla1
#    -> INNER JOIN tabla2 ON tabla1.sala = tabla2.sala
#    -> SET tabla1.asientos_disponibles = tabla1.asientos_disponibles - tabla2.asientos_ocupados;

#select num_emp from empleado where concat(Nom, " ", AP, " ", AM) = "Armando Jiménez Rivera";
#select Num_emp from Empleado where Nom = "Armando" and AP = "Jiménez" and AM = "Rivera";

DELIMITER |
create trigger Actualizar_Existencias after update on factus_productos
  FOR EACH ROW BEGIN
  if ((select count(suma) from (select sum(salidas_productos.Cantidad_Salida) as suma from salidas_productos where Cod_BarrasS = old.Cod_Barras) P) = 1) then
	update almacen set Existencia = (select sum(factus_productos.Cantidad) from factus_productos where Cod_Barras = old.Cod_Barras) - (select sum(salidas_productos.Cantidad_Salida) from salidas_productos where Cod_BarrasS = old.Cod_Barras) where Cod_Barras = old.Cod_Barras;
  else
	update almacen set Existencia = (select sum(factus_productos.Cantidad) from factus_productos where Cod_Barras = old.Cod_Barras) where Cod_Barras = old.Cod_Barras;
  end if; 
  END
| DELIMITER ;

DELIMITER |
create trigger Actualizar_ExistenciasInsert after insert on factus_productos
  FOR EACH ROW BEGIN
	if ((select count(suma) from (select sum(salidas_productos.Cantidad_Salida) as suma from salidas_productos where Cod_BarrasS = new.Cod_Barras) P) = 1) then
			update almacen set Existencia = (select sum(factus_productos.Cantidad) from factus_productos where Cod_Barras = new.Cod_Barras) - (select sum(salidas_productos.Cantidad_Salida) from salidas_productos where Cod_BarrasS = new.Cod_Barras) where Cod_Barras = new.Cod_Barras;
		else
			update almacen set Existencia = (select sum(factus_productos.Cantidad) from factus_productos where Cod_Barras = new.Cod_Barras) where Cod_Barras = new.Cod_Barras;
	end if; 
  END
| DELIMITER ;

DELIMITER |
create trigger Actualizar_Existencias2 after update on salidas_productos
  FOR EACH ROW BEGIN
	if ((select count(suma) from (select sum(salidas_productos.Cantidad_Salida) as suma from salidas_productos where Cod_BarrasS = old.Cod_BarrasS) P) = 1) then
	update almacen set Existencia = (select sum(factus_productos.Cantidad) from factus_productos where Cod_Barras = old.Cod_BarrasS) - (select sum(salidas_productos.Cantidad_Salida) from salidas_productos where Cod_BarrasS = old.Cod_BarrasS) where Cod_Barras = old.Cod_BarrasS;
  else
	update almacen set Existencia = (select sum(factus_productos.Cantidad) from factus_productos where Cod_Barras = old.Cod_BarrasS) where Cod_Barras = old.Cod_BarrasS;
  end if; 
  END
| DELIMITER ;

DELIMITER |
create trigger Actualizar_ExistenciasInsercion2 after insert on salidas_productos
	FOR EACH ROW BEGIN
		if ((select count(suma) from (select sum(salidas_productos.Cantidad_Salida) as suma from salidas_productos where Cod_BarrasS = new.Cod_BarrasS) P) = 1) then
            update almacen set Existencia = (select sum(factus_productos.Cantidad) from factus_productos where Cod_Barras = new.Cod_BarrasS) - (select sum(salidas_productos.Cantidad_Salida) from salidas_productos where Cod_BarrasS = new.Cod_BarrasS) where Cod_Barras = new.Cod_BarrasS;
        else
			update almacen set Existencia = (select sum(factus_productos.Cantidad) from factus_productos where Cod_Barras = new.Cod_BarrasS) where Cod_Barras = new.Cod_BarrasS;
        end if; 
	END
| DELIMITER ;
#drop trigger Token;
#DELIMITER |
#create trigger Token before insert on Usuario 
#	for each row begin
#		update usuario set token = (select tokens.token from tokens inner join empleado on tokens.area = empleado.Área where empleado.Num_Emp = 758);
#    END
#| DELIMITER ;

-- BUSQUEDAS
select count(suma) from (select sum(salidas_productos.Cantidad_Salida) as suma from salidas_productos where Cod_BarrasS = 'c') P;

select*from facturas_almacen;
select*from factus_productos;
select*from almacen;
select*from salidas_productos;
select*from salida_almacen;
select*from empleado;
select distinct(Área) from empleado;
select*from usuario;

insert into empleado values(
663, "NAVARRO JIMENEZ MARTHA LIDIA", "DIRECCION GENERAL", 663);

insert into usuario values(
758, "ajimenez", "Clarac2017", '4dnM3k0nl9s'
);

select Salidas_Productos.Cod_BarrasS, almacen.Articulo, almacen.Existencia, empleado.Nom, salidas_productos.Cantidad_Salida, salidas_productos.FSalida from salidas_productos inner join almacen on salidas_productos.Cod_BarrasS = almacen.Cod_Barras inner join empleado on salidas_productos.Num_EmpS = empleado.Num_emp;

select tokens.token from tokens inner join empleado on tokens.area = empleado.Área where empleado.Num_Emp = 760;

#select concat(Nom, " ", AP, " ", AM) NombreCompleto from empleado;
#update factus_productos set Cantidad = 700 where Nfactura = 'ASKDFJ7';
#update salidas_productos set Cantidad_Salida = 2 where Cod_BarrasS = 'R' and FSalida = "2023-04-22" and Num_EmpS = 758;
