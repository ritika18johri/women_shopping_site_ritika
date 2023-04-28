import sqlite3

conn = sqlite3.connect('database.db')
print("opened database successfully")

conn.execute('create table user_registration (emailAddress TEXT, name TEXT, password TEXT, phone TEXT)')
print("Created user registration table table successfully.")



conn.close()