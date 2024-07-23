<template>
  <div v-if="show" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>Edit Dish</h2>
      <form @submit.prevent="submitForm">
        <div>
          <label for="name">Name:</label><br>
          <input type="text" v-model="formData.name" required />
        </div>
        <div>
          <label for="description">Description:</label><br>
          <textarea type="text" v-model="formData.description" required></textarea>
        </div>
        <div>
          <label for="image_url">Image URL:</label><br>
          <input type="text" v-model="formData.image_url" required />
        </div>
        <div>
          <label for="price">Price:</label><br>
          <input type="number" v-model="formData.price" required />
        </div>
        <button type="submit">Update</button>
        <p class="error-msg" v-if="errorvalidate">{{errorsms}}</p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    dish: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      formData: { ...this.dish },
      errorsms: "",
      errorvalidate: false
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async submitForm() {
      this.errorvalidate = false;
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/update/${this.dish.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('BrToken')}`,
          },
          body: JSON.stringify(this.formData),
        });
        const data = await response.json();
        if (response.ok) {
          this.$emit('formSubmitted');
          this.closeModal();
        } else if (!response.ok) {
          if (data) {
            this.errorvalidate = true;
            var subdata = JSON.parse(data);
            if (subdata?.name) {
              this.errorsms = subdata?.name[0];
            }
            if (subdata?.description) {
              this.errorsms = subdata?.description[0];
            }
          }
        }
      } catch (error) {
        console.error(error);
        this.errorvalidate = true;
        this.errorsms = "Error updating dish";
      }
    },
  },
  watch: {
    dish(newDish) {
      this.formData = { ...newDish };
    },
  },
};
</script>

<style scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #ffffff1c;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  color: #fff;
  position: relative;
}

.close {
  position: absolute;
  top: 0px;
  right: 10px;
  cursor: pointer;
  font-size: 30px;
}

form div {
  margin-bottom: 15px;
}

h2 {
  text-align: center;
  margin-bottom: 15px;
  color: #FACE8D;
  font-size: 30px;
}

input {
  padding: 6px;
  width: 100%;
  margin-top: 8px;
}

button {
  width: 80%;
  padding: 8px;
  border-radius: 5px;
  border: none;
  display: block;
  margin: 0 auto;
  margin-top: 35px;
  margin-bottom: 35px;
  background-color: #FACE8D;
  color: #000;
  font-weight: bold;
}

textarea {
  width: 100%;
  height: 160px;
}

.error-msg {
  background-color: #000;
  color: red;
  margin-top: 20px;
  padding: 8px;
  text-align: center;
}
</style>
