import { createLogger, createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";
const ls = new SecureLS({ isCompression: true });

const debug = process.env.NODE_ENV !== 'production';
const persist = {
  paths: ['auth', 'company', 'team', 'document'],
  storage: {
    getItem: key => ls.get(JSON.stringify(key)),
    setItem: (key, value) => ls.set(JSON.stringify(key), value),
    removeItem: key => ls.remove(JSON.stringify(key))
  }
}

const plugins = debug ? [createLogger(), createPersistedState(persist)] : [createPersistedState(persist)];

import state from "@/store/state";
import * as getters from "@/store/getters";
import * as mutations from "@/store/mutations";
import * as actions from "@/store/actions";

import auth from "@/store/modules/auth";
import company from "@/store/modules/company";
import team from "@/store/modules/team";
import document from "@/store/modules/document";
import print from "@/store/modules/print";
import tool from "@/store/modules/tool";

const modules = {
  auth,
  company,
  team,
  document,
  print,
  tool,
};

export default createStore({
  state,
  getters,
  mutations,
  actions,
  modules,
  plugins: plugins,
});
