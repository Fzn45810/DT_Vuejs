<template>
  <div class="main-section">
    <div class="section-1">
      <button @click="logout" class="logout">Log Out</button>
      <img src="../assets/Group 3.png" />
    </div>
    <div class="dish-detail">
      <div v-if="loading" class="loader">Loading...</div>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="!loading && !error">
        <h1>{{ dish.name }}</h1>
        <p class="desc">{{ dish.description }}</p>
        <img class="product-img" :src="dish.image_url" alt="Dish Image">
        <p>Price : ${{ dish.price }} only</p>
        <div class="rating">
          <label for="rating">Rate this dish:</label>
          <StarRating v-model="rating" />
          <textarea class="rating_doc" v-model="rating_dec"></textarea><br>
          <button class="submit_btn" v-if="rating > 0 && rating_dec" @click="submitRating" :disabled="hasRated">Submit</button>
        </div>
        <div v-if="hasRated" class="thank-you">Thank you for rating!</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import StarRating from '../components/StarRating.vue';

export default {
  components: {
    StarRating,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const dish = ref(null);
    const loading = ref(true);
    const error = ref(null);
    const rating = ref(0);
    const hasRated = ref(false);
    const rating_dec = ref();

    const fetchDish = async () => {
      loading.value = true;
      error.value = null;

      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/api/show/${route.params.id}`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('BrToken')}`,
            }
          }
        );
        dish.value = response.data.dish;
      } catch (err) { 
        error.value = 'Failed to fetch dishes.';
      } finally {
        loading.value = false;
      }
    };

    const submitRating = async () => {
      const localdata = JSON.parse(localStorage.getItem('logininfo'));
      console.log(rating_dec.value);
      if (!rating.value) return;

      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/api/rating/${localdata.id}/${route.params.id}`,
          { rating: rating.value, description: rating_dec.value },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('BrToken')}`,
            }
          }
        );
        hasRated.value = true;
        console.log('Rating submitted successfully:', response.data);
      } catch (err) {
        error.value = 'Failed to submit rating.';
        console.error('Error submitting rating:', err.response ? err.response.data : err.message);
      }
    };

    const logout = () => {
      localStorage.setItem('loggedIn', 'false');
      router.push({ name: 'login' });
    };

    onMounted(() => {
      fetchDish();
    });

    return {
      dish,
      loading,
      error,
      rating,
      hasRated,
      submitRating,
      logout,
      rating_dec
    };
  }
};
</script>

<style scoped>
.dish-detail {
  margin: 0 auto;
  padding: 20px;
  width: 50%;
  height: 100vh;
  overflow-y: scroll;
  color: #fff;
}

.loader,
.error {
  text-align: center;
  margin: 20px 0;
}

img {
  max-width: 100%;
  height: auto;
}

.rating {
  margin-top: 20px;
}

.thank-you {
  margin-top: 10px;
  color: green;
}

.main-section {
  display: flex;
  background-color: #000;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.section-1 {
  width: 50%;
  height: 100vh;
  position: relative;
}

.section-1 img {
  width: 100%;
  height: 100vh;
}

h1 {
  text-transform: capitalize;
  margin-top: 30px;
  margin-bottom: 20px;
}

.desc {
  margin-bottom: 30px;
}

.product-img {
  width: 50%;
  display: block;
  margin: 0 auto;
  margin-top: 30px;
  margin-bottom: 30px;
}

.logout {
  position: absolute;
  left: 25px;
  top: 30px;
  background-color: #FACE8D;
  color: #000;
  padding: 10px;
  border: none;
  width: 18%;
  border-radius: 5px;
  font-weight: bold;
  font-size: 13px;
  cursor: pointer;
}
.rating_doc{
  width: 400px;
  height: 200px;
  font-size: 15px;
}
.submit_btn{
  background-color: #FACE8D;
  color: #000;
  border: none;
  padding: 10px 20px;
  margin-top: 10px;
}
</style>
