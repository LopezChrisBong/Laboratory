<template>
  <div></div>
  <!-- No DOM needed since Swal is modal-based -->
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: "SwalAlert",
  props: {
    value: Boolean, // Controls display
    header: {
      type: String,
      default: "SERVER ERROR",
    },
    message: {
      type: String,
      default: "Something went wrong!",
    },
    type: {
      type: String,
      default: "success", // success, error, warning, info, question
    },
    timeout: {
      type: Number,
      default: 3000,
    },
  },
  watch: {
    value(newVal) {
      if (newVal) this.showSwal();
    },
  },
  mounted() {
    if (this.value) {
      this.showSwal();
    }
  },
  methods: {
    showSwal() {
      Swal.fire({
        title: this.header,
        text: this.message,
        icon: this.type,
        timer: this.timeout,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
        timerProgressBar: true,
        didClose: () => this.$emit("input", false),
      });
    },
  },
};
</script>
