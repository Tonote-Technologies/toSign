<template>
  <div class="grid" v-show="isVerified">
    <PreLoader />
  </div>

  <div v-show="!isVerified" class="auth-wrapper auth-basic px-2">
    <div class="auth-inner my-2">
      <div class="card mb-0">
        <div class="card-body">
          <div class="brand-logo">
            <img src="@/assets/logo-dark.png" alt="" height="26" />
          </div>

          <h2 class="card-title fw-bolder mb-1">Enter your details 💬</h2>

          <form class="mt-2" @submit.prevent="createUser">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="fName" class="form-label">First Name <span class="text-danger">*</span>
                  </label>
                  <input type="text" v-model="firstName" class="form-control numeral-mask mb-1" id="fName"
                    placeholder="Enter first name" required />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="lName" class="form-label">Last Name <span class="text-danger">*</span>
                  </label>
                  <input type="text" v-model="lastName" class="form-control numeral-mask mb-1" id="lName"
                    placeholder="Enter last name" required />
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group">
                  <label for="email" class="form-label">Email <span class="text-danger">*</span>
                  </label>
                  <input type="email" v-model="email" class="form-control numeral-mask mb-1" id="email"
                    placeholder="my-email@mail.com" required />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="phone" class="form-label">Phone Number</label>
                  <input type="tel" v-model="phone" class="form-control numeral-mask mb-1" id="phone"
                    placeholder="080********" />
                </div>
              </div>

              <div class="form-group">
                <label for="security" class="form-label">Password</label>
                <input type="password" v-model="password" class="form-control numeral-mask mb-1" id="security"
                  placeholder="********" />
              </div>
            </div>

            <button type="submit" class="btn btn-primary mb-1 w-100" tabindex="4">
              Create
            </button>
            <span>Already have an account? <router-link :to="{ name: 'Login' }">Login in instead.</router-link></span>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import PreLoader from "@/components/PreLoader.vue";
import { createNamespacedHelpers } from "vuex-composition-helpers/dist";
import { useRouter } from "vue-router";

const route = useRouter();
const { useActions } = createNamespacedHelpers("auth");
const { createUserAccount } = useActions(["createUserAccount"]);

const uri = ref("");
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const phone = ref("");
const password = ref("");
const documentId = ref("");
const isVerified = ref(true);
const flag = ref("");

const createUser = () => {
  // const verificationObj = {
  //   document_id: documentId.value,
  //   email: email.value,
  //   password: password.value,
  // };
  const userInfo = {
    first_name: firstName.value,
    last_name: lastName.value,
    email: email.value,
    phone: phone.value,
    role: 'User',
    password: password.value,
  }

  createUserAccount({ payload: userInfo, di: documentId.value });
};

onMounted(() => {
  setTimeout(() => {
    isVerified.value = false
  }, 1000);

  uri.value = route.currentRoute.value.query;
  email.value = uri.value.e;
  documentId.value = uri.value.di;
  flag.value = uri.value.f;

  console.log("ID: ", documentId.value)
});
</script>

<style scoped>
.grid {
  display: grid;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
}

.auth-wrapper {
  min-height: 90vh;
}
</style>
