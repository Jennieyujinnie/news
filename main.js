const API_KEY = 'e02cd15efef7407b8df9fd7a784babaa';
const NO_IMAGE_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU";
let newsList = []
const menus = document.querySelectorAll(".desktop-menus button, .side-menu-list button");
menus.forEach(menu => menu.addEventListener("click", (event) => getNewsByCategory(event)));
let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&apiKey=${API_KEY}`)

const getNews = async () => {
    try {
        const response = await fetch(url);

        const data = await response.json();
        if (response.status === 200) {
               if(data.articles.length === 0) {
                throw new Error("No result for this search");
               }
            newsList = data.articles;
            render();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        errorRender(error.message);
    }
};

const getLatestNews = async () => {
    url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&apiKey=${API_KEY}`);
    getNews();
};

const getNewsByCategory = async (event) => {
    const category = event.target.textContent.toLowerCase();
    console.log("category", category);
    url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`)
    getNews();
};

const formatPublishedDate = (date) => {
    if (!date) return "";
    return moment(date).fromNow();
};

const getNewsByKeyword = async () => {
    const keyword = document.getElementById("search-input").value.trim();
    if (!keyword) return;

    url = new URL("https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines");
    url.searchParams.set("country", "kr");
    url.searchParams.set("q", keyword);
    url.searchParams.set("apiKey", API_KEY);

    getNews();
};



const render = () => {
    if (!newsList || newsList.length === 0) {
        document.getElementById("news-board").innerHTML = `<p class="news-error">표시할 뉴스가 없습니다.</p>`;
        return;
    }

    const newsHTML = newsList.map(news => `
        <div class="row news">
            <div class="col-lg-4">
                <img class="news-img-size" src="${news.urlToImage || NO_IMAGE_URL}"
                    onerror="this.onerror=null; this.src='${NO_IMAGE_URL}'" />
            </div>
            <div class="col-lg-8">
                <h1>${news.title}</h1>
                <p>${news.description == null || news.description == ""
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

const errorRender = (errorMessage) => {
    const errorHTML = `<div class="alert alert-danger" role="alert">
  ${errorMessage}
</div>`;
    document.getElementById("news-board").innerHTML = errorHTML;
};

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
    getNewsByKeyword();
}