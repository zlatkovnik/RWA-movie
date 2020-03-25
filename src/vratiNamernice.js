import { Namirnica } from "./namirnica";

const URL_NAMIRNICE = "http://localhost:3000/namirnice";

export function vratiNamirnice() {
  return fetch(URL_NAMIRNICE).then(res => res.json());
}
