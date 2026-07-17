const API_KEY = 'e02cd15efef7407b8df9fd7a784babaa';
const NO_IMAGE_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU";
let newsList = []
const menus = document.querySelectorAll(".desktop-menus button, .side-menu-list button");
menus.forEach(menu => menu.addEventListener("click", (event) => getNewsByCategory(event)));
let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&apiKey=${API_KEY}`)
let totalResults = 0
let page = 1
const pageSize = 10
const groupSize = 5


const getNews = async () => {
    try {
        url.searchParams.set("page", page);
        url.searchParams.set("pageSize", pageSize);

        const response = await fetch(url);

        const data = await response.json();
        console.log("ddd", data);
        if (response.status === 200) {
            if (data.articles.length === 0) {
                throw new Error("No result for this search");
            }
            newsList = data.articles;
            totalResults = data.totalResults;
            render();
            paginationRender();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        errorRender(error.message);
    }
};

const getLatestNews = async () => {
    page = 1;
    url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&apiKey=${API_KEY}`);
    getNews();
};

const getNewsByCategory = async (event) => {
    page = 1;
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

    page = 1;
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



const paginationRender = () => {
    const totalPages = Math.ceil(totalResults / pageSize);
    const totalPageGroups = Math.ceil(totalPages / groupSize) || 1;
    const pageGroup = Math.ceil(page / groupSize);
    let lastPage = pageGroup * groupSize;
    if (lastPage > totalPages) {
        lastPage = totalPages;
    }

    const firstPage = Math.max(1, lastPage - (groupSize - 1));

    let paginationHTML = ``;

    if (pageGroup > 1) {
        const prevGroupFirstPage = (pageGroup - 2) * groupSize + 1;
        paginationHTML += `<li class="page-item" onclick="moveToPage(${prevGroupFirstPage})"><a class="page-link">&lt;&lt;</a></li>`;
        paginationHTML += `<li class="page-item" onclick="moveToPage(${page - 1})"><a class="page-link">&lt;</a></li>`;
    }

    for (let i = firstPage; i <= lastPage; i++) {
        paginationHTML += `<li class="page-item ${
            i === page ? "active" : ""
        }" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`;
    }

    if (pageGroup < totalPageGroups) {
        paginationHTML += `<li class="page-item" onclick="moveToPage(${page + 1})"><a class="page-link">&gt;</a></li>`;
        const nextGroupFirstPage = pageGroup * groupSize + 1;
        paginationHTML += `<li class="page-item" onclick="moveToPage(${nextGroupFirstPage})"><a class="page-link">&gt;&gt;</a></li>`;
    }

    document.querySelector(".pagination").innerHTML = paginationHTML;
}


function moveToPage(pageNum) {
    const totalPages = Math.ceil(totalResults / pageSize);
    if (pageNum < 1 || pageNum > totalPages) return;

    page = pageNum;
    getNews();
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
    getNewsByKeyword();
}