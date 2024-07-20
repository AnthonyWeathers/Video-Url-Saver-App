import os
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Video(db.Model):

    __tablename__ = "videos"

    id = db.Column(db.Integer, primary_key = True, autoincrement = True)
    title = db.Column(db.String(255) , nullable = False)
    videoURL = db.Column(db.String(255) , nullable = False)

    def to_dict(self):
        """Convert Video object to dictionary."""
        return {
            "id": self.id,
            "title": self.title,
            "videoURL": self.videoURL
        }

def connect_to_db(flask_app, echo=True):
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["POSTGRES_URI"]
    flask_app.config["SQLALCHEMY_ECHO"] = echo
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.app = flask_app
    db.init_app(flask_app)

    print("Connected to the db!")

if __name__ == "__main__":
    from server import app

    # Call connect_to_db(app, echo=False) if your program output gets
    # too annoying; this will tell SQLAlchemy not to print out every
    # query it executes.

    connect_to_db(app, echo=False)