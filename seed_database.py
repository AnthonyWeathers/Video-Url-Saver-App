"""
    Script to seed database.
    You'll have to enter the password to your server twice to have your database perform the drop and create db
    After doing that and no errors pop up, you're good to run 
"""

import os
import model
import server

os.system("dropdb video-player")

os.system('createdb video-player')

model.connect_to_db(server.app)

with server.app.app_context():
    model.db.create_all()