import { createRouter, createWebHistory } from "vue-router";
import NProgress from "nprogress";
import store from "@/store";

const UserAuth = () =>
  import(/* webpackChunkName: "auth-login" */ "@/views/UserAuth.vue");

const userVerification = () =>
  import(
    /* webpackChunkName: "auth-verify" */ "@/components/Auth/UserVerify.vue"
  );

const DocumentIndex = () =>
  import(/* webpackChunkName: "user" */ "@/views/DocumentIndex.vue");

const DocumentDashboard = () =>
  import(
    /* webpackChunkName: "document" */ "@/views/documents/DocumentDashboard.vue"
  );

const DocumentView = () =>
  import(
    /* webpackChunkName: "show-link" */ "@/views/documents/DocumentView.vue"
  );

const DocumentResponse = () =>
  import(
    /* webpackChunkName: "response-link" */ "@/views/documents/DocumentResponse.vue"
  );

const DocumentAuditTrail = () =>
  import(
    /* webpackChunkName: "audit-trail" */ "@/views/documents/DocumentAuditTrail.vue"
  );

const DocumentUpload = () =>
  import(
    /* webpackChunkName: "upload-document" */ "@/views/documents/DocumentUpload.vue"
  );

const DocumentPrepare = () =>
  import(
    /* webpackChunkName: "prepare-document" */ "@/views/documents/DocumentPrepare.vue"
  );

const DocumentEdit = () =>
  import(
    /* webpackChunkName: "edit-document" */ "@/views/documents/DocumentEdit.vue"
  );

const SignLink = () =>
  import(
    /* webpackChunkName: "sign-link" */ "@/views/documents/DocumentSignLink.vue"
  );

const NewInstanceOfSignLink = () =>
  import(
    /* webpackChunkName: "new-instance-sign-link" */ "@/views/CopySignLink.vue"
  );


const UserRegistration = () =>
  import(
    /* webpackChunkName: "auth-register" */ "@/components/Auth/UserRegistration.vue"
  );

