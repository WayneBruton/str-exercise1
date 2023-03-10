<template>
  <q-page class="flex">
    <div style="display: flex; flex-direction: column; width: 100%">
      <div style="display: flex; justify-content: center; width: 100%">
        <q-input
          outlined
          v-model="searchText"
          label="Search for Movies"
          style="width: 250px; margin: 25px 0px"
        />
        <q-btn
          v-if="searchText.length"
          rounded
          outline
          glossy
          style="height: 25px; margin-top: 35px; margin-left: 35px"
          @click="getMoviesFromAPI"
          >Search</q-btn
        >
      </div>

      <div class="q-pa-md">
        <q-table
          v-if="moviesSearched.length"
          title="Movie Search"
          :rows="moviesSearched"
          :columns="columns"
          row-key="name"
          dark
          color="amber"
          style="margin 0px 15px"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="Title" :props="props">
                {{ props.row.Title }}
              </q-td>
              <q-td key="Type" :props="props">
                {{ props.row.Type }}
              </q-td>
              <q-td key="Year" :props="props">
                {{ props.row.Year }}
              </q-td>
              <q-td key="imdbID" :props="props">
                {{ props.row.imdbID }}
              </q-td>
              <q-td key="actions" :props="props">
                <q-btn
                  style="margin-right: 10px"
                  color="amber"
                  icon="visibility"
                  size="sm"
                  flat
                  @click="viewMovieDetails(props.row)"
                >
                  <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                    View details
                  </q-tooltip>
                </q-btn>
                <q-btn
                  color="red"
                  flat
                  icon="favorite"
                  size="sm"
                  @click="addMovies(props.row)"
                >
                <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                    Add as Favourite
                  </q-tooltip>
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <q-table
          title="My Favourite Movies"
          :rows="store.movies"
          :columns="columns"
          row-key="name"
          dark
          color="amber"
          :pagination="initialPagination"
          :filter="filter"
          style="margin 0px 15px"
        >
        <template v-slot:top-right>
        <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="Title" :props="props">
                {{ props.row.title }}
              </q-td>
              <q-td key="Type" :props="props">
                {{ props.row.type }}
              </q-td>
              <q-td key="Year" :props="props">
                {{ props.row.year }}
              </q-td>
              <q-td key="imdbID" :props="props">
                {{ props.row.imdbID }}
              </q-td>
              <q-td key="actions" :props="props">
                <q-btn
                  flat
                  style="margin-right: 10px"
                  color="amber"
                  icon="visibility"
                  size="sm"
                  @click="viewMovieDetailsDb(props.row)"
                >
                <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                    View details
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  color="red"
                  icon="delete"
                  size="sm"
                  @click="deleteMovie(props.row)"
                >
                <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                    Remove from List
                  </q-tooltip>
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <div class="q-pa-md q-gutter-sm">
          <q-dialog
            style="width: 80%"
            v-model="showMovie"
            persistent
            transition-show="scale"
            transition-hide="scale"
          >
            <q-card class="bg-grey text-white" style="width: 800px">
              <q-card-section>
                <div class="text-h6">{{ chosenMovie.title }}</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                {{ chosenMovie.year }}
              </q-card-section>
              <q-card-section class="q-pt-none">
                {{ chosenMovie.type }}
              </q-card-section>

              <q-card-section class="q-pt-none">
                <img :src="chosenMovie.Poster" style="width: 100%" />
              </q-card-section>

              <q-card-actions align="right" class="bg-white text-teal">
                <q-btn flat color="black" label="OK" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
        <div class="q-pa-md q-gutter-sm">
          <q-dialog
            style="width: 80%"
            v-model="showMovieDB"
            persistent
            transition-show="scale"
            transition-hide="scale"
          >
            <q-card class="bg-grey text-white" style="width: 800px">
              <q-card-section>
                <div class="text-h6">TITLE: {{ showMovieInDB.title }}</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                Year: {{ showMovieInDB.year }}
              </q-card-section>
              <q-card-section class="q-pt-none">
                Type: {{ showMovieInDB.type }}
              </q-card-section>

              <q-card-section class="q-pt-none">
                <img :src="showMovieInDB.Poster" style="width: 100%" />
              </q-card-section>

              <q-card-actions align="right" class="bg-white text-teal">
                <q-btn flat color="black" label="OK" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useMovieStore } from "../stores/movieStore.js";
import axios from "axios";

const store = useMovieStore();
const searchText = ref("");
const moviesSearched = ref([]);
const showMovie = ref(false);
const showMovieDB = ref(false);
const chosenMovie = ref(null);
const showMovieInDB = ref(null);

// Show movie table
const viewMovieDetails = (props) => {
  chosenMovie.value = {
    title: props.Title,
    type: props.Type,
    year: props.Year,
    imdbID: props.imdbID,
    Poster: props.Poster,
  };
  showMovie.value = true;
};

// Show saved movies table
const viewMovieDetailsDb = (props) => {
  showMovieInDB.value = {
    title: props.title,
    type: props.type,
    year: props.year,
    imdbID: props.imdbID,
    Poster: props.Poster,
  };
  showMovieDB.value = true;
};

// Table columns
const columns = ref([
  {
    name: "Title",
    required: true,
    label: "Title",
    align: "left",
    sortable: true,
    field: "title",
  },
  { name: "Type", align: "left", label: "Type", field: "type", sortable: true },
  { name: "Year", align: "left", label: "Year", field: "year", sortable: true },
  { name: "imdbID", align: "left", label: "imdbID", field: "imdbID", sortable: true, },
  {
    name: "actions",
    label: "Actions",
    field: "actions",
  },
]);

// Search for movies etc
const getMoviesFromAPI = async () => {
  await axios({
    method: "get",
    url: `${store.movieURL}/?s=${searchText.value}&apikey=${store.movieAPI}`,
  })
    .then(
      (response) => {
        moviesSearched.value = response.data.Search;
      },
      (error) => {
        console.error(error);
      }
    )
    .catch((e) => {
      console.error(e);
    });
};

// Add movie to list
const addMovies = async (props) => {
  store.movies.push({
    title: props.Title,
    type: props.Type,
    year: props.Year,
    imdbID: props.imdbID,
    Poster: props.Poster,
  });
  moviesSearched.value = [];
  searchText.value = "";
};

// delete movie
const deleteMovie = (props) => {
  store.movies = store.movies.filter((movie) => movie.imdbID !== props.imdbID);
};
//Pagination
const initialPagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 100,
});

// Filter Rows
const filter = ref('')
</script>
