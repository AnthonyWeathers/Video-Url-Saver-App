"""CRUD operations."""

from model import db, Video, connect_to_db
from sqlalchemy import or_
from sqlalchemy.orm import Session



def create_video(title, videoURL):
    """ Create and return a new saved video """
    video = Video(title=title, videoURL=videoURL)
    return video

def get_video_by_id(id):
    """Return a video by id."""
    return Video.query.get(id)

def get_videos_in_batches(session: Session, batch_size=5, page=1):
    """Return videos in batches."""
    offset = (page - 1) * batch_size
    return session.query(Video).limit(batch_size).offset(offset).all()

if __name__ == '__main__':
    from server import app
    connect_to_db(app)