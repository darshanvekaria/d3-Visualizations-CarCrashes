Necessary Link:

- website (deployed here) : https://asmi06.github.io/
- repository : https://github.com/Asmi06/Asmi06.github.io
- video link : https://drive.google.com/file/d/1xAdDbm39bvDMuZJTluOsuylnhXNZ_t8N/view?usp=sharing
- external data link (if you want to run canvas submission locally) : https://drive.google.com/drive/folders/1W2rNVs1Jr5EkA6pHc1_FyBBiqUBvdRGJ?usp=sharing

Folder Structure :

- We maintain the folder structure consistent with all the work done this semester.
- js folder contains all javascript files
- data folder contains all the data and images
- css folder contains all the css files
- index.html is the entry point of the website.

Visual Design:

- We use a carousel slider for simplicity, ease of use and beautification.
- Use the buttons "Previous" and "Next" on the top left corner to navigate.
- For every other non-obvious interaction, instructions are provided in the dashboards/slides

Code Structure:

- We use the class-based architecture, so that every single visualization is modular.
- Every visualization is declared as an object of it's own class. This kept things neat and maintainable.
- helpers.js file handles the carousel-slide mechanism and initializes the visualizations.

Optimization:

- The entire project is optimized to not slow down at any point, despite relatively large data sizes.
- This is done through algorithmic optimization, such as improving the big O complexity of data loading/processing code.

Data Folder :

- In the deployed website, the data folder contains all the necessary files.
- In the files submitted on canvas, the data folder is kept empty, as the data files are too large. We are storing them in this link : https://drive.google.com/drive/folders/1W2rNVs1Jr5EkA6pHc1_FyBBiqUBvdRGJ?usp=sharing
- Copy all the individual files of this link and paste directly inside the empty data folder. All files should be in flat-structure with no subdirectories.

External Libraries :

- We only used libraries for minor UI component designs like buttons,colours and sliders.
- A full list of libraries is provided below :

  - bootstrap
  - d3
  - jquery
  - d3-scale-chromatic
  - d3-sankey-min
