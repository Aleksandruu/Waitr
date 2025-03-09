CREATE SCHEMA IF NOT EXISTS public;

CREATE TABLE IF NOT EXISTS public.User (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.Category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.Product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ingredients TEXT,
    nutrients TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id INTEGER REFERENCES public.Category(id)
);

CREATE TABLE IF NOT EXISTS public.Order (
    id SERIAL PRIMARY KEY,
    table_number INTEGER NOT NULL,
    waiter_id INTEGER REFERENCES public.User(id)
);


CREATE TABLE IF NOT EXISTS public.ProductOrder (
    orderId INTEGER REFERENCES public.Order(id),
    productId INTEGER REFERENCES public.Product(id),
    quantity INTEGER NOT NULL,
    status VARCHAR(255) NOT NULL,
    PRIMARY KEY (orderId, productId)
);