<template>
  <div class="star-rating">
    <span
      v-for="star in 5"
      :key="star"
      class="star"
      :class="{ filled: star <= (tempRating || rating) }"
      @click="setRating(star)"
      @mouseover="hoverRating(star)"
      @mouseleave="resetHover"
    >
      ★
    </span>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      rating: this.modelValue,
      tempRating: null,
    };
  },
  methods: {
    setRating(star) {
      this.rating = star;
      this.$emit('update:modelValue', this.rating);
      this.tempRating = null; // Reset temp rating after setting the actual rating
    },
    hoverRating(star) {
      this.tempRating = star;
    },
    resetHover() {
      this.tempRating = null;
    },
  },
  watch: {
    modelValue(newVal) {
      this.rating = newVal;
    },
  },
};
</script>

<style scoped>
.star-rating {
  display: flex;
}
.star {
  font-size: 2rem;
  cursor: pointer;
  color: #d3d3d3;
}
.star.filled {
  color: #ffd700;
}
</style>
