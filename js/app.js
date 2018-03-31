const NOTE_DB = `__notes__data`;
const NOTE_SETTINGS = `__notes__settings`;

// Load vuejs dialog plugin
window.Vue.use(VuejsDialog.default)

// create a root instance
new Vue({

  el: '#app',

  template: `
  <div id="appcontainer" @click="hideMenu()">
    <div id="notetabs">
      <div class="main-button" @click="addNote()"><i class="far fa-file-alt"></i></div>
      <div class="main-button" @click.stop="toggleMenu()"><i class="fa fa-chevron-circle-down"></i></div>
      <div v-for="(note, index) in notes" v-bind:class="{ activetab: index==settings.activeNote }" @click="select(index)">
        <i :class="'fa fa-'+note.icon"></i> {{note.name}}
      </div>
    </div>

    <transition name="slideopen">
      <div v-if="menuOpen" id="menu">
        <div @click="exportAll()"><i class="fa fa-download"></i> Export All Notes</div>
        <div @click="importNotes()"><i class="fa fa-upload"></i> Import Notes</div>
      </div>
    </transition>

    <div v-if="notes.length == 0" class="note">
      <div class="notecontent">You have no notes.</br>Please click the 'new note' icon to create your first note</div>
    </div>

    <app-note ref="notes" :active="index == settings.activeNote" v-for="(note, index) in notes" 
      v-bind="note" :index="index" :key="note.id" 
      @saveNote="save($event)"
      @deleteNote="remove($event)">
    </app-note>

    <input type="file" ref="fileInput" accept=".json" style="display:none" v-on:change="importNotesFile($event)">
  </div>
  `,

  data: function() {
    return {
      notes: [],
      menuOpen: false,
      settings: {},
    }
  },

  created: function() {
    // Load notes from storage
    try {
      let tempNotes = JSON.parse(window.localStorage.getItem(NOTE_DB));
      if(tempNotes && tempNotes.length > 0)
        this.notes.push(... tempNotes);

      // Load settings from storage, or create defaults
      let tempSettings = JSON.parse(window.localStorage.getItem(NOTE_SETTINGS));
      if(tempSettings)
        this.settings = tempSettings;  
      else
        this.settings = { activeNote: 0 }
    } catch(err) {

    }
  },

  methods: {
    save: function(updatedNote) {
      this.notes[updatedNote.index].content = updatedNote.content;
      this.notes[updatedNote.index].icon = updatedNote.icon;
      this.notes[updatedNote.index].name = updatedNote.name;
      this.notes.splice(updatedNote.index, 1, this.notes[updatedNote.index])

      window.localStorage.setItem(NOTE_DB, JSON.stringify(this.notes));
    },

    select: function(index) {
      this.settings.activeNote = index;
      this.saveSettings();
    },

    addNote: function() {
      var newId = makeId(6);
      this.notes.push({ 
        id: newId, 
        name: `New Note ${this.notes.length+1}`, 
        content: `---\nname: New Note ${this.notes.length+1}\nicon: file-alt\n---\n\n`, 
        icon: "file-alt"
      });
      // All this hassle to call edit() on the new note component
      /*Vue.nextTick(() => {
        let newNoteComp = this.$refs.notes.find(n => {
          return n.id == newId;
        });
        newNoteComp.edit();
      })*/
      
      window.localStorage.setItem(NOTE_DB, JSON.stringify(this.notes));
      this.settings.activeNote = this.notes.length - 1; 
      this.saveSettings();
    },

    remove: function(index) {
      this.notes.splice(index, 1);   
      if(this.settings.activeNote > this.notes.length - 1) this.settings.activeNote = this.notes.length - 1;
      window.localStorage.setItem(NOTE_DB, JSON.stringify(this.notes));
      this.saveSettings();
    },

    exportAll: function() {
      var blob = new Blob([JSON.stringify(this.notes)], {type : 'application/json'});
      saveAs(blob, `all-notes.json`);
    },

    toggleMenu: function() {
      this.menuOpen = !this.menuOpen;
      console.log(this.menuOpen);
    },

    hideMenu: function() {
      this.menuOpen = false;
    },

    importNotes: function() {
      this.$refs.fileInput.click()
    },

    importNotesFile: function(evt) {
      var file = evt.target.files[0];
      if(file) {
				var reader = new FileReader();
				reader.onload = function(e) {
          try {
            var test = JSON.parse(reader.result);
            if(test.length > 0) {
              if(!test[0].id || !test[0].name || !test[0].content || !test[0].icon) { 
                console.log('File isn\'t valid exported notes'); 
                return; 
              }
            }
          } catch(e) {
            console.log('File is not JSON!');
            return;
          } 

          window.localStorage.setItem(NOTE_DB, reader.result);
          window.location.reload();
				}
				reader.readAsText(file);	
      }
    },

    saveSettings: function() {
      window.localStorage.setItem(NOTE_SETTINGS, JSON.stringify(this.settings));
    }
  }
})
