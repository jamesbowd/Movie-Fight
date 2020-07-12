// Calls the autocomplete function passing certain objects
createAutoComplete({
  // Where in the HTML the autocomplete is
  root: document.querySelector(".autocomplete"),

  // What the autocomplete dropdown should show
  renderOption(movie) {
    // Turnery expression: set imgSrc to "" if there is no poster and the poster link if there is
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    // What you want the autocomplete to display
    return `
    <img src="${imgSrc}" />
    ${movie.Title}
  `;
  },

  // Run onMovieSelect when you select an option from the autocomplete
  onOptionSelect(movie) {
    onMovieSelect(movie);
  },

  // Display movie.Title as the input when you select an auto select option
  inputValue(movie) {
    return movie.Title;
  },

  // Where you are getting the api data from and what it needs to return
  async fetchData(searchTerm) {
    const response = await axios.get("http://www.omdbapi.com", {
      params: {
        apikey: "44e15dbc",
        s: searchTerm,
      },
    });
    // This is based on the API returning an error if there are no movies matching the search
    if (response.data.Error) {
      return [];
    }
    return response.data.Search;
  },
});

// When you select a movie from the dropdown query the API for the full details then update the HTML with that info using movieTemplate
const onMovieSelect = async (movie) => {
  const response = await axios.get("http://www.omdbapi.com", {
    params: {
      apikey: "44e15dbc",
      i: movie.imdbID,
    },
  });
  document.querySelector("#summary").innerHTML = movieTemplate(response.data);
};

// Update the HTML to show the relevent movie info
const movieTemplate = (movieDetail) => {
  return `
    <article class="media">
    <figure class="media-left">
      <p class="image">
        <img src="${movieDetail.Poster}" />
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <h1>${movieDetail.Title}</h1>
        <h4>${movieDetail.Genre}</h4>
        <p>${movieDetail.Plot}</p>
      </div>
    </div>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Meta Score</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};
