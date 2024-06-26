#from wsgiref.validate import validator
from flask import Flask, flash, render_template, url_for, request, redirect, jsonify
import sqlite3, os, time
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy as db
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from flask_wtf import FlaskForm
from wtforms import SubmitField, PasswordField
from wtforms.validators import DataRequired, Length, EqualTo
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///thesis.db'
db = SQLAlchemy(app)
app.config['SECRET_KEY'] = "this is my secret key"


# Flask Login Stuff
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(int(user_id))

class Users(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    username = db.Column(db.String(200), nullable=False, unique=True)
    # Do password stuff (input, hashing, etc)
    password_hash = db.Column(db.String(128), nullable=False)

    # Create a String
    def __repr__(self):
        return '<Name %r>' % self.name

    @property
    def password(self):
        raise AttributeError("Password is not a readable attribute.")
    
    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

class Products(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_image = db.Column(db.String(255), nullable=True)
    product_name = db.Column(db.String(255), nullable=False)
    product_price = db.Column(db.Integer, nullable=False)
    product_type = db.Column(db.String(9), nullable=False)
    availability = db.Column(db.String(12), nullable=False)

with app.app_context():
    db.create_all()


# Cart Page of the System
@app.route('/cart')
def cart():
    # Connect to the Database
    products = Products.query.order_by(Products.product_name).all()

    return render_template("index.html", products=products)

# Admin Page of the System
@app.route('/admin', methods=['GET', 'POST'])
@login_required
def admin():
    # Connect to the Database
    products = Products.query.order_by(Products.product_name).all()

    our_users = Users.query.order_by(Users.id).all()

    return render_template("admin-wrapper.html", products=products, our_users=our_users, current_user=current_user)


# Archived Page of the System
@app.route('/archived_products')
def archived_products():
    # Connect to the Database
    products = Products.query.order_by(Products.product_name).all()

    return render_template("archive-wrapper.html", products=products)



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
    price = int(request.form.get('product_price'))
    ptype = request.form.get('product_type')
    availability = "True"

    cursor.execute("""
    INSERT INTO products (product_image, product_name, product_price, product_type, availability) VALUES (?, ?, ?, ?, ?)
""", (image, name, price, ptype, availability))

    conn.commit()
    cursor.close()
    conn.close()
    
    return redirect('/admin')

# Edit Product Route
@app.route('/edit', methods=['POST'])
def edit_product():
    product_id = request.form.get('id')
    new_price = request.form.get('editItemPrice')

    if edit_product_price(product_id, new_price):
        return redirect(url_for('admin'))
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


# @app.route('/archive_product_list', methods=['GET'])
# def archive_product_list():
#     # Connect to the Database
#     conn = sqlite3.connect('instance/thesis.db')
#     c = conn.cursor()

#     # Execute the query
#     c.execute('SELECT * FROM products')

#     # Fetch all the rows
#     products = c.fetchall()

#     return render_template("archive-wrapper.html", products=products)

# Archive function
@app.route('/unarchive_product', methods=['POST'])
def unarchive_product():
    product_id = request.form['productId']
    
    # Connect to your database
    conn = sqlite3.connect('instance/thesis.db')
    cursor = conn.cursor()
    
    # Update the availability of the product to 'True'
    cursor.execute("UPDATE products SET availability='True' WHERE id=?", (product_id,))
    conn.commit()
    conn.close()
    
    # Redirect or respond as necessary
    return jsonify({'success': 'Product has been unarchived'}), 200


# Admin Authentication
# Create a Form Class for Signup
""" class SignUpForm(FlaskForm):
    name = StringField("Name: ", validators=[DataRequired()], render_kw={"placeholder": "Name"})
    username = StringField("Username: ")
    password_hash = PasswordField("Password: ", validators=[DataRequired(), EqualTo('password_hash2', message='Passwords must match!')], render_kw={"placeholder": "Password"})
    password_hash2 = PasswordField("Confirm Password: ", validators=[DataRequired()], render_kw={"placeholder": "Confirm Password"})
    submit = SubmitField("Sign Up") """

# Create a Form Class for Login 
class LoginForm(FlaskForm):
    #username = StringField("Username: ",validators=[DataRequired()], render_kw={"placeholder": "Username"})
    password = PasswordField("Password: ",validators=[DataRequired()], render_kw={"placeholder": "Password"})
    submit = SubmitField("Login as Admin")

@app.route('/', methods=['GET', 'POST'])
def login():
    error_message_login = None
    loginForm = LoginForm()
    #name = None
    #username = 'admin'
    #password = None
    #error_message_signup = None
    #signupForm = SignUpForm()
    
    if request.method == 'POST':
        if loginForm.validate_on_submit():
            user = Users.query.filter_by(username='admin').first()
            if user and check_password_hash(user.password_hash, loginForm.password.data):
                login_user(user)
                return redirect(url_for('admin'))
            elif user is None:
                error_message_login = "User does not exist."
            else:
                error_message_login = "Wrong Password! Try again."


        """ elif signupForm.validate_on_submit():
            user = Users.query.filter_by(name=signupForm.username.data).first()
            if user:
                error_message_signup = "Username already exists."
            elif user is None:
                # Hash the password
                hashed_pw = generate_password_hash(signupForm.password_hash.data)
                user = Users(name=signupForm.name.data, username=signupForm.username.data, password_hash=hashed_pw)
                db.session.add(user)
                db.session.commit()
            #elif signupForm.username.data
            
            name = signupForm.name.data
            
            signupForm.name.data = ''
            signupForm.username.data = ''
            signupForm.password_hash.data = '' """

    
    return render_template("flask-login.html", error_message_login=error_message_login, loginForm = loginForm)

@app.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/check_login')
def check_login():
    if current_user.is_authenticated:
        return redirect(url_for('admin'))
    else:
        flash("You are not currently logged in.")
        return redirect(url_for('cart'))
    
@app.route('/reset_password', methods=['GET'])
def reset_password():
    hashed_pw = generate_password_hash('admin')
    user = db.session.query(Users).filter_by(username='admin').first()
    user.password_hash = hashed_pw
    db.session.commit()

    return redirect(url_for('login'))
    

class ChangePasswordForm(FlaskForm):
    current_password = PasswordField("Current Password: ",validators=[DataRequired()], render_kw={"placeholder": "Current Password"})
    new_password = PasswordField("New Password: ", validators=[DataRequired(), Length(min=6, max=80), EqualTo('confirm_password', message='Passwords must match!')], render_kw={"placeholder": "Password"})
    confirm_password = PasswordField("Confirm Password: ", validators=[DataRequired()], render_kw={"placeholder": "Confirm Password"})
    submit = SubmitField("Change Password")

@app.route('/change_password', methods=['GET', 'POST'])
def change_password():
    error = None
    form = ChangePasswordForm()

    if request.method == 'POST':
        if form.validate_on_submit():
            user = db.session.query(Users).filter_by(username='admin').first()
            if user and check_password_hash(user.password_hash, form.current_password.data):
                hashed_pw = generate_password_hash(form.new_password.data)
                user.password_hash = hashed_pw
                db.session.commit()
                #error = "Password updated successfully!"
                return redirect(url_for('login'))
            else:
                error = "Current password is incorrect."
        else:
            error = form.errors

    return render_template('flask-resetPass.html', form=form, error=error)




       

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)