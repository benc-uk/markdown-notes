const NOTE_DB = `__notes__data`;

// create a root instance
new Vue({

  el: '#app',

  template: `
  <div id="appcontainer">
    <div id="notetabs">
      <div v-for="(note, index) in notes" v-bind:class="{ activeTab: index==activeNote }" @click="select(index)">
        <i :class="'fa fa-'+note.icon"></i> {{note.name}}
      </div>
      <div id="addButton" @click="addNote()"><i class="far fa-file-alt"></i></div>
    </div>

    <div v-if="notes.length == 0" class="note">
      <div class="notecontent">You have no notes!</br>Please click the note icon to create your first note</div>
    </div>

    <app-note :active="index==activeNote" v-for="(note, index) in notes" 
      v-bind="note" :index="index" :key="note.id" 
      @saveNote="save($event)"
      @deleteNote="remove($event)">
    </app-note>
  </div>
  `,

  data: function() {
    return {
      notes: [],
      activeNote: 0
    }
  },

  created: function() {
    let tempNotes = JSON.parse(localStorage.getItem(NOTE_DB));
    if(tempNotes && tempNotes.length > 0)
      this.notes.push(... tempNotes);
  },

  methods: {
    save: function(updatedNote) {
      this.notes[updatedNote.index].content = updatedNote.content;
      this.notes[updatedNote.index].icon = updatedNote.icon;
      this.notes[updatedNote.index].name = updatedNote.name;
      this.notes.splice(updatedNote.index, 1, this.notes[updatedNote.index])

      localStorage.setItem(NOTE_DB, JSON.stringify(this.notes));
    },

    select: function(i) {
      this.activeNote = i
    },

    addNote: function() {
      this.notes.push({ 
        id: guid(), 
        name: `New Note ${this.notes.length+1}`, 
        content: `---\nname: New Note ${this.notes.length+1}\nicon: file-alt\n---\n\n`, 
        icon: "file-alt"
      });
      localStorage.setItem(NOTE_DB, JSON.stringify(this.notes));
      this.activeNote = this.notes.length - 1; 
    },

    remove: function(i) {
      this.notes.splice(i, 1);   
      if(this.activeNote > this.notes.length - 1) this.activeNote = this.notes.length - 1;
      localStorage.setItem(NOTE_DB, JSON.stringify(this.notes));
    }
  }
})

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