const routes = [
  {
    path: "/",
    name: "Login",
    component: UserAuth,
    meta: {
      title: "Login | ToNote",
      metaTags: [
        {
          name: "description",
          content: "The login page of ToNote.",
        },
        {
          property: "og:description",
          content: "The login page of ToNote.",
        },
      ],
    },
  },

  {
    path: "/sign",
    name: "Sign",
    component: UserRegistration,
    meta: {
      title: "Create Link | ToNote",
      metaTags: [
        {
          name: "description",
          content: "The easy link registration page of ToNote.",
        },
        {
          property: "og:description",
          content: "The easy link registration page of ToNote.",
        },
      ],
    },
  },

  {
    path: "/verify",
    name: "Verify",
    component: userVerification,
    meta: {
      title: "Verification | ToNote",
      metaTags: [
        {
          name: "description",
          content: "The verification page of ToNote.",
        },
        {
          property: "og:description",
          content: "The verification page of ToNote.",
        },
      ],
    },
  },

  {
    path: "/to-sign/:document_id",
    name: "NewSign",
    component: NewInstanceOfSignLink,
    meta: {
      title: "ToNote",
    },
  },

  {
    path: "/dashboard",
    name: "Document",
    component: DocumentDashboard,
    meta: {
      title: "Sign Link | Document - ToNote",
      metaTags: [
        {
          name: "description",
          content: "The easy link page of ToNote.",
        },
        {
          property: "og:description",
          content: "The easy link page of ToNote.",
        },
      ],
    },
  },

  {
    path: "/document",
    name: "document-index",
    component: DocumentIndex,
    meta: {
      title: "Documents - ToNote",
    },
    children: [
      {
        path: "",
        name: "document.dashboard",
        component: DocumentDashboard,
        beforeEnter(to, from, next) {
          next({ name: "Document" });
        },
        meta: {
          title: "User | Document - ToNote",
          requiresAuth: true,
        },
      },
      {
        path: "edit/:document_id",
        name: "document.edit",
        component: DocumentEdit,
        meta: {
          title: "Edit Document | ToNote",
          // requiresAuth: true,
          metaTags: [
            {
              name: "description",
              content: "The document edit page of ToNote.",
            },
            {
              property: "og:description",
              content: "The document edit page of ToNote.",
            },
          ],
        },
      },
      {
        path: "/link/:document_id",
        name: "Link",
        component: SignLink,
        meta: {
          title: "Sign Document | ToNote",
          metaTags: [
            {
              name: "description",
              content: "The sign link page of ToNote.",
            },
            {
              property: "og:description",
              content: "The sign link page of ToNote.",
            },
          ],
        },
      },
      {
        path: "show/:document_id",
        name: "document.show",
        component: DocumentView,
        meta: {
          title: "View | ToNote",
          metaTags: [
            {
              name: "description",
              content: "The view link page of ToNote.",
            },
            {
              property: "og:description",
              content: "The view link page of ToNote.",
            },
          ],
        },
      },
      {
        path: "response",
        name: "document.response",
        component: DocumentResponse,
        meta: {
          title: "Response | ToNote",
          metaTags: [
            {
              name: "description",
              content: "The view participant response of ToNote.",
            },
            {
              property: "og:description",
              content: "The view participant response of ToNote.",
            },
          ],
        },
      },
      {
        path: "audit/:document_id",
        name: "document.audit",
        component: DocumentAuditTrail,
        meta: {
          title: "Audit Trail | ToNote",
          metaTags: [
            {
              name: "description",
              content: "The audit trail page of ToNote.",
            },
            {
              property: "og:description",
              content: "The audit trail page of ToNote.",
            },
          ],
        },
      },
      {
        path: "upload",
        name: "document.upload",
        component: DocumentUpload,
        meta: {
          title: "Upload Document | ToNote",
          metaTags: [
            {
              name: "description",
              content: "The document upload's page of ToNote.",
            },
            {
              property: "og:description",
              content: "The document upload's page of ToNote.",
            },
          ],
        },
      },
      {
        path: "prepare",
        name: "document.prepare",
        component: DocumentPrepare,
        meta: {
          title: "Prepare Document | ToNote",
          requiresAuth: true,
          metaTags: [
            {
              name: "description",
              content: "The document setup page of ToNote.",
            },
            {
              property: "og:description",
              content: "The document setup page of ToNote.",
            },
          ],
        },
      },
    ],
  },

  {
    path: "/notification",
    name: 'Error',
    component: () => import("@/components/DocNotFound.vue"),
    meta: {
      title: "Error 404 | ToNote",
      metaTags: [
        {
          name: "description",
          content: "The document not found page of ToNote.",
        },
        {
          property: "og:description",
          content: "The document not found page of ToNote.",
        },
      ],
    },
  },

  {
    path: "/:catchAll(.*)",
    component: () => import("@/components/NotFound.vue"),
    meta: {
      title: "Error 404 | ToNote",
      metaTags: [
        {
          name: "description",
          content: "The error 404 page of ToNote.",
        },
        {
          property: "og:description",
          content: "The error 404 page of ToNote.",
        },
      ],
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: "active",
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return {
        savedPosition,
        behavior: "smooth",
      };
    } else {
      return { x: 0, y: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  NProgress.start();

  /* ---------------------------------------------//? ROUTE GUARD META -------------------------------------------- */

  if (to.matched.some(record => record.meta.requiresAuth)) {
    const hasToken = store.getters["auth/token"];
    if (!hasToken) {
      next({ name: 'Sign', query: { di: to.params.document_id } })
    } else {
      next()
    }
  } else {
    next()
  }

  /* ---------------------------------------------//? SEO Friendly META -------------------------------------------- */

  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.metaTags);
  const previousNearestWithMeta = from.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  // if (nearestWithTitle) document.title = nearestWithTitle.meta.title;
  if (nearestWithTitle) {
    document.title = nearestWithTitle.meta.title;
  } else {
    document.title = previousNearestWithMeta.meta.title;
  }

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll("[data-vue-router-controlled]")).map(
    (el) => el.parentNode.removeChild(el)
  );

  // Skip rendering meta tags if there are none.
  if (!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags
    .map((tagDef) => {
      const tag = document.createElement("meta");

      Object.keys(tagDef).forEach((key) => {
        tag.setAttribute(key, tagDef[key]);
      });

      // We use this to track which meta tags we create, so we don't interfere with other ones.
      tag.setAttribute("data-vue-router-controlled", "");

      return tag;
    })
    // Add the meta tags to the document head.
    .forEach((tag) => document.head.appendChild(tag));

  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
