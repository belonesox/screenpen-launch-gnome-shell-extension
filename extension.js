const Main = imports.ui.main;
const Meta = imports.gi.Meta;
const Shell = imports.gi.Shell;
const Tweener = imports.ui.tweener;
const GLib = imports.gi.GLib;

const Self = imports.misc.extensionUtils.getCurrentExtension();
const Convenience = Self.imports.convenience;
const Settings = Convenience.getSettings();
const Gettext = imports.gettext;
const _ = Gettext.domain('screenpen-launch').gettext;

const PanelMenu=imports.ui.panelMenu;
const St=imports.gi.St;
const Lang=imports.lang;
const PopupMenu=imports.ui.popupMenu;


let _icon_on_panel=null;

function _spawn() {
    return GLib.spawn_async(null, arguments, null, 0, null);
}


function _createHotkeyHandler(name) {

    return function() {
        if(name == "open-screenpen") {
            _spawn("/usr/bin/screenpen");
        }
    }
}

const TopPanelIcon=new Lang.Class(
{
    Name: 'TopPanelIcon.TopPanelIcon',
    Extends: PanelMenu.Button,
    _label: null,
    _icon: null,
    _menu_text: null,

    _init: function()
    {
        this.parent(0.0,"ScreenPen Icon",false);

        this._icon = new St.Icon({
             icon_size: 15,
             icon_name: 'folder-saved-search-symbolic'
         });
         this.actor.add_actor(this._icon);


        /* prepare menu */
        this._menu_text=_("Start drawing");
        let item = new PopupMenu.PopupMenuItem(this._menu_text);
        let textClicked = this._menu_text;
        item.connect('activate', Lang.bind(this,function(){
            this.menu.close();
            this._drow();
        }));
        this.menu.addMenuItem(item);

    },

    _drow: function()
    {
        _spawn("/usr/bin/screenpen");
    },

    destroy: function()
    {
        this.parent();
    }
});

// Init function
function init() {
    Settings = Convenience.getSettings();
    Convenience.initTranslations();
}

// Enable function
function enable() {

    global.display.add_keybinding('open-screenpen', Settings, Meta.KeyBindingFlags.NONE, _createHotkeyHandler('open-screenpen'));
    Main.wm.setCustomKeybindingHandler('open-screenpen', Shell.KeyBindingMode.NORMAL, _createHotkeyHandler('open-screenpen'));

    try {
       _icon_on_panel=new TopPanelIcon;
       Main.panel.addToStatusArea('uptime-indicator',_icon_on_panel);
    }
    catch(err) {
       global.log("Error enabling Icon of ScreenPen extension: "+err.message);
       _icon_on_panel.destroy();
       _icon_on_panel=null;
    }
}

// Disable function
function disable() {
    global.display.remove_keybinding('open-screenpen');

    if(_icon_on_panel) {
       _icon_on_panel.destroy();
       _icon_on_panel=null;
    }
}
