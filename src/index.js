import Movies from "./movies.js";
import "./style.css";

const movies = new Movies(document.body);
movies.draw();
movies.fetchMovies();

//Nikola Zlatkov, 16593
