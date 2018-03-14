Vue.component('app-toolbar', {

  props: {
    buttons: {
      type: Array
    },
    imgPath: {
      default: "img/icons/"
    },
    imgExtension: {
      default: ".svg"
    }
  },

  data: function() {
    return {
    }
  },
  
  template: `
  <div class="toolbar">
    <div v-for="button of buttons" @click="buttonClick(button)">
      <img v-bind:src="imgPath+button+imgExtension"/>
    </div>
  </div>`,

  methods: {
    buttonClick: function(btn) { 
      this.$emit(`${btn}Event`);
    }
  }
})