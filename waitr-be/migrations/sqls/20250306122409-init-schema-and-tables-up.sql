CREATE SCHEMA IF NOT EXISTS public;

CREATE TABLE
    IF NOT EXISTS public.Location (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        slug VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        logo BYTEA,
        logo_mime TEXT,
        color VARCHAR(255) NOT NULL,
        active BOOLEAN NOT NULL DEFAULT FALSE,
        tables INTEGER NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS public.User (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        username VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        location_id UUID NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS public.Category (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        name VARCHAR(255) NOT NULL,
        location_id UUID NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS public.Product (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        name VARCHAR(255) NOT NULL,
        ingredients TEXT,
        nutrients TEXT,
        allergens TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category_id UUID REFERENCES public.Category (id),
        initial_status VARCHAR(255) NOT NULL,
        photo_url VARCHAR(255)
    );

CREATE TABLE
    IF NOT EXISTS public.Order (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        table_number INTEGER NOT NULL,
        waiter_id UUID REFERENCES public.User (id),
        location_id UUID NOT NULL,
        order_time TIMESTAMP DEFAULT NOW ()
    );

CREATE TABLE
    IF NOT EXISTS public.ProductOrder (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        order_id UUID REFERENCES public.Order (id),
        product_id UUID REFERENCES public.Product (id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        quantity INTEGER NOT NULL,
        status VARCHAR(255) NOT NULL,
        preferences TEXT
    );