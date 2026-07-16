Importante:

Panel admin:

- Imagenes
    - Crear Produto:
        - Las imagenes se suben mediante path y no se pueden seleccionar como un emun por ejemplo.

    - Editar Producto:
        - Por mas de que no se toque una imagen, se borra la imagen del producto al confirmar edicion.
        - No se muestran las imagenes ya cargadas y tampoco se pùeden moficar, si fuera necesario.

- Gestión de pedidos 
    - Crear una pagina de Gestión de pedidos (endpoints ya listos, falta la pantalla — similar a AdminProductos.jsx),

    - Poder cambiar el estado de los pedidos.

    - Endpoint "mis pedidos" + autocompletar checkout con datos de cliente vinculado a usuario (Pregunar que se quiso decir con esto)

    - Decisión de negocio: el pedido se guarda en BD apenas se confirma el diálogo, antes de que el cliente efectivamente envíe el WhatsApp — puede generar "pedidos fantasma" en estado pendiente
    - Solución: 
      UPDATE pedido
        SET estado = 'cancelado'
        WHERE estado = 'pendiente'
        AND fecha < NOW() - INTERVAL 48 HOUR;

    - Marcar como cancelado automatica despues de  semana como pendiente.
    - Algo importante seria poder borrar estos pedidos para no llenar la base de datos con estos pedidos fantasma.