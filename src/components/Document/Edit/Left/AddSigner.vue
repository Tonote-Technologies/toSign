<template>
  <form @submit.prevent="onAddParticipant">
    <div id="addSignerErrorMsg" class="text-center text-danger"></div>
    <div class="row gx-1" v-for="(row, index) in rows" :key="index">
      <div class="col-md-3 col-12">
        <label class="form-label" for="first-name">First Name</label>
        <div class="input-group mb-1">
          <span class="input-group-text p-0" :style="{ border: '1px solid' + row.color, color: row.color }">
            <Icon icon="ri:grid-fill" />
          </span>
          <input type="text" v-model="row.first_name" id="first-name" class="form-control form-control-sm"
            :style="{ border: '1px solid' + row.color }" placeholder="First Name" name="first_name" required />
        </div>
      </div>
      <div class="col-md-3 col-12">
        <label class="form-label" for="last-name-column">Last Name</label>
        <div class="input-group mb-1">
          <span class="input-group-text p-0" :style="{ border: '1px solid' + row.color, color: row.color }">
            <Icon icon="ri:grid-fill" />
          </span>
          <input type="text" v-model="row.last_name" id="last-name-column" class="form-control form-control-sm"
            :style="{ border: '1px solid' + row.color }" placeholder="Last Name" name="lname-column" required />
        </div>
      </div>
      <!-- <div class="col-md-3 col-12">
          <div class="input-group mb-1">
            <label class="form-label" for="phone-column">Phone</label>
            <input type="tel" v-model="row.phone" id="phone-column" class="form-control form-control-sm"
             :style="{ border: '1px solid' + row.color }" placeholder="Phone" name="phone-column">
          </div>
        </div> -->
      <div class="col-md-3 col-12">
        <label class="form-label" for="email-id-column">Email</label>
        <div class="input-group mb-1">
          <span class="input-group-text p-0" :style="{ border: '1px solid' + row.color, color: row.color }">
            <Icon icon="ri:grid-fill" />
          </span>
          <input type="email" v-model="row.email" id="email-id-column" class="form-control form-control-sm"
            name="email-id-column" :style="{ border: '1px solid' + row.color }" placeholder="Email" required />
        </div>
      </div>
      <div class="col-md-3 col-12">
        <label class="form-label" for="role-column">Role</label>
        <div class="input-group mb-1">
          <span class="input-group-text p-0" :style="{ border: '1px solid' + row.color, color: row.color }">
            <Icon icon="ri:grid-fill" />
          </span>
          <select name="role" id="role" v-model="row.role" class="form-select form-control-sm"
            :style="{ border: '1px solid' + row.color }" required>
            <option value="" selected>select role</option>
            <option>Signer</option>
            <option>Viewer</option>
          </select>
        </div>
      </div>

      <template v-if="row.action != '+'">
        <div class="col-md-12">
          <small class="hover" :class="['text-danger', isRemove]" @click="removeRow(index)">
            Remove
          </small>
        </div>
      </template>
      <hr />
    </div>

    <div class="d-flex justify-content-between align-items-center">
      <button type="button" @click="addRow" class="btn btn-sm btn-warning waves-effect waves-float waves-light">
        Add more
      </button>

      <button type="submit" class="btn btn-sm btn-primary waves-effect waves-float waves-light">
        Add participants
      </button>
    </div>
  </form>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { ref, defineEmits } from "vue";
import { createNamespacedHelpers } from "vuex-composition-helpers/dist";

const emit = defineEmits(["close"]);

const { useActions, useGetters } = createNamespacedHelpers(["document"]);
const { userDocument } = useGetters(["userDocument"]);
const { addParticipant } = useActions(["addParticipant"]);

const isRemove = ref(false);
const randomColor = ref("#ff0000")

const generateRandomHexColor = () => {
  const randomColor =
    "#" + Math.floor(Math.random() * 16777215).toString(16);
  if (randomColor.length !== 7) {
    return generateRandomHexColor();
  } else {
    return randomColor;
  }
}

const rows = ref([{ first_name: "", last_name: "", email: "", phone: "", role: "", action: "+", color: '' }]);
const addRow = () => {
  randomColor.value = generateRandomHexColor();

  rows.value.push({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "",
    action: "-",
    color: randomColor.value,
  });
};

const removeRow = (index) => {
  isRemove.value = true;
  rows.value.splice(index, 1);
};

let formObj = [];
const onAddParticipant = () => {
  rows.value.forEach((obj) => {
    formObj.push({
      document_id: userDocument.value.id,
      first_name: obj.first_name,
      last_name: obj.last_name,
      email: obj.email,
      phone: obj.phone,
      role: obj.role,
    });
  });

  addParticipant(formObj);
  emit("close", true);
  formObj = [];
  rows.value = [{ first_name: "", last_name: "", email: "", phone: "", role: "", action: "+", color: '' }];
};
</script>

<style scoped>
.hover:hover {
  cursor: pointer;
}
</style>
