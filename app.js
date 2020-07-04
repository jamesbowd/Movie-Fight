// Fetch and return data from the api based on the search term
const fetchData = async (searchTerm) => {
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
};

// Create the HTML inside the autocomplete div for the "dropdown" styled by Bulma
const root = document.querySelector(".autocomplete");
root.innerHTML = `
  <label><b>Search For a Movie</b></label>
  <input class="input" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
`;

// Select the various elements of the input / dropdown menu
const input = document.querySelector("input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");

// Fetch the data of the search and if there is info display the dropdown with poster and text
const onInput = async (event) => {
  // event.target.value is what the user has typed into the input
  const movies = await fetchData(event.target.value);
  // If there are no movies close the dropdown
  if (!movies.length) {
    dropdown.classList.remove("is-active");
    return;
  }
  // Before displaying any new data, remove all the old data
  resultsWrapper.innerHTML = "";
  // Make the dropdown active
  dropdown.classList.add("is-active");
  // Create an <a> element with class dropdown-item for each of the movies returned and add an image and title inside
  for (let movie of movies) {
    const option = document.createElement("a");
    // Turnery expression: set imgSrc to "" if there is no poster and the poster link if there is
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;

    option.classList.add("dropdown-item");
    option.innerHTML = `
      <img src="${imgSrc}" />
      ${movie.Title}
    `;

    resultsWrapper.appendChild(option);
  }
};

// Add event listener on the input which will run onInput debounced by 500ms
input.addEventListener("input", debounce(onInput, 500));

// If you click anywhere that isn't in the root (anything inside the autocomplete widget) hide the dropdown
document.addEventListener("click", (event) => {
  // console.log(event.target);
  if (!root.contains(event.target)) {
    dropdown.classList.remove("is-active");
  }
});
