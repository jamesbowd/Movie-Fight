const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {
  // Create the HTML inside the chosen root element for the autocomplete widget styled by Bulma
  root.innerHTML = `
  <label><b>Search</b></label>
  <input class="input" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
`;

  // Select the various elements of the input / dropdown menu
  const input = root.querySelector("input");
  const dropdown = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".results");

  // Fetch the data of the search and if there is info display the dropdown with poster and text
  const onInput = async (event) => {
    // event.target.value is what the user has typed into the input
    const items = await fetchData(event.target.value);
    // If there are no items close the dropdown
    if (!items.length) {
      dropdown.classList.remove("is-active");
      return;
    }
    // Before displaying any new data, remove all the old data
    resultsWrapper.innerHTML = "";
    // Make the dropdown active
    dropdown.classList.add("is-active");

    // Create an <a> element with class dropdown-item for each of the options returned and add the render options inside
    for (let item of items) {
      const option = document.createElement("a");

      // add the class dropdown-item to each of the options
      option.classList.add("dropdown-item");
      // add the render options specified when calling the function
      option.innerHTML = renderOption(item);

      // When clicking on the specific option from the dropdown
      option.addEventListener("click", () => {
        // remove the dropdown list
        dropdown.classList.remove("is-active");
        // What the autocomplete input displays when you click on an option
        input.value = inputValue(item);
        // Runs a function when an option is selected
        onOptionSelect(item);
      });

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
};
