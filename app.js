Ext.application({
    name: "NotesApp",
    controllers: ["Notes"],
    views: ["NotesList","NotesListContainer", "NoteEditor"],
	stores: ["Notes"],
	models: ["Note"],
	requires: ["Ext.Toolbar"],
    launch: function () {

        var notesListContainer = 
		{
			xtype: "noteslistcontainer"
		};
		var noteEditor =
		{
			xtype: "noteeditor"
        };
        Ext.Viewport.add(notesListContainer);
		Ext.Viewport.add(noteEditor);
    }
});