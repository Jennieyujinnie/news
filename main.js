const API_KEY = 'fuKC7h6FqYuQdWde83XUCyB1CxuYMIdDrY5hneuQ';
const getLatestNews = async() => {
    const url = new URL (`https://api.thenewsapi.com/v1/news/top?api_token=${API_KEY}&locale=us&limit=3`);
    
    const response = await fetch(url);
    const data = await response.json();
    console.log("dddddd", response);
};

getLatestNews();