USE Speedy;

ALTER TABLE pedidos
ADD COLUMN metodo_pago VARCHAR(50) DEFAULT 'Efectivo',
ADD COLUMN notas TEXT,
ADD COLUMN direccion_origen TEXT,
ADD COLUMN tipo_servicio VARCHAR(50) DEFAULT 'delivery';
