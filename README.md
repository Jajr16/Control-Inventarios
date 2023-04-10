# Control-Inventarios
Escuela Clarac
**** URGENTE ****
Departamento de compras tendrá dos almacenes (Básicamente se manejan en una sola tabla SQL) en donde guardarán productos de papelería, ferretería y limpieza. En esta tabla de almacén se registrará la fecha de ingreso del material, la categoría(ferretería, papelería, limpieza), un código que lo identifique, la marca del producto, el nombre propio del artículo, su descripción, el proveedor, se requiere el número de factura de los artículos, la fecha en que se facturó, la unidad en que se adquirieron estos productos(Unidades, litros), la cantidad existente de cada producto, la salida(bajas) para ver quién ha pedido artículos (historial de quién pidió, cuánto pidió) y cuántos hay en existencia.

Para la parte de las salidas, se requerirá la fecha en que un producto fue sacado del almacén, el número de empleado que lo sacó, su nombre, el producto, y la cantidad que sacó.
**** PARA FUTURO ****
Se requerirá generar un 'reporte' en el cuál se registre cada salida(probablemente electrónico)
*********************

Habrá otras dos tablas, en una se guardará el mobiliario en el cuál se registrará solo el número de inventario, su descripción que es con el que se identificarán inicialmente y el responsable de dicho mobiliario

En la tabla de Equipo lo que se registrará es el equipo, marca, modelo, número de serie, marca del mouse, marca del teclado, marca del monitor y el responsable del mismo.

mobiliario y equipo
almacen (insumos de limpieza, papelería, ferretería)

EQUIPOS
Equipo 	Marca  	Modelo 	Número de serie 	Marca Mouse 	Marca teclado	 Marca Monitor	Responsable
MOBILIARIO
Número de inventario 	Descripción		Responsable
ALMACEN
FECHA_Ingreso	CATEGORIA	CAT	No	CODIGO	ARTICULO	DESCRIPCION	MARCA	PROVEEDOR	No FACTURA	"FECHA
FACTURA"	UNIDAD	CANT	SALIDA	EXISTENCIA

Debe sacar responsivas junto con el nombre de a quién se le entrega, y qué se le da

Usuarios hacen peticiones, y esas peticiones le aparecen a otro usuario para que este mismo les de autorización, hasta que aparezca autorización se les da
Si ya no hay en inventario que aparezca el estatus como pedidos pendientes

Un usuario da de alta, baja y pide
Un usuario que autorice y que vea los reprotes de lo que se ha prestado, dos apartados, uno en el que autoriza y otro en el que checa lo que se debe de pedir
Un administrador que puede hacer todo, dar de alta usuarios

Nombre usuario y contraseña, departamento, puesto

Poner quién autorizó y nota si es que el administrador autoriza a nombre del jefe de área

