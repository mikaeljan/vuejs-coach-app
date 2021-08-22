<template>
  <div>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog fixed :show="isLoading" title="Authenticating ...">
      <base-spinner> </base-spinner
    ></base-dialog>
    <form @submit.prevent="submitForm">
      <base-card>
        <div class="form-control">
          <label for="email"> E-Mail</label>
          <input type="email" name="email" id="email" v-model.trim="email" />
        </div>
        <p v-if="!formIsValid">
          Please enter a valid email and password (must be at least 6 characters
          long)
        </p>
        <div class="form-control">
          <label for="password"> Password</label>
          <input
            type="password"
            name="password"
            id="password"
            v-model.trim="password"
          />
        </div>
        <base-button>{{ submitButtonCaption }}</base-button>
        <base-button @click="switchAuthMode" type="button" mode="flat">{{
          switchModeButtonCaption
        }}</base-button>
      </base-card>
    </form>
  </div>
</template>
<script>
import BaseSpinner from '../../components/ui/BaseSpinner.vue';
export default {
  components: { BaseSpinner },
  data() {
    return {
      email: '',
      password: '',
      formIsValid: true,
      mode: 'login',
      error: null,
      isLoading: false
    };
  },
  computed: {
    submitButtonCaption() {
      if (this.mode === 'login') return 'Login';
      else return 'Signup';
    },
    switchModeButtonCaption() {
      if (this.mode === 'login') return 'Signup instead';
      else return 'Login instead';
    }
  },
  methods: {
    async submitForm() {
      this.formIsValid = true;
      if (
        this.email === '' ||
        !this.email.includes('@') ||
        this.password.length < 6
      ) {
        this.formIsValid = false;
        return;
      }
      this.isLoading = true;
      const actionPayload = { email: this.email, password: this.password };
      try {
        if (this.mode === 'login') {
          await this.$store.dispatch('login', actionPayload);
        } else {
          await this.$store.dispatch('signup', actionPayload);
        }
        const redirectUrl = '/' + (this.$route.query.redirect || 'coaches');
        this.$router.replace(redirectUrl);
      } catch (error) {
        this.error = error.message || 'Failed to authenticate, try later';
      }
      this.isLoading = false;
    },
    switchAuthMode() {
      if (this.mode === 'login') this.mode = 'signup';
      else this.mode = 'login';
    },
    handleError() {
      this.error = null;
    }
  }
};
</script>
<style scoped>
form {
  margin: 1rem;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}

.errors {
  font-weight: bold;
  color: red;
}

.actions {
  text-align: center;
}
</style>
