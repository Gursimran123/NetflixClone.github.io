const apikey = "2b426ef7d385e530886f44cb452c2884";
const apiEndpoint = "https://api.themoviedb.org/3"
const imgPath= "https://image.tmdb.org/t/p/original";

const apiPaths = {
  fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,
  fetchMoviesList: (id) =>
    `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
  fetchTrending: `${apiEndpoint}/trending/all/day?api_key=${apikey}&language=en-US`,
  searchOnYoutube: (query) =>
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyBVjPxhKj0hy0I6coLGGqYBeJEqMMNtQ30`,
};

function init() {
    fetchTrendingMovies();
    fetchAndBuildAllSections();
}

function fetchTrendingMovies() {
    fetchAndBuildMovieSection(apiPaths.fetchTrending, "Trending Now")
    .then(list => {
        const randomIndex=parseInt(Math.random() * list.length)
        buildBannerSection(list[randomIndex]);
    }).catch(err=>{
        console.error(err);
    });
}

function buildBannerSection(movie){
    const bannerContainer=document.getElementById('banner-section');
    bannerContainer.style.backgroundImage= `url('${imgPath}${movie.backdrop_path}')`;

    const div=document.createElement('div');
    div.innerHTML = `
    <h2 class="banner-title">${movie.title}</h2>
            <p class="banner-info">Trending in movies | Release date- ${
              movie.release_date
            }</p>
            <p class="banner-overview">${
              movie.overview && movie.overview.length > 200
                ? movie.overview.slice(0, 200).trim() + "..."
                : movie.overview
            }</p>
            <div class="action-button-cont">
                <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard"><path d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z" fill="currentColor"></path></svg> &nbsp;&nbsp; Play</button>
                <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z" fill="currentColor"></path></svg> &nbsp;&nbsp; More Info</button>
            </div>
    `;
    div.className="banner-content container"
    bannerContainer.append(div);
}
function fetchAndBuildAllSections() {
    fetch(apiPaths.fetchAllCategories)
    .then(res => res.json())
    .then(res => {
        const categories= res.genres;
        if(Array.isArray(categories) && categories.length){
            categories.forEach(category => {
                 fetchAndBuildMovieSection(
                    apiPaths.fetchMoviesList(category.id),
                    category.name
                    );
            });
        }
        // console.log(movies);
    })
    .catch(err => console.error(err));
}

function fetchAndBuildMovieSection(fetchUrl, categoryName){
    console.log(fetchUrl,categoryName);
    return fetch(fetchUrl)
    .then(res=>res.json())
    .then(res=> {
        // console.log(res.results);
        const movies=res.results;
        if(Array.isArray(movies) && movies.length) {
            buildMoviesSection(movies.slice(0,5), categoryName);
        }
        return movies;
    })
    .catch(err=>console.error(err))
}

function buildMoviesSection(list, categoryName) {
   console.log(list, categoryName);

   const movieContainer= document.getElementById('movies-container');

   const moviesListHtml= list.map(item => {
    return `
       <div class="movie-item" onmouseenter="searchMovieTrailer('${item.title}', 'yt${item.id}')">
            <img class="move-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}" />
            <div class="iframe-wrap" id="yt${item.id}"></div>
        </div>`;
   }).join('');

   const moviesSectionHtml=`
      <h2 class="movie-section-heading">${categoryName}<span class="explore">Explore All</span></h2>
      <div class="movies-row">
         ${moviesListHtml}
      </div>
   `
   console.log(moviesSectionHtml);

   const div=document.createElement('div');
   div.className= "movies-section"
   div.innerHTML= moviesSectionHtml;

   movieContainer.append(div);
}

function searchMovieTrailer(movieName, iframeId){
    if(!movieName) return;

    fetch(apiPaths.searchOnYoutube(movieName))
      .then(res => res.json())
      .then(res => {
        const bestResult= res.items[0];
        const elements = document.getElementById(iframeId);
        console.log(elements, iframeId);

        const div = document.createElement("div");
        div.innerHTML = `<iframe width="245px" height="150px" src="https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0"></iframe>`;

        elements.append(div);

      })
      .catch(err => console.log(err));
}
window.addEventListener('load', function(){
    init();
    this.window.addEventListener('scroll', function(){
        const header=document.getElementById('header');
        if(window.scrollY>5)
        header.classList.add('black-bg')
        else
        header.classList.remove('black-bg')
    })
})