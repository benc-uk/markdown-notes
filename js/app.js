const NOTE_DB = `__notes__data`;
const NOTE_SETTINGS = `__notes__settings`;

// Load vuejs dialog plugin
window.Vue.use(VuejsDialog.default)

// create a root instance
new Vue({

  el: '#app',

  template: `
  <div id="appcontainer" @click.stop="closeMenus()">
    <div id="notetabs">
    <div class="main-button" @click="addNote()"><img src="img/icons/file.svg" height="24px"/></div>
    <div class="main-button" v-if="closedNotes > 0" @click.stop="toggleFileMenu()"><img src="img/icons/folder.svg" height="24px"/></div>
    <div class="main-button" @click.stop="toggleSettingMenu()"><img src="img/icons/cog.svg" height="24px"/></div>
    <div v-for="(note, index) in notes" v-if="note.open" v-bind:class="{ activetab: note.id == settings.activeNote }" @click="select(note.id)">
      <i :class="'fa fa-'+note.icon"></i> {{note.name}} 
    </div>
    </div>

    <transition name="slideopen">
      <div v-if="settingMenuOpen" class="menu">
        <div @click="exportAll()"><i class="fa fa-download"></i> Export All Notes</div>
        <div @click="importNotes()"><i class="fa fa-upload"></i> Import Notes</div>
      </div>
    </transition>

    <transition name="slideopen">
      <div v-if="fileMenuOpen" class="menu">
        <ul>
          <li v-for="(note, index) in notes" v-if="!note.open" @click="open(note.id)"><i :class="'fa fa-'+note.icon"></i>  {{ note.name }}</li>
        </ul>
      </div>
    </transition>    

    <div v-if="Object.keys(this.notes).length == 0" class="note grey-bbb">
      <div class="notecontent"><h2>You have no notes.</h2>Click the <i class="fa fa-file-alt"></i> icon to create your first note</div>
    </div>
    <div v-if="Object.keys(this.notes).length > 0 && Object.keys(this.notes).length == closedNotes" class="note grey-bbb">
      <div class="notecontent"><h2>You have closed all your notes.</h2></br>Click the <i class="fa fa-folder-open"></i> icon to open a closed note</div>
    </div>
    
    <app-note ref="notes" :active="note.id == settings.activeNote && note.open" v-for="(note, index) in notes" 
      v-bind="note" :index="index" :key="note.id" 
      @saveNote="save($event)"
      @deleteNote="remove($event)"
      @closeNote="close($event)">
    </app-note>

    <input type="file" ref="fileInput" accept=".json" style="display:none" v-on:change="importNotesFile($event)">
  </div>
  `,

  data: function() {
    return {
      notes: {},
      settingMenuOpen: false,
      fileMenuOpen: false,
      settings: { activeNote: '' },
      closedNotes: 0
    }
  },

  created: function() {
    // Load notes from storage
    try {
      let tempNotes = JSON.parse(window.localStorage.getItem(NOTE_DB));
      if(tempNotes)
        this.notes = tempNotes;
      else
        this.notes = {};
    } catch(err) {
      this.notes = {};
    }

    for(var noteid in this.notes) {
      if(!this.notes[noteid].open) this.closedNotes++;
    }

    // Load settings from storage, or create defaults
    let tempSettings = JSON.parse(window.localStorage.getItem(NOTE_SETTINGS));
    if(tempSettings)
      this.settings = tempSettings;  
    else
      this.settings = { activeNote: '' }
  },

  methods: {
    save: function(updatedNote) {
      var note = this.notes[updatedNote.id];
      note.content = updatedNote.content;
      note.icon = updatedNote.icon;
      note.name = updatedNote.name;
      window.localStorage.setItem(NOTE_DB, JSON.stringify(this.notes));
    },

    select: function(id) {
      this.settings.activeNote = id;
      this.saveSettings();
    },

    addNote: function() {
      var newId = makeId(6);
      Vue.set(this.notes, newId, { 
        id: newId, 
        name: `New Note ${Object.keys(this.notes).length+1}`, 
        content: `---\nname: New Note ${Object.keys(this.notes).length+1}\nicon: file-alt\n---\n\n`, 
        icon: "file-alt",
        open: true
      });
      this.settings.activeNote = newId;

      // All this hassle to call edit() on the new note component
      Vue.nextTick(() => {
        let newNoteComp = this.$refs.notes.find(n => {
          return n._props.id == newId;
        });
        newNoteComp.edit();
      })
      
      window.localStorage.setItem(NOTE_DB, JSON.stringify(this.notes));
      this.saveSettings();
    },

    remove: function(id) {
      Vue.delete(this.notes, id);

      this.settings.activeNote = this.findFirstOpenNote();//Object.keys(this.notes)[0];
      this.findFirstOpenNote();
      window.localStorage.setItem(NOTE_DB, JSON.stringify(this.notes));
      this.saveSettings();
    },

    close: function(id) {
      this.notes[id].open = false;
      this.closedNotes++;


      this.settings.activeNote = this.findFirstOpenNote();//Object.keys(this.notes)[0];
      window.localStorage.setItem(NOTE_DB, JSON.stringify(this.notes)); 
      this.saveSettings();
    },

    open: function(id) {
      this.notes[id].open = true;
      this.closedNotes--;

      this.settings.activeNote = id;
      window.localStorage.setItem(NOTE_DB, JSON.stringify(this.notes)); 
      this.saveSettings();
    },

    exportAll: function() {
      var blob = new Blob([JSON.stringify(this.notes)], {type : 'application/json'});
      saveAs(blob, `all-notes.json`);
    },

    toggleSettingMenu: function() {
      this.fileMenuOpen = false;
      this.settingMenuOpen = !this.settingMenuOpen;
    },

    toggleFileMenu: function() {
      this.settingMenuOpen = false;
      this.fileMenuOpen = !this.fileMenuOpen;
    },

    closeMenus: function() {
      this.fileMenuOpen = false;
      this.settingMenuOpen = false;
    },

    importNotes: function() {
      this.$refs.fileInput.click()
    },

    importNotesFile: function(evt) {
      var file = evt.target.files[0];
      if(file) {
				var reader = new FileReader();
				reader.onload = function(e) {
          window.localStorage.setItem(NOTE_DB, reader.result);
          window.location.reload();
				}
				reader.readAsText(file);	
      }
    },

    saveSettings: function() {
      window.localStorage.setItem(NOTE_SETTINGS, JSON.stringify(this.settings));
    },

    findFirstOpenNote: function() {
      for(var noteid in this.notes) {
        if(this.notes[noteid].open) return noteid
      }
    }
  }
})
