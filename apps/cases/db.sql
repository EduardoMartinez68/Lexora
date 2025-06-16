-- apps/ventas/db.sql
CREATE SCHEMA IF NOT EXISTS ventas;

CREATE TABLE IF NOT EXISTS ventas.productos (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  precio NUMERIC NOT NULL
);

CREATE TABLE IF NOT EXISTS ventas.facturas (
  id SERIAL PRIMARY KEY,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total NUMERIC
);
