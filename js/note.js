

Vue.component('app-note', {

  props: ['index', 'id', 'name', 'content', 'active'],

  data: function() {
    return {
      editing: false,
      editContent: this.content
    }
  },

  template: `
  <div class="note" v-if="active" v-on:dblclick="editAndSave()">
    <div>
      <div class="notecontent" v-html="contentHTML" v-if="!editing"></div>
      <textarea ref="editor" class="editor" v-if="editing" v-model="editContent">{{content}}</textarea>
    </div>
  </div>`,

  created: function() {
  },

  methods: {
    editAndSave: function() {
      // Switch between editor and view
      this.editing = !this.editing;

      // Focus editor textarea
      if(this.editing) {
        this.$nextTick(() => {
          this.$refs.editor.focus()
        });
      }

      // If we're no longer editing - means save
      if(!this.editing)
        this.$emit('saveNotes', {index: this.index, id: this.id, content: this.editContent});
    },  
  },

  computed: {
    contentHTML: function () {
      let markdown = this.editContent;
      if(this.editContent.length == 0) markdown = "*Double click here to start editing your note*"
      return new showdown.Converter().makeHtml(markdown);
    }
  }  
})
