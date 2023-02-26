<template>
  <body
    class="vertical-layout vertical-menu-modern blank-page navbar-floating footer-static"
    data-open="click"
    data-menu="vertical-menu-modern"
    data-col="blank-page"
  >
    <div class="app-content content">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="content-wrapper">
        <div class="content-header row"></div>
        <div class="content-body">
          <div class="auth-wrapper auth-basic px-2">
            <div class="auth-inner my-2">
              <div class="card mb-0">
                <div class="card-body">
                  <Form
                    class="auth-login-form mt-2"
                    @submit="onSubmit"
                    :validation-schema="schema"
                    v-slot="{ errors }"
                  >
                    <div class="mb-1">
                      <label>Email</label>
                      <Field
                        name="email"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.email }"
                      />
                      <div class="invalid-feedback">{{ errors.email }}</div>
                    </div>

                    <div class="mb-1">
                      <label>Password</label>
                      <Field
                        name="password"
                        type="password"
                        class="form-control"
                        :class="{ 'is-invalid': errors.password }"
                      />
                      <div class="invalid-feedback">{{ errors.password }}</div>
                    </div>

                    <div class="form-button">
                      <button
                        id="submit"
                        type="submit"
                        class="btn btn-primary w-100 waves-effect waves-float waves-light"
                        :disabled="loading"
                      >
                        <span
                          v-show="loading"
                          class="spinner-border spinner-border-sm"
                        ></span>
                        <span>Proceed</span>
                      </button>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</template>

<script setup>
import { ref } from "vue";
import { useActions } from "vuex-composition-helpers/dist";
import { Form, Field } from "vee-validate";
import * as Yup from "yup";

const { loginUser } = useActions({ loginUser: "auth/loginUser" });

const schema = Yup.object().shape({
  email: Yup.string().required("Email is required").email("Email is invalid"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const loading = ref(false);

const onSubmit = (params) => {
  loading.value = true;
  loginUser(params);
  loading.value = false;
};

//  const { token } = useGetters({
//   token: "auth/token",
// });
</script>

<style scoped></style>
