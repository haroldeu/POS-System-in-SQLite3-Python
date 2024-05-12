from flask import Flask, render_template, url_for, request, redirect, jsonify
import sqlite3
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy as db


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///thesis.db'
db = SQLAlchemy(app)


class Products(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_image = db.Column(db.String(255), nullable=True)
    product_name = db.Column(db.String(255), nullable=False)
    product_price = db.Column(db.Integer, nullable=False)
    product_type = db.Column(db.String(4), nullable=False)
    product_unit = db.Column(db.String(9), nullable=False)

with app.app_context():
    db.create_all()


# Home Page of the System
@app.route('/')
def index():
    # Connect to the Database
    conn = sqlite3.connect('instance/thesis.db')
    c = conn.cursor()

    # Execute the query
    c.execute('SELECT * FROM products')

    # Fetch all the rows
    products = c.fetchall()

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
    name = request.form.get('product_name')
    price = int(request.form.get('product_price'))  # Convert to int or appropriate data type
    ptype = request.form.get('product_type')
    unit = request.form.get('product_unit')
    
    add_product(name, price, ptype, unit)
    
    return redirect('/')

# Add Entry Function
def add_product(name, price, ptype, unit):
    new_product = Products(product_name=name, product_price=price, product_type=ptype, product_unit=unit)
    db.session.add(new_product)
    db.session.commit()
    


# Function to edit product price
def edit_product_price(product_id, new_price):
    product = Products.query.get(product_id)
    if product:
        product.product_price = new_price
        db.session.commit()
        return True
    else:
        return False

@app.route('/edit_price', methods=['POST'])
def edit_price():
    product_id = request.form.get('product_id')
    new_price = request.form.get('new_price')
    edit_product_price(product_id, new_price)
    return redirect('/')





@app.route('/get_item_details', methods=['POST'])
def get_item_details():
    item_id = request.form['itemId']

    conn = sqlite3.connect('instance/thesis.db')
    cursor = conn.cursor()

    cursor.execute("SELECT product_price FROM products WHERE id=?", (item_id,))
    item = cursor.fetchone()

    conn.close()

    if item:
        item_details = {
            'id': item_id,
            'product_price': item[0]  # Changed from item[3] to item[0]
        }
        return jsonify(item_details)
    else:
        return jsonify({'error': 'Item not found'})
    

@app.route('/edit', methods=['POST'])
def edit_product():
    product_id = request.form.get('id')
    new_price = request.form.get('new_price')
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


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)