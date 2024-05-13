import sqlite3

conn = sqlite3.connect('instance/thesis.db')
cursor = conn.cursor()


product_name = "Garlic"
product_price = 4
product_type = "Vegetable"
product_unit = "pcs"


# with open(r"C:/Users/John Harold/Documents/programming/thesis/POS-System-in-SQLite3-Python/templates/garlic.jpg", "rb") as f:
#     product_image = f.read()

# cursor.execute("""
#     INSERT INTO products (product_image, product_name, product_price, product_type, product_unit) VALUES (?, ?, ?, ?, ?)
# """, (product_image, product_name, product_price, product_type, product_unit))


m = cursor.execute("""
    SELECT * FROM products WHERE id=18
""")    

for x in m:
    print(x[1])
    # receive_data = x[1]

# with open ('test.png', 'wb') as f:
#     f.write(receive_data)

conn.commit()
cursor.close()
conn.close()