const autoCompleteConfig = {
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
};

// Calls the autocomplete function passing certain objects for the left of the page
createAutoComplete({
  ...autoCompleteConfig,
  // Where in the HTML the autocomplete is
  root: document.querySelector("#left-autocomplete"),
  // Run onMovieSelect when you select an option from the autocomplete
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#left-summary"), "left");
  },
});

// Calls the autocomplete function passing certain objects for the right of the page
createAutoComplete({
  ...autoCompleteConfig,
  // Where in the HTML the autocomplete is
  root: document.querySelector("#right-autocomplete"),
  // Run onMovieSelect when you select an option from the autocomplete
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#right-summary"), "right");
  },
});

let leftmovie;
let rightMovie;
// When you select a movie from the dropdown query the API for the full details then update the HTML with that info using movieTemplate
const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get("http://www.omdbapi.com", {
    params: {
      apikey: "44e15dbc",
      i: movie.imdbID,
    },
  });
  summaryElement.innerHTML = movieTemplate(response.data);

  if (side === "left") {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  const leftSideStats = document.querySelectorAll("#left-summary .notification");
  const rightSideStats = document.querySelectorAll("#right-summary .notification");

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];
    const leftSideValue = parseInt(leftStat.dataset.value);
    const rightSideValue = parseInt(rightStat.dataset.value);

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove("is-primary");
      leftStat.classList.add("is-warning");
    } else {
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-warning");
    }
  });
};

// Update the HTML to show the relevent movie info
const movieTemplate = (movieDetail) => {
  // Get data value for box office
  const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, ""));
  // Get data value for Meta Score
  const metascore = parseInt(movieDetail.Metascore);
  // get data for IMDB rating
  const imdbRating = parseFloat(movieDetail.imdbRating);
  // get data for IMDB votes
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));
  // get data for number of awards (add all numbers in the awards area)
  const awards = movieDetail.Awards.split(" ").reduce((prev, word) => {
    const value = parseInt(word);

    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0);

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
    <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metascore} class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Meta Score</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};
