import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';

const Show = ({ text, onBtnClick }) => {
  return (
    <button className="btn" onClick={onBtnClick}>
      {text} Video
    </button>
  );
};

const Save = ({ onBtnClick }) => {
  return (
    <button className="btn" onClick={onBtnClick}>
      Save Video
    </button>
  );
};

const Upload = () => {
  const [url, setUrl] = useState('');
  const [video, setVideo] = useState('');
  const [videoSubmitted, setVideoSubmitted] = useState(false);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [showTitleInput, setShowTitleInput] = useState(false);
  const [error, setError] = useState(null);

  const handleVideo = (e) => {
    e.preventDefault();
    setVideoSubmitted(true);
    setShow(true);
    setUrl(video);
    setVideo('');
    setError(null);
  };

  const handleShowVideo = () => {
    setShow(!show);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setShowTitleInput(true);
  };

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    const videoTitle = title.trim() === '' ? url : title.trim();

    fetch(`http://localhost:8000/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, title: videoTitle }),
      credentials: 'include'
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        if (data.save) {
          alert(data.message);
          setUrl('');
          setVideoSubmitted(false);
          setShowTitleInput(false);
          setTitle('');
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  const handleError = () => {
    alert('Invalid video URL. Please provide a valid video URL.')
    setShow(false);
  };

  return (
    <div className="upload-container">
      <button className="nav-btn" onClick={() => navigate('/Videos')}>Saved Videos</button>

      <form id="upload-form" onSubmit={handleVideo}>
        <label htmlFor="video-upload">Video URL:</label>
        <input
          type="text"
          id="video-upload"
          name="video"
          value={video}
          onChange={(e) => setVideo(e.target.value)}
          required
        />
        <button type="submit" id="guess-submit" className="button-style">Enter</button>
      </form>

      {error && <div className="error-message">{error}</div>}

      <div className="player-placeholder">
        {show && (
          <ReactPlayer
            url={url}
            controls={true}
            width="100%"
            height="100%"
            config={{
              youtube: {
                playerVars: { autoplay: 0 }
              }
            }}
            onError={handleError}
          />
        )}
      </div>

      {videoSubmitted && (
        <section className='jukebox-btns'>
          <Show text={show ? 'Hide' : 'Show'} onBtnClick={handleShowVideo} />
          <Save onBtnClick={handleSave} />
        </section>
      )}

      {showTitleInput && (
        <form id="title-form" onSubmit={handleTitleSubmit}>
          <label htmlFor="video-title">Video Title:</label>
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
  );
};

export default Upload;