//var contentHTML;

Vue.component('app-note', {

  props: ['index', 'id', 'name', 'content', 'active'],

  data: function() {
    return {
      editing: false,
      editContent: this.content
    }
  },

  template: `
  <div class="note" v-if="active">
    <div v-on:dblclick="edit()" v-html="contentHTML" v-if="!editing"></div>
    <textarea v-if="editing" v-on:dblclick="save()" v-model="editContent">{{content}}</textarea>
  </div>`,

  created: function() {
  },

  methods: {
    edit: function() {
      this.editing = true;
    },
    save: function() {
      this.editing = false;
      this.$emit('saveNotes', {index: this.index, id: this.id, content: this.editContent});
    }    
  },

  computed: {
    contentHTML: function () {
      return new showdown.Converter().makeHtml(this.editContent);      
    }
  }  
})
