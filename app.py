from flask import Flask, render_template, url_for, request, redirect, jsonify
import sqlite3

app = Flask(__name__)

# Home Page of the System
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

# Deleting Database Record
@app.route('/delete_record', methods=['POST'])
def delete_record():
    record_id = request.form['record_id']

    # Connect to SQLite database
    conn = sqlite3.connect('thesis.db')
    cursor = conn.cursor()

    # Delete the record
    cursor.execute("DELETE FROM products WHERE id=?", (record_id,))
    conn.commit()

    # Close the database connection
    conn.close()

    return jsonify({'message': 'Record deleted successfully.'})


# Database Testing Page
@app.route('/testing')
def test():
    # Connect to the Database
    conn = sqlite3.connect('thesis.db')
    c = conn.cursor()

    # Execute the query
    c.execute('SELECT * FROM products')

    # Fetch all the rows
    products = c.fetchall()

    return render_template("test.html", products=products)


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)