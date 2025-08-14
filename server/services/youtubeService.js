const { google } = require('googleapis');
require('dotenv').config();

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

async function findVideoForLesson(lessonTitle) {
  if (!process.env.YOUTUBE_API_KEY) {
    console.log('YouTube API key not found, skipping video enrichment.');
    return null;
  }

  try {
    const response = await youtube.search.list({
      part: 'snippet',
      q: `${lessonTitle} tutorial explained simply`,
      type: 'video',
      videoDuration: 'short',
      maxResults: 1,
    });

    if (response.data.items && response.data.items.length > 0) {
      return response.data.items[0].id.videoId;
    }
    return null;

  } catch (error) {
    console.error('Error searching YouTube:', error.message);
    return null;
  }
}

module.exports = { findVideoForLesson };