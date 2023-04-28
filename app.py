import string
import os
from flask import Flask, flash
from flask import render_template
from flask import request
from sqlite3 import Error
from flask import redirect, session
import sqlite3


app = Flask(__name__)
app.secret_key="abc"


# from flask import json, current_app as app
# # static/data/test_data.json
# filename = os.path.join(app.static_folder, 'Data', 'products.json')
# with open(filename) as test_file:
#     data = json.load(test_file)
#return render_template('product.html', data=data)


@app.route('/')
def home():
   return render_template('home.html')


@app.route('/register')
def register():
   return render_template('user_registration.html')


@app.route('/login')
def login():
   return render_template('user_login.html')


@app.route('/terms_of_use')
def terms_of_use():
   return render_template('terms_of_use.html')


@app.route('/privacy_policy')
def privacy_policy():
   return render_template('privacy_policy.html')


@app.route('/about_us')
def about_us():
   return render_template('about_us.html')


@app.route('/lip_products')
def lip_products():
   return render_template('lip_products.html')

@app.route('/eyeMakeup_Products')
def eyeMakeup_Products():
   return render_template('eyeMakeup_Products.html')

@app.route('/hair_products')
def hair_products():
   return render_template('hair_products.html')

@app.route('/body_lotions_creams')
def body_lotions_creams():
   return render_template('body_lotions_creams.html')

@app.route('/product')
def product():
   return render_template('product.html')

@app.route("/api/data")
def get_data():    
    return app.send_static_file("products.json")

@app.route('/contact_us')
def add_rec():
   return render_template('contact_us.html')


@app.route('/chart')
def chart():
   return render_template('chart.html')

@app.route('/user_reg_data', methods = ['GET', 'POST']) #default is get for all others
def user_reg_data():
    emailAddress = request.form['emailAddress']
    emailAddress = request.form.get('emailAddress', '')
    name = request.form['name']
    password = request.form['password']
    confirm = request.form['cpassword']
    phone = request.form['phone']

    if password != confirm:
        flash("Passwords don't match.")
        #return "Passwords don't match" + render_template('user_registration.html')
        return render_template('user_registration.html')

    elif request.method == 'POST':
        try:
            
            #connect to database
            with sqlite3.connect('database.db') as con:
                cur = con.cursor()
                cur.execute("INSERT INTO user_registration (emailAddress, name, password, phone) VALUES (?,?,?,?)", (emailAddress, name, password, phone))

                con.commit()
                msg = "Registered successfully"
        except:
            con.rollback()
            msg = "There was an error!!!"

        finally:
            con.close()
            return render_template('user_login.html')
        
@app.route('/user_login_data', methods = ['GET', 'POST']) #default is get for all others
def user_login_data():
    emailAddress = request.form['emailAddress']
    emailAddress = request.form.get('emailAddress', '')
    password = request.form['password']
   
    #return render_template('index.html')
    if request.method == 'POST':
        try:
            conn = None
            
            #connect to database
            with sqlite3.connect('database.db') as con:
                cur = con.cursor()
                cur.execute("Select password from  user_registration where emailAddress=?" , [emailAddress] )

                rows = cur.fetchall()
                #print(rows[0][0])

                if rows and rows[0][0]:
                    currentPassword = rows[0][0]
                    if currentPassword == password:
                        return render_template('index.html')
                    
                    else:
                        return "Incorrect Password"
                
        except Error as e:
                return e
                
    else:
        return "error"

@app.route('/index')
def index():
   return render_template('index.html')   

@app.route('/logout')
def logout():
    return redirect('/login')


if __name__ == '__main__':
      app.run(host='0.0.0.0', port=9000)

        
# @app.route('/user_login_data', methods = ['GET']) #default is get for all others
# def user_login_data():
#     if request.method == 'GET':
#         try:
#             emailAddress = request.form['emailAddress']
#             password = request.form['password']
#             #connect to database
#             with sqlite3.connect('database.db') as con:
#                 cur = con.cursor()
#                 cur.execute("SELECT emailAddress, password FROM user_registration WHERE emailAddress = {{ emailAddress }}") #? is placeholders

#                 con.commit()
#                 msg = "Retrieved successfully"
#         except:
#             con.rollback()
#             msg = "There was an error!!!"

#         finally:
#             con.close()
#             return render_template('index.html')
        
# @app.route('/user_login_data', methods=['GET', 'POST'])
# def user_login_data():
#     if request.method == 'POST':
#         username = request.form['username']
#         password = request.form['password']
#         # check if username and password match a user in the database
#         user = next((user for user in user_reg_data if user['username'] == username), None)
#         if user and check_password_hash(user['password'], password):
#             session['username'] = username
#             return redirect(url_for('index'))
#         else:
#             return render_template('login.html', error='Invalid username or password')
#     else:
#         return render_template('login.html')
    

# @app.route('/products')
# def list():
#     con = sqlite3.connect('database.db')
#     con.row_factory = sqlite3.Row

#     cur = con.cursor()
#     cur.execute('SELECT * from products')

#     cur.fetchall()
#     render_template('product.html')

#     con.close()



# @app.route('/user_login')
# def list():
#     con = sqlite3.connect('database.db')
#     con.row_factory = sqlite3.Row

#     cur = con.cursor()
#     cur.execute('SELECT * from user_registration')

#     cur.fetchall()
#     render_template('user_registration.html')

#     con.close()