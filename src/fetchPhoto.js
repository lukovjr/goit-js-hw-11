import axios from 'axios';

export class FetchPhoto {
  photo = null;
  page = 1;
  perPage = 40;
  BASE_URL = 'https://pixabay.com/api/'
  API_KEY = 'key=35026706-9131f82d47e9a91ab730d36fd'

  async fetchPhoto() {
    
    try {
      
      return await axios.get(
        `${this.BASE_URL}?${this.API_KEY}&q=${this.photo}&per_page=${this.perPage}&page=${this.page}&image_type=photo&orientation=horizontal&safesearch=true`
      );
    } catch (error) {
      throw new Error(error.message);
      };
    };
}
