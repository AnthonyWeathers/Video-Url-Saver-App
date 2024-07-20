// src/App.js
import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Upload from './components/Upload'
import VideoList from './components/VideoList'

function App() {

    return (
        <div className='block-container'>
          <Router>
              <Routes>
                <Route path="/" element={<Upload  />} />
                <Route path="/Videos" element={<VideoList  />} />
              </Routes>
          </Router>
        </div>
      );
}

export default App;