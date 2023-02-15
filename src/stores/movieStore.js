import { defineStore } from 'pinia';

export const useMovieStore = defineStore('counter', {
  state: () => ({
    movieAPI:"836c2e67", // THIS WOULD ORDINARILY BE A SECRET
    movieURL: "http://www.omdbapi.com/",
    movies:[

    ]
  }),
  persist: true,
  getters: {
   
  },
  actions: {
    
  },
});
