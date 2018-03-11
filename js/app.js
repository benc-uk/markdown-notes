const NOTE_DB = `__notes__data`;

// create a root instance
new Vue({

  el: '#app',

  template: `
  <div>
    <div id="notetabs" unselectable="on" onselectstart="return false;" >
      <div v-for="(note, index) in notes" @dblclick="rename(index)" v-bind:class="{ activeTab: index==activeNote }" @click="select(index)">{{note.name}}</div>
    </div>

    <div id="addButton" @click="addNote()"><i class="far fa-file-alt"></i></div>

    <app-note :active="index==activeNote" v-for="(note, index) in notes" v-bind="note" :index="index" :key="note.id" @saveNotes="save($event)">
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
    this.notes.push(... tempNotes);
  },

  methods: {
    save: function(data) {
      this.notes[data.index].content = data.content;
      localStorage.setItem(NOTE_DB, JSON.stringify(this.notes));
    },

    select: function(i) {
      this.activeNote = i
    },

    addNote: function() {
      let newName = prompt("New note name", "New Note"); 
      if(newName.trim().length == 0) return;
      this.notes.push({ id: guid(), name: newName, content: "Change me" });
      localStorage.setItem(NOTE_DB, JSON.stringify(this.notes));
    },

    rename: function(i) {
      let newName = prompt("New note name", this.notes[i].name);     
      if(newName.trim().length == 0) return;
      this.notes[i].name = newName;
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
