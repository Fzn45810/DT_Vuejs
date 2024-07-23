<template>
  <div class="home-main-class">
    <div class="home-width-50">
      <button class="logout" @click="logout">Log Out</button>
      <img class="width_100" src="../assets/Group2.png" alt="Dish Image" />
    </div>
    <div class="dish-list">
      <div class="main-header">
        <div>
          <div class="dishes-block">
            <h1>Dishes</h1>
            <button @click="showModal = true">Add Dish</button>
          </div>
          <DishForm :show="showModal" @close="showModal = false" @formSubmitted="fetchDishes" />
          <DishUpdateForm 
            :show="showUpdateModal" 
            :dish="selectedDish" 
            @close="showUpdateModal = false" 
            @formSubmitted="fetchDishes" 
          />
        </div>
        <div class="search-bar">
          <input v-model="searchQuery" placeholder="Search dishes..." />
        </div>
      </div>
      <div v-if="loading" class="loader">Loading...</div>
  
      <div v-if="error" class="error">{{ error }}</div>
      
      <div v-if="!loading && !error" class="dishes">
        <div v-for="dish in filteredDishes" :key="dish.id" class="dish">
          <div @click="detailPage(dish.id)" class="dish-sec">
            <img :src="dish.image_url" alt="Dish Image" />
            <div class="dish-desc-box">
              <div class="box-header">
                <h2>{{ dish.name }}</h2>
                <p style="color: #fff">$ {{ dish.price }}</p>
              </div>
              <p class="des-p">{{ dish.description }}</p>
            </div>
          </div>
          <div class="btn-divs">
            <button @click="editDish(dish)">Edit</button>
            <button @click="deleteDish(dish)">Delete</button>
          </div>
        </div>
      </div>
  
      <!-- <div class="pagination">
        <button @click="previousPage" :disabled="page === 1">Previous</button>
        <span>Page {{ page }}</span>
        <button @click="nextPage">Next</button>
      </div> -->
    </div>
  </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { ref, computed, onMounted } from 'vue';
  import DishForm from '../components/adddish.vue';
  import { useRouter } from 'vue-router';
  import DishUpdateForm from "../components/updatedish.vue";

  export default {
    components: {
      DishForm,
      DishUpdateForm
    },
    setup() {
      const dishes = ref([]);
      const loading = ref(false);
      const error = ref(null);
      const searchQuery = ref('');
      const page = ref(1);
      const showModal = ref(false);
      const showUpdateModal = ref(false);
      const selectedDish = ref(null);
      const router = useRouter();
      const fetchDishes = async () => {
          loading.value = true;
          error.value = null;

          try {
              const response = await axios.post('http://127.0.0.1:8000/api/index', {}, {
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('BrToken')}`
                  }
              });
              dishes.value = response.data.list_dish;
          } catch (err) {
              error.value = 'Failed to fetch dishes.';
          } finally {
              loading.value = false;
          }
      };


      const logout = () =>{
        localStorage.setItem('loggedIn', 'flase');
        router.push({ name: 'login' });
      }
  
      const nextPage = () => {
        page.value += 1;
        fetchDishes();
      };
  
      const previousPage = () => {
        if (page.value > 1) {
          page.value -= 1;
          fetchDishes();
        }
      };
  
      const filteredDishes = computed(() => {
        if (!searchQuery.value) return dishes.value;
        const query = searchQuery.value.toLowerCase();
        return dishes.value.filter(dish =>
          dish.name.toLowerCase().includes(query) ||
          dish.description.toLowerCase().includes(query)
        );
      });

      const detailPage = (dishId) => {
        // router.push({ name: 'detail' });
        router.push({ name: 'detail', params: { id: dishId } });
      };
  
      const editDish = (dish) => {
        selectedDish.value = dish;
        showUpdateModal.value = true;
      };

      const deleteDish = async(dish) => {
        try {
          const response = await axios.post(`http://127.0.0.1:8000/api/destroy/${dish.id}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('BrToken')}`
            }
          });
          console.log(response);
          fetchDishes()
        } catch (err) {
          error.value = 'Failed to fetch dishes.';
        } finally {
          loading.value = false;
        }
      }

      onMounted(fetchDishes);
  
      return {
        dishes,
        loading,
        error,
        searchQuery,
        page,
        fetchDishes,
        nextPage,
        previousPage,
        detailPage,
        showModal,
        filteredDishes,
        showUpdateModal,
        selectedDish,
        deleteDish,
        editDish,
        logout
      };
    },
  };
  </script>
  
  <style scoped>
  .dish-list {
    margin: 0 auto;
    padding: 20px;
    width: 50%;
    height: 100vh;
    overflow-y: scroll;
    padding: 30px;
  }

  .search-bar{
    background-color: transparent;
    border-radius: 10px;
    color: #fff;
    width: 60%;
    display: block;
    margin: 0 auto;
    margin-top: 10px;
    margin-bottom: 35px;
  }
  
  .search-bar input {
    padding: 10px;
    margin-bottom: 20px;
    background-color: transparent;
    border: solid 1px #fff;
    border-radius: 10px;
    color: #fff;
    width: 100%;
    display: block;
    margin: 0 auto;
    margin-top: 25px;
    margin-bottom: 35px;
  }
  
  .dishes {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 180px;
  }
  
  .dish {
    padding: 20px;
    box-sizing: border-box;
    width: 90%;
    margin: 0 auto;
  }
  
  .dish img {
    max-width: 15%;
    height: auto;
    border-radius: 5px;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  
  .pagination button {
    padding: 10px;
    margin: 0 5px;
  }
  
  .loader, .error {
    text-align: center;
    margin: 20px 0;
  }
  .home-main-class{
    display: flex;
    align-items: flex-start;
    background-color: #000; 
    overflow: hidden;
  }
  .home-width-50{
    width: 50%;
    height: 100vh;
    position: relative;
  }
  .width_100{
    width: 100%;
    height: 100vh;
  }
  h1{
    color: #FACE8D;
    font-size: 40px; 
    font-family: initial;
  }
  .dishes-block{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .dishes-block button{
    background-color: transparent;
    border: none;
    color: #FACE8D;
    font-size: 16px;
  }
  .dish-desc-box{
    color: #fff;
    text-align: left;
    padding-left: 25px;
  }
  .dish-desc-box h2{
    text-transform: capitalize;
    padding-bottom: 5px;
  }
  .box-header{
    display: flex;
    align-items: center;
    justify-content: space-between; 
  }
  .des-p{
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1; /* number of lines to show */
            line-clamp: 1; 
    -webkit-box-orient: vertical; 
    width: 90%;
    font-size: 14px;
    color: #ffffffa6;
  }
  .error-msg{
    background-color: #000;
      color: red;
      margin-top: 20px;
      padding: 8px;
  }
  .dish-sec{
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .btn-divs{
    float: right;
    margin-top: 15px;
    display: flex;
    gap: 8px;
  }
  .btn-divs button{
    background-color: transparent;
    border:none;
    color: #FACE8D;
    cursor: pointer;
  }
  .btn-divs button:nth-child(2) {
    color: red;
  }
  .main-header{
   
    position: fixed;
    width: 45%;
    background-color: #000;
  }
  .logout{
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
  </style>
  