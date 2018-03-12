showdown.setOption('simplifiedAutoLink', true);
showdown.setOption('tables', true);
showdown.setOption('emoji', true);
showdown.setOption('openLinksInNewWindow', true);
showdown.setOption('disableForced4SpacesIndentedSublists', true);
//showdown.setOption('metadata', true);

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
      return new showdown.Converter().makeHtml(this.editContent);      
    }
  }  
})
