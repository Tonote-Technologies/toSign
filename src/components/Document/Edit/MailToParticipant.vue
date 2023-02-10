<template>
  <form @submit.prevent="inviteParticipant">
    <div class="modal-body">
      <div class="row gx-1" v-for="(participant, index) in participants" :key="index">
        <div class="col-md-3 col-12">
          <div class="mb-1">
            <label class="form-label" for="first-name">First Name</label>
            <input type="text" v-model="participant.user.first_name" id="first-name"
              class="form-control form-control-sm" readonly placeholder="First Name" name="first_name" />
          </div>
        </div>
        <div class="col-md-3 col-12">
          <div class="mb-1">
            <label class="form-label" for="last-name-column">Last Name</label>
            <input type="text" v-model="participant.user.last_name" id="last-name-column"
              class="form-control form-control-sm" readonly placeholder="Last Name" name="lname-column" />
          </div>
        </div>
        <!-- <div class="col-md-3 col-12">
          <div class="mb-1">
            <label class="form-label" for="phone-column">Phone</label>
            <input type="tel" v-model="participant.user.phone" id="phone-column" class="form-control form-control-sm"
              readonly placeholder="Phone" name="phone-column">
          </div>
        </div> -->
        <div class="col-md-3 col-12">
          <div class="mb-1">
            <label class="form-label" for="email-id-column">Email</label>
            <input type="email" v-model="participant.user.email" id="email-id-column"
              class="form-control form-control-sm" name="email-id-column" readonly placeholder="Email" />
          </div>
        </div>
        <div class="col-md-3 col-12">
          <div class="mb-1">
            <label class="form-label" for="role-column">Role</label>
            <input type="text" v-model="participant.role" id="role-column" class="form-control form-control-sm" readonly
              placeholder="Role" name="role-column" />
          </div>
        </div>

        <hr />
      </div>

      <template v-if="addMore === true">
        <div class="row gx-1" v-for="(row, index) in rows" :key="index">
          <div class="col-md-3 col-12">
            <div class="mb-1">
              <label class="form-label" for="first-name">First Name</label>
              <input type="text" v-model="row.first_name" id="first-name" class="form-control form-control-sm"
                placeholder="First Name" name="first_name" />
            </div>
          </div>
          <div class="col-md-3 col-12">
            <div class="mb-1">
              <label class="form-label" for="last-name-column">Last Name</label>
              <input type="text" v-model="row.last_name" id="last-name-column" class="form-control form-control-sm"
                placeholder="Last Name" name="lname-column" />
            </div>
          </div>
          <!-- <div class="col-md-3 col-12">
            <div class="mb-1">
              <label class="form-label" for="phone-column">Phone</label>
              <input type="tel" v-model="row.phone" id="phone-column" class="form-control form-control-sm"
                placeholder="Phone" name="phone-column">
            </div>
          </div> -->
          <div class="col-md-3 col-12">
            <div class="mb-1">
              <label class="form-label" for="email-id-column">Email</label>
              <input type="email" v-model="row.email" id="email-id-column" class="form-control form-control-sm"
                name="email-id-column" placeholder="Email" />
            </div>
          </div>
          <div class="col-md-3 col-12">
            <div class="mb-1">
              <label class="form-label" for="role-column">Role</label>
              <select name="role" id="role" v-model="row.role" class="form-select form-control-sm" required>
                <option value="" selected>select role</option>
                <option>Signer</option>
                <option>Viewer</option>
              </select>
            </div>
          </div>

          <div class="col-md-12">
            <small role="button" style="font-size: small" :class="['text-danger', isRemove]" @click="removeRow(index)">
              Remove
            </small>
          </div>
          <hr />
        </div>
      </template>

      <div class="row">
        <div class="col-12">
          <button type="button" @click="addRow"
            class="btn btn-sm btn-primary waves-effect waves-float waves-light float-end">
            Add more
          </button>
        </div>
        <div class="col-12 d-none">
          <div class="mb-1">
            <label class="form-label" for="subject-column">Subject</label>
            <input type="text" v-model="subject" id="subject-column" class="form-control" placeholder="Subject"
              name="lname-column" disabled />
          </div>
        </div>
        <div class="col-12">
          <div class="my-2">
            <label class="form-label me-1" for="message-column">Message</label>
            <textarea name="message" v-model="message" class="form-control" id="message-column" rows="4"
              placeholder="Type your message here"></textarea>
          </div>
        </div>
      </div>

      <div class="d-flex align-items-center">
        <button type="button" class="btn btn-sm btn-secondary waves-effect waves-float waves-light ms-auto"
          @click="$emit('close')">
          No thanks
        </button>
        <button type="submit" class="btn btn-sm btn-primary waves-effect waves-float waves-light ms-1"
          :disabled="isLoading">
          <span v-show="isLoading" class="spinner-border spinner-border-sm"></span>
          Send
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { defineEmits, defineProps, ref } from "vue";
import { createNamespacedHelpers } from "vuex-composition-helpers/dist";

defineProps({ isLoading: Boolean });

const emit = defineEmits(["close"]);

const { useActions, useGetters } = createNamespacedHelpers(["document"]);

const { userDocument } = useGetters(["userDocument"]);
const { invitationMail } = useActions(["invitationMail"]);

const participants = ref(null);
participants.value = userDocument.value.participants.filter(
  (p) => !p.iAddedMyselfToDocument
);

const addMore = ref(false);
const isRemove = ref(false);
const subject = ref(userDocument.value.title);
const message = ref("");

const rows = ref([]);
const addRow = () => {
  addMore.value = true;
  rows.value.push({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "",
    action: "-",
  });
};

const removeRow = (index) => {
  isRemove.value = true;
  rows.value.splice(index, 1);
};

const inviteParticipant = () => {
  let formObj = [];
  participants.value.map((obj) => {
    formObj.push({
      document_id: userDocument.value.id,
      first_name: obj.user.first_name,
      last_name: obj.user.last_name,
      email: obj.user.email.toLowerCase(),
      phone: obj.user.phone,
      role: obj.role,
    });
  });

  if (addMore.value === true) {
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
  }

  formObj.subject = subject.value;
  formObj.message = message.value;

  invitationMail(formObj);
  emit("close", true);
};
</script>

<style scoped>

</style>
