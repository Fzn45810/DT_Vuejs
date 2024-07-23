<template>
  <div class="login-container">
    <div v-if="var_page" class="login-box">
      <h2>Sign In</h2>
      <form @submit.prevent="login">
        <div class="input-group">
          <label for="email">Email</label>
          <input type="text" id="email" v-model="email" required>
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <button type="submit">{{ loaderapi ? "Please wait...":"Sign In" }}</button>
        <p class="signup-line">Dont have an account ? <span @click="Change_page">Sign Up Now</span></p>
        <p class="error-msg" v-if="errorvalidate">{{errormessage}}</p>
      </form>
    </div>
    <div v-if="!var_page" class="login-box-1">
      <h2>Register</h2>
      <form @submit.prevent="Signup">
        <div class="input-group">
          <label for="username">Username</label>
          <input type="text" id="name" v-model="username" required>
        </div>
        <div class="input-group">
          <label for="nickname">Nickname</label>
          <input type="text" id="nickname" v-model="nickname" required>
        </div>
        <div class="input-group">
          <label for="email">Email</label>
          <input type="text" id="email" v-model="email" required>
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required>
          <p class="pass-validation" v-if="password && password.length < 8"><span>*</span> The password field must be at least 8 characters</p>
        </div>
        <div class="input-group">
          <label for="password_confirmation">Confirm Password</label>
          <input type="password" id="password_confirmation" v-model="password_confirmation" required>
          <p class="pass-validation" v-if="password_confirmation && password != password_confirmation"><span>*</span>Password does not match</p>
        </div>
        <button :disabled="password.length < 8 || password != password_confirmation" type="submit">
          {{ loaderapi ? "Please wait...":"Sign Up" }}
        </button>
        <p class="signup-line">Already have account ? <span @click="Change_page">Sign In Now</span></p>
        <p class="error-msg" v-if="errorvalidate">{{errormessage}}</p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Login',
  data() {
    return {
      username: "",
      password: "",
      var_page: true,
      nickname:"",
      email:"",
      password_confirmation:"",
      errorvalidate: false,
      errormessage:"",
      loaderapi: false
    };
  },
  methods: {
    Change_page(){
      this.var_page = !this.var_page;
      this.errorvalidate = false;
      this.errormessage="";
      this.loaderapi = false;
    },
    async login() {
      // this.$router.push({ name: 'home' });
      this.errorvalidate = false;
      this.loaderapi = true;
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/auth/login', {
          email: this.email,
          password: this.password
        });
        console.log('Login successful', response);
        // access_token
        localStorage.setItem('loggedIn', 'true');
        this.$router.push({ name: 'home' });
        localStorage.setItem('BrToken', response.data.token);
        localStorage.setItem('logininfo', JSON.stringify(response.data.user));
        this.loaderapi = false;
        // Handle successful login, e.g., store token, redirect, etc.
      } catch (error) {
        console.error('Login failed', error?.response?.data?.error);
        this.loaderapi = false;
        this.errorvalidate = true
        if( error?.response?.data?.error == "Unauthorized"){
          this.errormessage = "Email Or Password is invalid"
        }else{
          this.errormessage = "There is some technical issue"
        }
        // Handle login error, e.g., show error message
      }
    },
    async Signup() {
      // this.$router.push({ name: 'home' });
      this.loaderapi = true;
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/auth/register', {
          name: this.username,
          password: this.password,
          nickname: this.nickname,
          email: this.email,
          password_confirmation: this.password_confirmation
        });
        console.log('Login successful', response);
        localStorage.setItem('BrToken', response.data.token);
        localStorage.setItem('logininfo', JSON.stringify(response.data.user));
        localStorage.setItem('loggedIn', 'true');
        this.$router.push({ name: 'home' });
        this.loaderapi = false;
        // Handle successful login, e.g., store token, redirect, etc.
      } catch (error) {
        console.error('Login failed', error);
        this.loaderapi = false;
        if(error?.response?.data){
          this.errorvalidate = true
          var erroriget = JSON.parse(error?.response?.data)
          console.log(erroriget?.email[0])
          if(erroriget?.email){
            this.errormessage = erroriget?.email[0]
          }else{
            this.errormessage = "There is some technical issue"
          }
        }
        // Handle login error, e.g., show error message
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-image: url("../assets/bg-login.png");
  background-size: cover;
  background-position: center;
}

.login-box {
  width: 600px;
  padding: 85px;
  background-color: #a1a1a133;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  text-align: center;
}

.login-box-1{
  width: 600px;
  padding: 45px;
  background-color: #a1a1a133;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  text-align: center;
}

h2 {
  margin-bottom: 20px;
  color: #fff;
  font-size: 50px;
}

.input-group {
  margin-bottom: 15px;
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  color: #fff;
}

.input-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: transparent;
  color: #fff;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #F8D49E;
  color: #000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 30px;
  font-size: 18px;
}

button:hover {
  background-color: #000;
  color: #fff;
}

.signup-line{
  text-align: center;
  cursor: pointer;
  color: #fff;
  padding-top: 30px
}

.signup-line span{
  color: #F8D49E;
}
.error-msg{
  background-color: #000;
    color: red;
    margin-top: 20px;
    padding: 8px;
}
.pass-validation{
  color: #fff;
  margin-top: 10px;
}
.pass-validation span{
  color: red;
}
</style>
