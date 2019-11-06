/*!
 # -- BEGIN LICENSE BLOCK ----------------------------------
 #
 # This file is part of tinyMCE.
 # YouTube for tinyMCE
 # Copyright (C) 2011 - 2019  Gerits Aurelien <aurelien[at]magix-cms[dot]com>
 # This program is free software: you can redistribute it and/or modify
 # it under the terms of the GNU General Public License as published by
 # the Free Software Foundation, either version 3 of the License, or
 # (at your option) any later version.
 #
 # This program is distributed in the hope that it will be useful,
 # but WITHOUT ANY WARRANTY; without even the implied warranty of
 # MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 # GNU General Public License for more details.

 # You should have received a copy of the GNU General Public License
 # along with this program.  If not, see <http://www.gnu.org/licenses/>.
 #
 # -- END LICENSE BLOCK -----------------------------------
 */
(function () {
    var youtube = (function () {
        'use strict';
        tinymce.PluginManager.requireLangPack("youtube");
        tinymce.PluginManager.add("youtube", function (editor, url) {

            /*
            Add a custom icon to TinyMCE
             */
            editor.ui.registry.addIcon('youtube-brands', '<svg width="24" height="24"><use xlink:href="'+url+'/img/youtube.svg#youtube-brands"></use></svg>');
            /*
            Use to store the instance of the Dialog
             */
            var _dialog = false;

            /*
            An array of options to appear in the "Type" select box.
             */
            var _typeOptions = [];
            /*
            Used to store a reference to the dialog when we have opened it
             */
            var _api = false;


            var _urlDialogConfig = {
                title: 'YouTube Title',
                url: url + "/youtube.html",
                width: 800,
                height: 620
            };
            // Define the Toolbar button
            editor.ui.registry.addButton('youtube', {
                    icon: 'youtube-brands',
                    tooltip: "YouTube Tooltip",
                    title:"YouTube Tooltip",
                    onAction: () => {
                    _api = editor.windowManager.openUrl(_urlDialogConfig)
                }
            });
            // Add a button into the menu bar
            editor.ui.registry.addMenuItem('youtube', {
                icon: 'youtube-brands',
                text: "YouTube Tooltip",
                tooltip: "YouTube Tooltip",
                title:"YouTube Tooltip",
                onAction: () => {
                    _api = editor.windowManager.openUrl(_urlDialogConfig)
                }
            });
            // Return details to be displayed in TinyMCE's "Help" plugin, if you use it
            // This is optional.
            return {
                getMetadata: function () {
                    return {
                        name: "YouTube Plugin",
                        url: "https://github.com/gtraxx/tinymce-plugin-youtube"
                    };
                }
            };
        });
    }());
})();