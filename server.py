from flask import Flask, request, jsonify
import jinja2
from model import connect_to_db, db
import os
import crud

# used to get the batches of 5 videos
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


from flask_cors import CORS

app = Flask(__name__)
app.secret_key = 'dev'
app.jinja_env.undefined = jinja2.StrictUndefined # for debugging purposes

CORS(app, supports_credentials=True, origins=["http://localhost:3000"])  # Enable CORS for all routes
# setting origins ensures that the backend connects to the port 3000 that the React server is hosted on, change if using a different
# port for the React side

@app.route("/save", methods=["POST"])
def save():
    url = request.json.get("url")
    title = request.json.get("title")

    video = crud.create_video(title=title, videoURL=url)
    if video:
        db.session.add(video)
        db.session.commit()

        return jsonify({
            "save": True,
            "message": 'Video saved'
        })
    else:
        return jsonify({
            "save": False,
            "message": 'Error with saving video'
        })
    
# New endpoint to retrieve videos in batches of 5
@app.route("/videos", methods=["GET"])
def get_videos_in_batches():
    """Retrieves videos in batches of 5."""
    page = int(request.args.get('page', 1))
    batch_size = 5

    # Create a new session to keep track of where user is in terms of the video list if multiple pages of 5 videos exist
    engine = create_engine(os.environ['POSTGRES_URI'])
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()

    try:
        videos = crud.get_videos_in_batches(session, batch_size=batch_size, page=page)
        if videos:
            return jsonify({
                "success": True,
                "videos": [video.to_dict() for video in videos],  # Using the to_dict method made in model.py for video
            })
        else:
            return jsonify({
                "success": False,
                "message": 'No more videos to retrieve'
            })
    finally:
        session.close()
    
@app.route("/delete", methods=["POST"])
def delete():
    """ Deletes selected saved video"""

    video_id = request.json.get("id")

    video = crud.get_video_by_id(video_id)
    if video:
        db.session.delete(video)
        db.session.commit()
        return jsonify({
            "success": True,
            "message": "Video deleted",
        })
    else:
        return jsonify({
            "success": False,
            "message": 'Error with deleting the video'
        })
    
@app.route("/edit", methods=["POST"])
def edit():
    """ Edits the title of the selected saved video"""

    video_id = request.json.get("id")
    new_title = request.json.get("title")

    video = crud.get_video_by_id(video_id)
    if video:
        video.title = new_title
        db.session.commit()
        return jsonify({
            "success": True,
            "message": "Video title edited",
        })
    else:
        return jsonify({
            "success": False,
            "message": 'Error with editing the video`s title'
        })


if __name__ == "__main__":
#    app.env = "development"
    connect_to_db(app, echo=False)
    app.run(debug = True, port = 8000, host = "localhost")