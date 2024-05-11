from flask import Flask, render_template, url_for
import sqlite3

app = Flask(__name__)

@app.route('/')
def index():
    # Connect to the Database
    conn = sqlite3.connect('thesis.db')
    c = conn.cursor()

    # Execute the query
    c.execute('SELECT * FROM products')

    # Fetch all the rows
    products = c.fetchall()

    return render_template("index.html.j2", products=products)

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)