showdown.setOption('simplifiedAutoLink', true);
showdown.setOption('tables', true);
showdown.setOption('emoji', true);
showdown.setOption('openLinksInNewWindow', true);
showdown.setOption('disableForced4SpacesIndentedSublists', true);
showdown.setOption('metadata', true);

Vue.component('app-note', {

  props: ['index', 'id', 'name', 'content', 'active', 'icon'],

  data: function() {
    return {
      editing: false,
      editContent: this.content,
      editIcon: this.icon,
      editName: this.name
    }
  },

  template: `
  <div class="note" v-if="active" v-on:dblclick="editAndSave()">
    <div>

      <div class="notetools" v-if="!editing">
        <img src="img/icons/edit.svg" @click="edit()"/>&nbsp;
        <img src="img/icons/download.svg" @click="download()"/>&nbsp;
        <img src="img/icons/trash-alt.svg" @click="remove()"/>
      </div>

      <div class="notetools" v-if="editing">
        <img src="img/icons/save.svg" @click="save()"/>
      </div>

      <div class="notecontent" v-html="contentHTML" v-if="!editing"></div>

      <textarea ref="editor" class="editor" v-if="editing" v-model="editContent">{{content}}</textarea>
    </div>
  </div>`,

  created: function() {
  },

  methods: {
    edit: function() {
      // Switch between editor and view
      this.editing = true;

      // Focus editor textarea
      this.$nextTick(() => {
        this.$refs.editor.focus()
      });
    },  

    save: function() {
      // Switch between editor and view
      this.editing = false;      
      // force a call to contentHTML to refresh things that are parsed from the metadata
      let dump = this.contentHTML;
      // send event up to app to update things and save the data
      this.$emit('saveNote', {index: this.index, id: this.id, content: this.editContent, icon: this.editIcon, name: this.editName});
    },

    remove: function() {
      this.$emit('deleteNote', this.index);
    }
  },

  computed: {
    contentHTML: function () {
      let markdown = this.editContent;
      if(this.editContent.length == 0) markdown = "*Double click here to start editing your note*"
      let conv = new showdown.Converter();
      let html = conv.makeHtml(markdown);
      let metadata = conv.getMetadata(); 
      this.editIcon = metadata.icon || "file-alt"
      this.editName = metadata.name || "New Note"

      return html;
    }
  }  
})
