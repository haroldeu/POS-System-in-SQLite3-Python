from flask import Flask, request, redirect, render_template
from flask_sqlalchemy import SQLAlchemy
from flask.templating import render_template

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///thesis.db'
db = SQLAlchemy(app)

# Model
class Products(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    product_image = db.Column(db.LargeBinary, nullable=True)
    product_name = db.Column(db.String(255), nullable=False)
    product_price = db.Column(db.Integer, nullable=False)
    product_type = db.Column(db.String(4), nullable=False)
    product_unit = db.Column(db.String(9), nullable=False)

    def read_image(file_path):
        with open(file_path, 'rb') as f:
            return f.read()

    # Display the Data
    def __repr__(self):
        return f"ID: {self.id}, Name: {self.product_name}, Price: {self.product_price}, Type: {self.product_type}, Unit: {self.product_unit}"

with app.app_context():
    db.create_all()

# Example usage
image_path = 'static/images/tomato.jpg'
image_data = Products.read_image(image_path)

# Function to delete data
def delete_data(product_id):
    # Example deletion
    db.session.query(Products).filter(Products.id == product_id).delete()
    db.session.commit()

# Function to refresh the session
def refresh_session():
    db.session.expire_all()

@app.route('/')
def check():
    refresh_session()
    products = Products.query.all()
    return render_template('alchemy.html.j2', products=products)
 
@app.route('/delete', methods=['POST'])
def delete_product():
    product_id = request.form.get('id')
    delete_data(product_id)
    return redirect('/')


# Function to add a new product
def add_product(name, price, ptype, unit):
    new_product = Products(product_name=name, product_price=price, product_type=ptype, product_unit=unit)
    db.session.add(new_product)
    db.session.commit()

@app.route('/add')
def add():
    return render_template('add_product.html')

@app.route('/add_product', methods=['POST'])
def add_product_route():
    name = request.form.get('product_name')
    price = int(request.form.get('product_price'))  # Convert to int or appropriate data type
    ptype = request.form.get('product_type')
    unit = request.form.get('product_unit')
    
    add_product(name, price, ptype, unit)
    
    return redirect('/')


# Function to edit product price
def edit_product_price(product_id, new_price):
    product = Products.query.get(product_id)
    if product:
        product.product_price = new_price
        db.session.commit()
        return True
    else:
        return False

@app.route('/edit_price/<int:product_id>', methods=['GET', 'POST'])
def edit_price(product_id):
    if request.method == 'GET':
        return render_template('edit_price.html', product_id=product_id)
    elif request.method == 'POST':
        new_price = request.form.get('new_price')
        edit_product_price(product_id, new_price)
        return redirect('/')


 
if __name__ == '__main__':
    app.run(debug = True)