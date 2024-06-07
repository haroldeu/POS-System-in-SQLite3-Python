-- !!!!!!!!!!!!!!!! WAGGGGGG !!!!!!!!!!!!!!!
-- DROP TABLE PRODUCTS;
-- DROP TABLE USERS;

-- CREATE TABLE products (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     product_image BLOB,
--     product_name TEXT NOT NULL,
--     product_price int NOT NULL,
--     product_type TEXT NOT NULL,
    -- product_unit TEXT
-- );

-- INSERT INTO products (product_image, product_name, product_price, product_type, product_unit)
-- VALUES (NULL, 'Pechay', 55, 'Vegetable', 'kilo');
-- VALUES (NULL, 'Apple', 55, 'Fruit', 'pcs');

-- ALTER TABLE products ADD COLUMN availability TEXT DEFAULT 'True' NOT NULL;





-- CREATE TABLE password (
--     password TEXT
-- );


-- DELETE FROM password WHERE password=0;


-- CREATE TABLE IF NOT EXISTS users (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     username TEXT,
--     name TEXT NOT NULL,
--     password_hash TEXT NOT NULL
-- );

-- create table temp;

-- INSERT INTO users (id, name, password_hash)
-- SELECT id, name, password_hash
-- FROM temp;


-- UPDATE users SET username='kero' WHERE id=2;

SELECT * FROM products;

SELECT * FROM users;




