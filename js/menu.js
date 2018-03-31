Vue.component('app-menu', {

  props: {
    items: {
      type: Array
    },
    imgPath: {
      default: "img/icons/"
    },
    imgExtension: {
      default: ".svg"
    }
  },
  
  template: `
    <div id="menu">
      <div v-for="item of items" @click="menuClick(item.name)"><a @click="menuClick(item)">{{ item.text }}</a></div>
    </div>`,

  methods: {
    menuClick: function(item) { 
      this.$emit(`${item}Event`);
    }
  }
})