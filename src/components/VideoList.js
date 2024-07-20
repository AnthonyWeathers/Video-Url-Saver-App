import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';

const Show = ({ text, onBtnClick }) => {
  return (
    <button className="btn" onClick={onBtnClick}>
      {text} Video
    </button>
  );
};

const Edit = ({ onBtnClick }) => {
  return (
    <button className="btn" onClick={onBtnClick}>
      Edit Video Title
    </button>
  );
};

const Next = ({ onBtnClick }) => {
  return (
    <button className="btn" onClick={onBtnClick}>
      Next
    </button>
  );
};

const Prev = ({ onBtnClick }) => {
  return (
    <button className="btn" onClick={onBtnClick}>
      Prev
    </button>
  );
};

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [show, setShow] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [currentVideoEdit, setCurrentVideoEdit] = useState(null);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [showTitleInput, setShowTitleInput] = useState(false);

  useEffect(() => {
    fetchVideos(currentPage);
  }, [currentPage]);

  const fetchVideos = (page) => {
    fetch(`http://localhost:8000/videos?page=${page}`, {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setVideos(data.videos);
        } else {
          alert(data.message);
        }
      })
      .catch(error => console.error('Error loading videos:', error));
  };

  const handleShowVideo = url => {
    setCurrentVideo(currentVideo === url ? null : url);
  };

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDelete = (videoId) => {
    fetch(`http://localhost:8000/delete`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: videoId })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          fetchVideos(currentPage);
        } else {
          alert(data.message);
        }
      })
      .catch(error => console.error('Error deleting video:', error));
  };

  const handleEdit = url => {
    setCurrentVideoEdit(currentVideoEdit === url ? null : url);
    setShowTitleInput(true);
  };

  const handleEditTitle = (e, videoId) => {
    e.preventDefault();
    const videoTitle = title.trim();
    setTitle('');
    fetch(`http://localhost:8000/edit`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: videoId, title: videoTitle })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert(data.message);
          if (currentVideo) {
            setCurrentVideo(null);
          }
          fetchVideos(currentPage);
          setShowTitleInput(false);
        } else {
          alert(data.message);
        }
      })
      .catch(error => console.error('Error editing video:', error));
  };

  return (
    <div className="video-list-container">
      <button className="nav-btn" onClick={() => navigate('/')}>Upload</button>

      <div className="video-list">
        {videos.map(video => (
          <div key={video.id} className="video-item">
            <h3>{video.title}</h3>
            <div className="player-placeholder">
              {currentVideo === video.videoURL && (
                <ReactPlayer
                  url={video.videoURL}
                  controls={true}
                  width="100%"
                  height="100%"
                  config={{
                    youtube: {
                      playerVars: { autoplay: 0 }
                    }
                  }}
                />
              )}
            </div>
            <button onClick={() => handleDelete(video.id)}>Delete</button>

            <Show
              text={currentVideo === video.videoURL ? 'Hide' : 'Show'}
              onBtnClick={() => handleShowVideo(video.videoURL)}
            />
            <Edit onBtnClick={() => handleEdit(video.videoURL)} />

            {showTitleInput && currentVideoEdit === video.videoURL && (
              <form id="title-form" onSubmit={(e) => handleEditTitle(e, video.id)}>
                <label htmlFor="video-title">New Video Title:</label>
                <input
                  type="text"
                  id="video-title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <button type="submit" id="title-submit" className="button-style">Save</button>
              </form>
            )}
          </div>
        ))}
      </div>

      <div className='change-btns'>
        <Prev onBtnClick={handlePrev} />
        <Next onBtnClick={handleNext} />
      </div>
    </div>
  );
};

export default VideoList;