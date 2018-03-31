showdown.setOption('simplifiedAutoLink', true);
showdown.setOption('tables', true);
showdown.setOption('emoji', true);
showdown.setOption('openLinksInNewWindow', true);
showdown.setOption('disableForced4SpacesIndentedSublists', true);
showdown.setOption('metadata', true);

Vue.component('app-note', {

  props: {
    id:      { type: String  },
    name:    { type: String  },
    content: { type: String  },
    active:  { type: Boolean },
    icon:    { type: String  }            
  },

  data: function() {
    return {
      editing: false,
      editContent: this.content,
      editIcon: this.icon,
      editName: this.name,
      toolbarShown: false
    }
  },

  template: `
  <div class="note" v-if="active" @mousemove="handleMouse($event)" @mouseleave="toolbarShown = false">
    <div>
      <!-- view mode toolbar -->
      <transition name="fade">
        <app-toolbar v-if="!editing && toolbarShown" v-bind:buttons="['edit', 'download', 'close']" 
          @editEvent="edit()" 
          @downloadEvent="download()"
          @closeEvent="close()">
        </app-toolbar>
      </transition>

      <!-- edit mode toolbar -->
      <transition name="fade">
        <app-toolbar v-if="editing && toolbarShown" v-bind:buttons="['save', 'trash']" 
          @saveEvent="save()" @trashEvent="trash()" class='red'>
        </app-toolbar>
      </transition>

      <!-- view note content -->
      <div v-if="!editing" class="notecontent" v-html="contentHTML"></div>

      <!-- edit note content -->
      <textarea v-else ref="editor" class="editor" v-model="editContent" @keydown.ctrl.83.prevent="save()">{{content}}</textarea>
    </div>
  </div>`,

  methods: {
    handleMouse: function(evt) {
      if(evt.clientY < 180  && (window.outerWidth - evt.clientX < 250)) this.toolbarShown = true;
      else this.toolbarShown = false;
    },

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
      // Force a call to contentHTML to refresh things that are parsed from the metadata
      let dump = this.contentHTML;
      // Send event up to app to update things and save the data
      this.$emit('saveNote', {id: this.id, content: this.editContent, icon: this.editIcon, name: this.editName});
    },

    trash: function() {
      let confirm = {
        title: 'Delete Note',
        body: 'Are you sure you want to delete this note?'
      }

      this.$dialog.confirm(confirm, {okText: 'Yeah, sure', cancelText: 'No way!', backdropClose: true})
        .then(() => {
          this.$emit('deleteNote', this.id);
        })
        .catch(() => {})
    },

    download: function() {
      var blob = new Blob([this.editContent], {type : 'text/markdown; charset=UTF-8'});
      saveAs(blob, `${this.editName}.md`);
    },

    close: function() {
      this.$emit('closeNote', this.id);
    }
  },

  computed: {
    contentHTML: function () {
      let markdown = this.editContent;
      if(this.editContent.length == 0) markdown = "*Double click here to start editing your note*"
      let conv = new showdown.Converter();
      let html = conv.makeHtml(markdown);
      let metadata = conv.getMetadata(true); 

      // Manually parse the metadata into YAML as showdown is rubbish
      var yaml = jsyaml.load(metadata);
      
      this.editIcon = yaml.icon || "file-alt"
      this.editName = yaml.name || "New Note"

      return html;
    }
  }  
})
