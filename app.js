const fetchData = async (searchTerm) => {
  const response = await axios.get("http://www.omdbapi.com", {
    params: {
      apikey: "44e15dbc",
      s: searchTerm,
    },
  });

  return response.data.Search;
};

const input = document.querySelector("input");

const onInput = async (event) => {
  const movies = await fetchData(event.target.value); // This is what the user has typed into the input
  console.log(movies);
};
input.addEventListener("input", debounce(onInput, 500));
