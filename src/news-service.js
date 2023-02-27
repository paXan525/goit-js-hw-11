import axios from 'axios'

const BASE_URL = 'https://pixabay.com/api'
const API_KEY = '33907193-ff3b0182f06873b80b6bfc261';



export default class NewsApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }
    
    fetchArticles(searchQuery) {
        
        const searchOptions = `image_type=photo&orientation=horizontal&safesearch=true&per_page=5&page=${this.page}`;

        const URL = `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&${searchOptions}`;
        
        const response = await axios.get(URL);
        const data = await response.data;
        this.incrementPage();
        return data;
    };

    incrementPage() {
        this.page += 1;
    };

    resetPage() {
        this.page = 1;
    };

    get query() {
        return this.searchQuery;
    };

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}
