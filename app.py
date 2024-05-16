from flask import Flask, render_template, url_for, request, redirect, jsonify
import sqlite3
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy as db
import os


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///thesis.db'
db = SQLAlchemy(app)


class Products(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_image = db.Column(db.String(255), nullable=True)
    product_name = db.Column(db.String(255), nullable=False)
    product_price = db.Column(db.Integer, nullable=False)
    product_type = db.Column(db.String(9), nullable=False)
    availability = db.Column(db.String(12), nullable=False)

with app.app_context():
    db.create_all()


# Home Page of the System
@app.route('/')
def index():
    # Connect to the Database
    conn = sqlite3.connect('instance/thesis.db')
    c = conn.cursor()

    # Execute the query
    c.execute('SELECT * FROM products ORDER BY product_name ASC')

    # Fetch all the rows
    products = c.fetchall()
    conn.close()

    return render_template("index.html.j2", products=products)

# Deleting Database Record
@app.route('/delete_record', methods=['POST'])
def delete_record():
    record_id = request.form['record_id']

    # Connect to SQLite database
    conn = sqlite3.connect('instance/thesis.db')
    cursor = conn.cursor()

    # Delete the record
    cursor.execute("DELETE FROM products WHERE id=?", (record_id,))
    conn.commit()

    # Close the database connection
    conn.close()

    return jsonify({'message': 'Record deleted successfully.'})

# Add Entry Route
@app.route('/add_product', methods=['POST'])
def add_product_route():
    conn = sqlite3.connect('instance/thesis.db')
    cursor = conn.cursor()

    image_file = request.files['product_image']
    upload_image = "images/"

    file_path = os.path.join(upload_image, image_file.filename)
    image_file.save(file_path)
    image = file_path

    name = request.form.get('product_name')
    price = int(request.form.get('product_price'))  # Convert to int or appropriate data type
    ptype = request.form.get('product_type')

    cursor.execute("""
    INSERT INTO products (product_image, product_name, product_price, product_type) VALUES (?, ?, ?, ?)
""", (image, name, price, ptype))

    conn.commit()
    cursor.close()
    conn.close()
    
    return redirect('/')

# Edit Product Route
@app.route('/edit', methods=['POST'])
def edit_product():
    product_id = request.form.get('id')
    new_price = request.form.get('editItemPrice')

    if edit_product_price(product_id, new_price):
        return redirect('/')
    else:
        return "Product not found."

# Function to edit product price
def edit_product_price(product_id, new_price):
    product = Products.query.get(product_id)
    if product:
        product.product_price = new_price
        db.session.commit()
        return True
    else:
        return False


@app.route('/get_item_details', methods=['POST'])
def add_to_cart():
    item_id = request.form['itemId']
    
    # Connect to your SQLite database
    conn = sqlite3.connect('instance/thesis.db')
    cursor = conn.cursor()
    
    # Execute a query to fetch all details for the given item ID
    cursor.execute("SELECT * FROM products WHERE id=?", (item_id,))
    item = cursor.fetchone()
    conn.close()
    
    if item:
        # Assuming the product table includes columns id, name, description, and price in this order
        item_details = {
            'id': item[0],
            'product_name': item[2],
            'product_price': item[3],
            'product_type': item[4]
        }
        return jsonify(item_details)
    else:
        return jsonify({'error': 'Item not found'}), 404

# Archive function
@app.route('/archive_product', methods=['POST'])
def archive_product():
    product_id = request.form['productId']
    
    # Connect to your database
    conn = sqlite3.connect('instance/thesis.db')
    cursor = conn.cursor()
    
    # Update the availability of the product to 'False'
    cursor.execute("UPDATE products SET availability='False' WHERE id=?", (product_id,))
    conn.commit()
    conn.close()
    
    # Redirect or respond as necessary
    return jsonify({'success': 'Product has been archived'}), 200


@app.route('/archive_product_list', methods=['GET'])
def archive_product_list():
    # Connect to the Database
    conn = sqlite3.connect('instance/thesis.db')
    c = conn.cursor()

    # Execute the query
    c.execute('SELECT * FROM products')

    # Fetch all the rows
    products = c.fetchall()

    return render_template("archive-wrapper.html", products=products)


###########################################################

# Database Testing Page
@app.route('/testing')
def test():
    # Connect to the Database
    conn = sqlite3.connect('instance/thesis.db')
    c = conn.cursor()

    # Execute the query
    c.execute('SELECT * FROM products')

    # Fetch all the rows
    products = c.fetchall()

    return render_template("test.html", products=products)

## for testing
@app.route('/edit_price', methods=['POST'])
def edit_price():
    product_id = request.form.get('product_id')
    new_price = request.form.get('new_price')
    edit_product_price(product_id, new_price)
    return redirect('/')




if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)