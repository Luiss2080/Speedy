-- Migration: Add conductor_id to pedidos table
-- Created at: 2026-01-29

ALTER TABLE pedidos
ADD COLUMN conductor_id INT NULL,
ADD CONSTRAINT fk_pedidos_conductor
FOREIGN KEY (conductor_id) REFERENCES repartidores(id) ON DELETE SET NULL;
