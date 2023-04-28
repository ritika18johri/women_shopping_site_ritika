import sqlite3

conn = sqlite3.connect('database.db')
print("opened database successfully")

conn.execute('drop table user_registration')
print("dropped user registration table table successfully.")

# conn.execute('drop table contact_us')
# print("dropped contact_us table table successfully.")

# conn.execute('drop table products')
# print("dropped products table table successfully.")

conn.close()