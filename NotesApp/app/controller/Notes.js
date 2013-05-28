Ext.define("NotesApp.controller.Notes", {
    extend: "Ext.app.Controller",
    config: {
        refs: {
            notesListContainer: "noteslistcontainer",
			noteEditor: "noteeditor"
        },
        control: {
            notesListContainer: 
			{
				newNoteCommand: "onNewNoteCommand",
				editNoteCommand: "onEditNoteCommand"
            },
			noteEditor:
			{
				saveNoteCommand: "onSaveNoteCommand",
				deleteNoteCommand: "onDeleteNoteCommand",
				backToHomeCommand: "onBackToHomeCommand"
			}
        }
    },
	onNewNoteCommand: function ()
	{
		console.log("onNewNoteCommand");

		var now = new Date();
		var noteId = (now.getTime()).toString() + (this.getRandomInt(0, 100)).toString();

		var newNote = Ext.create("NotesApp.model.Note", 
		{
			id: noteId,
			dateCreated: now,
			title: "",
			narrative: ""
		});

		this.activateNoteEditor(newNote);
	},
	onDeleteNoteCommand: function () 
	{

		console.log("onDeleteNoteCommand");

		var noteEditor = this.getNoteEditor();
		var currentNote = noteEditor.getRecord();
		var notesStore = Ext.getStore("Notes");

		notesStore.remove(currentNote);
		notesStore.sync();

		this.activateNotesList();
	},
	
	
	getRandomInt: function (min, max)
	{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	onEditNoteCommand: function (list, record) 
	{
		console.log("onEditNoteCommand");
		this.activateNoteEditor(record);
	},
	onSaveNoteCommand: function () 
	{

		console.log("onSaveNoteCommand");

		var noteEditor = this.getNoteEditor();

		var currentNote = noteEditor.getRecord();
		var newValues = noteEditor.getValues();

		// Update the current note's fields with form values.
		currentNote.set("title", newValues.title);
		currentNote.set("narrative", newValues.narrative);

		var errors = currentNote.validate();

		if (!errors.isValid()) 
		{
			Ext.Msg.alert('Wait!', errors.getByField("title")[0].getMessage(), Ext.emptyFn);
			currentNote.reject();
			return;
		}

		var notesStore = Ext.getStore("Notes");

		if (null == notesStore.findRecord('id', currentNote.data.id)) 
		{
			notesStore.add(currentNote);
		}

		notesStore.sync();

		notesStore.sort([{ property: 'dateCreated', direction: 'DESC'}]);

		this.activateNotesList();
	},
	onBackToHomeCommand: function () 
	{
		console.log("onBackToHomeCommand");
		this.activateNotesList();
	},
	activateNotesList: function () 
	{
		Ext.Viewport.animateActiveItem(this.getNotesListContainer(), this.slideRightTransition);
	},
	activateNoteEditor: function (record) 
	{
		var noteEditor = this.getNoteEditor();
		noteEditor.setRecord(record); // load() is deprecated.
		Ext.Viewport.animateActiveItem(noteEditor, this.slideLeftTransition);
	},
	slideLeftTransition: { type: 'slide', direction: 'left' },
	slideRightTransition: { type: 'slide', direction: 'right' },
    launch: function ()
	{
		this.callParent(arguments);
		Ext.getStore("Notes").load();
		console.log("launch");
	},
    init: function () {
        this.callParent();
        console.log("init");
    }
});