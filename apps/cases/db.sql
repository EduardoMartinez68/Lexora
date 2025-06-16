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


CREATE TABLE IF NOT EXISTS casos (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
