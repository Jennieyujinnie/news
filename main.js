const API_KEY = 'e02cd15efef7407b8df9fd7a784babaa';
const NO_IMAGE_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU";
let newsList = []
const menus = document.querySelectorAll(".desktop-menus button, .side-menu-list button");
menus.forEach(menu=>menu.addEventListener("click",(event)=>getNewsByCategory(event)));

const getLatestNews = async () => {
    const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);

    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles;
    render();
    console.log("dddddd", newsList);
};

const getNewsByCategory =  async (event) => {
    const category = event.target.textContent.toLowerCase();
    console.log("category", category);
    const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`)
    const response = await fetch(url);
    const data = await response.json();
    console.log("ddd",  data);
    newsList = data.articles;
    render();
};

const formatPublishedDate = (date) => {
    if (!date) return "";
    return moment(date).fromNow();
};

const render = () => {
    const newsHTML = newsList.map(news => `
        <div class="row news">
            <div class="col-lg-4">
                <img class="news-img-size" src="${news.urlToImage || NO_IMAGE_URL}"
                    onerror="this.onerror=null; this.src='${NO_IMAGE_URL}'" />
            </div>
            <div class="col-lg-8">
                <h1>${news.title}</h1>
                <p>${
                    news.description == null || news.description == ""
                        ? "내용없음"
                        : news.description.length > 200
                        ? news.description.substring(0, 200) + "..."
                        : news.description
                }</p>
                <div>${(news.source && news.source.name) || "no source"}  ${formatPublishedDate(news.publishedAt)}</div>
            </div>
        </div>
    `).join('');

    document.getElementById("news-board").innerHTML = newsHTML;
}

getLatestNews();

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function openSearchBox() {
    const inputArea = document.getElementById("input-area");
    if (inputArea.style.display === "inline") {
        inputArea.style.display = "none";
    } else {
        inputArea.style.display = "inline";
    }
}

function searchNews() {
    const keyword = document.getElementById("search-input").value;
    console.log("search:", keyword);
}