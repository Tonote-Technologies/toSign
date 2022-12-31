<template>
  <div v-if="isDocLoading">
    <div class="loader">
      <PreLoader />
    </div>
  </div>
  <div v-else id="pdfvuer">
    <div class="downloader">
      <slot name="document-tools" :pageNumber="i"></slot>
      <pdf :src="pdfData" v-for="i in numPages" :key="i" :id="i" :page="i" :annotation="true" :resize="true"
        style="padding: 0 1px 1px 0" />
    </div>
  </div>
</template>

<script setup>
import { useGetters } from "vuex-composition-helpers/dist";

const { isDocLoading } = useGetters({
  isDocLoading: "document/isDocLoading",
});
</script>

<script>
import pdfvuer from "pdfvuer";
import "pdfjs-dist/build/pdf.worker.entry";
import PreLoader from "@/components/PreLoader.vue";

export default {
  components: {
    pdf: pdfvuer,
    PreLoader
  },
  props: ["file", 'comp'],
  data() {
    return {
      page: 1,
      numPages: 0,
      pdfData: undefined,
      scale: "page-width",
      documentHeight: 0,
    };
  },

  computed: {
    formattedZoom() {
      return Number.parseInt(this.scale * 100);
    },
  },

  mounted() {
    setTimeout(() => {
      this.getPdf()
    }, 2000);
  },

  updated() {
    this.documentHeight = Number(this.numPages) * 1159;
    this.$emit("documentHeight", this.documentHeight);
  },

  watch: {
    show: function (s) {
      if (s) {
        this.getPdf();
      }
    },
    page: function (p) {
      if (
        window.pageYOffset <= this.findPos(document.getElementById(p)) ||
        (document.getElementById(p + 1) &&
          window.pageYOffset >= this.findPos(document.getElementById(p + 1)))
      ) {
        document.getElementById(p).scrollIntoView();
      }
    },
  },

  methods: {
    handle_pdf_link: function (params) {
      let page = document.getElementById(String(params.pageNumber));
      page.scrollIntoView();
    },
    getPdf() {
      let self = this;
      self.pdfData = pdfvuer.createLoadingTask(this.file);
      self.pdfData.then((pdf) => {
        self.numPages = pdf.numPages;
        window.onscroll = function () {
          changePage();
          stickyNav();
        };

        let sticky = document.getElementById("buttons")?.offsetTop;
        function stickyNav() {
          if (window.pageYOffset >= sticky) {
            document.getElementById("buttons")?.classList.remove("hidden");
          } else {
            document.getElementById("buttons")?.classList.add("hidden");
          }
        }

        function changePage() {
          let i = 1,
            count = Number(pdf.numPages);
          do {
            if (
              window.pageYOffset >= self.findPos(document.getElementById(i)) &&
              window.pageYOffset <= self.findPos(document.getElementById(i + 1))
            ) {
              self.page = i;
            }
            i++;
          } while (i < count);
          if (window.pageYOffset >= self.findPos(document.getElementById(i))) {
            self.page = i;
          }
        }
      });
    },
    findPos(obj) {
      return obj?.offsetTop;
    },
  },
};
</script>

<style lang="css" scoped>
#buttons {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.loader {
  display: grid;
  place-items: center;
  position: relative;
  height: 80vh;
  width: 100%;
}

@media screen and (max-width: 640px) {
  .loader {
    width: 100vw;
  }
}

@media screen and (max-width: 991.5px) {
  .loader {
    height: 60vh;
  }
}
</style>
