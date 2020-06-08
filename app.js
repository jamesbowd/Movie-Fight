const fetchData = async () => {
  const response = await axios.get("http://www.omdbapi.com", {
    params: {
      apikey: "44e15dbc",
      i: "tt0848228",
    },
  });

  console.log(response.data);
};

fetchData();
