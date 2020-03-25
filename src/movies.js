import { BASE_URL } from "./util.js";

export default class Movies {
  constructor(parent) {
    this.container = document.createElement("div");
    this.container.className = "movies-container";
    parent.appendChild(this.container);
    this.movies = [];
    this.loading = true;
    this.selectedMovie = null;
    this.selectedContainer = document.createElement("div");
    this.selectedContainer.className = "movie-container";
    parent.appendChild(this.selectedContainer);
    this.errors = [];
    this.errorsContainer = document.createElement("div");
    this.errorsContainer.className = "error";
    parent.appendChild(this.errorsContainer);
    this.handleClick = this.handleClick.bind(this);
  }

  //DOM DRAW

  draw() {
    this.container.innerHTML = "";
    if (this.loading) {
      this.container.innerHTML = "Loading...";
      return;
    }
    this.drawTitle();
    this.drawMovies();
  }

  drawTitle() {
    const title = document.createElement("h3");
    title.innerHTML = "Movies";
    this.container.appendChild(title);
  }

  drawMovies() {
    this.movies.forEach(movie => {
      const btn = document.createElement("button");
      btn.className = "btn";
      btn.innerHTML = movie.name;
      btn.name = movie.id;
      btn.onclick = this.handleClick;
      this.container.appendChild(btn);
    });
  }

  drawErrors() {
    this.errorsContainer.innerHTML = "";
    this.errors.forEach(err => {
      const error = document.createElement("div");
      error.innerHTML = err;
      this.errorsContainer.appendChild(error);
    });
  }

  drawSelectedMovie() {
    this.selectedContainer.innerHTML = "";
    const title = document.createElement("h4");
    title.innerHTML = this.selectedMovie.name;
    this.selectedContainer.appendChild(title);

    const description = document.createElement("div");
    description.innerHTML = this.selectedMovie.description;
    this.selectedContainer.appendChild(description);
  }

  drawActors() {
    this.selectedMovie.actors.forEach(actor => {
      const container = document.createElement("div");
      container.innerHTML = actor.name + ", " + actor.born;
      container.className = "actors-container";
      this.selectedContainer.appendChild(container);
    });
  }

  //EVENT HANDLE

  async handleClick(ev) {
    this.selectedContainer.innerHTML = "Loading...";
    fetch(BASE_URL + "movies/" + ev.target.name)
      .then(res => res.json())
      .then(async data => {
        this.selectedMovie = data;
        this.drawSelectedMovie();
        this.selectedMovie.actors = await this.fetchActors();
        this.drawActors();
      })
      .catch(err => {
        console.log(err);
        this.errors.push(err);
        this.drawErrors();
      });
  }

  //FETCH DATA FROM API

  async fetchMovies() {
    fetch(BASE_URL + "movies/")
      .then(res => res.json())
      .then(data => {
        this.movies = data;
        this.loading = false;
        this.draw();
      })
      .catch(err => {
        console.log(err);
        this.errors.push(err);
        this.loading = false;
        this.draw();
        this.drawErrors();
      });
  }

  async fetchActors() {
    const actorIds = this.selectedMovie.actors.map(actor => actor.id);
    if (actorIds.length === 0) return;
    let promises = actorIds.map(id => fetch(BASE_URL + "actors/" + id));
    const responses = await Promise.all([...promises]);
    promises = responses.map(res => res.json());
    const actors = await Promise.all([...promises]);
    return actors;
  }
}
