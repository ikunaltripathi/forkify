import { API_URL , RESULT_PER_PAGE} from './config';
import { getJSON } from './helper';

export const state = {
  //contains all the data about the application so include the search res
  recipe: {},
  search: {
    query: '', // maybe for some data analytics in future
    results: [],
    page : 1,
    // resultsPerPage : 10 magic no -> config
    resultsPerPage : RESULT_PER_PAGE 
  },
};

export const loadRecipe = async function (id) {
  try {
    // const res = await fetch(`${API_URL}/${id}`);
    // const data = await res.json(); // also returns a promise .json is a meth on response obj
    // if (!res.ok) throw new Error(data.message);
    // // console.log(res, data);
    const data = await getJSON(`${API_URL}/${id}`);
    const { recipe } = data.data;
    state.recipe = {
      //assigning the ref to a new obj
      image: recipe.image_url,
      time: recipe.cooking_time,
      ingredients: recipe.ingredients,
      publisher: recipe.publisher,
      servings: recipe.servings,
      source: recipe.source_url,
      title: recipe.title,
    };
    // console.log(recipe);
  } catch (err) {
    // alert(err);
    // console.error(err);
    throw err;
  }
};

//model also doesn't know about controller so implement in a way mvc rule follows.

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        image: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
      };
    });
  } catch (err) {
    throw err;
  }
};

// while implementing a func start with model ->controller -> view
// In model while creating a new data see if it imp data & should it be incl in state.

export const getSearchResults = function(page = state.search.page) {
  state.search.page = page; // imp data for the state add it.
  const start = (page-1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage; // cuz one less for slice method
  return state.search.results.slice(start, end);
  // add resultsPerPage to state cuz its imp data
}
