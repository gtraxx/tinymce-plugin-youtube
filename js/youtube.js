/*
 # -- BEGIN LICENSE BLOCK ----------------------------------
 #
 # This file is part of tinyMCE.
 # YouTube for tinyMCE
 # Copyright (C) 2011 - 2013  Gerits Aurelien <aurelien[at]magix-dev[dot]be> - <contact[at]aurelien-gerits[dot]be>
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
(function ($) {
    var timer;

    /*
     * Return youtube id
     * @param url {string}
     * @return {string|boolean}
     */
    function youtubeId(url) {
        var match = url.match((/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/));
        return match && match[2].length === 11 ? match[2] : false;
    }

    /**
     * Return YouTube convertUrl URL
     * @param url {string}
     * @param iframe {bool} embed or iframe
     * @returns {string}
     */
    function convertUrl(url, iframe) {
        var id = youtubeId(url);
        if (url && id) {
            url = "https://www.youtube.com/" + (iframe ? "embed/" : "v/") + youtubeId(url);
        }
        return url;
    }

    /**
     * Format HTML
     * @param iframe {boolean}
     * @param width {number}
     * @param height {number}
     * @param data {string}
     * @returns {string}
     */
    function dataToHtml(iframe, width, height, data) {
        var dim, code;
        if (data) {
            dim = 'width="' + width + '" height="' + height + '"';
            if (iframe) {
                code = '<iframe src="' + data + '" ' + dim + ' frameborder="0" allowfullscreen>&nbsp;</iframe>';
            } else {
                code =  '<div class="youtube">' +
                            '<object type="application/x-shockwave-flash" ' + dim + ' data="' + data + '&modestbranding=1">' +
                                '<param name="movie" value="' + data + '&modestbranding=1" />' +
                                '<param name="wmode" value="transparent" />' +
                            '</object>' +
                        '</div>';
            }
        }
        return code;
    }

    /**
     * Insert content when the window form is submitted
     * @returns {string}
     */
    function insert() {
        var result,
            options = "",
            html5State = $("#video").is(":checked"),
            youtubeAutoplay = $("#youtubeAutoplay").is(":checked"),
            youtubeREL = $("#youtubeREL").is(":checked"),
            youtubeHD = $("#youtubeHD").is(":checked"),
            width = $("#youtubeWidth").val(),
            height = $("#youtubeHeight").val(),
            newYouTubeUrl = convertUrl($('#youtubeID').val(), html5State);

        if (youtubeAutoplay) {
            options += "&amp;autoplay=1";
        }
        //SELECT Include related videos
        //var relvideo = document.getElementById("youtubeREL");
        if (youtubeREL) {
            options += "&amp;rel=0";
        }

        //SELECT Watch in HD
        //var HD = document.getElementById("youtubeHD");
        if (youtubeHD) {
            options += "&amp;hd=1";
        }

        if (newYouTubeUrl) {
            // Insert the contents from the input into the document
            result = dataToHtml(html5State, width, height, newYouTubeUrl + (html5State ? "" : options));
        }
        return result;
    }

    function preview() {
        $("#preview").html(
            dataToHtml(true, 420, 315, convertUrl($('#youtubeID').val()))
        );
    }

    /**
     * Update Timer with keypress
     * @param ts {number} (optional)
     */
    function updateTimer(ts) {
        clearTimeout(timer);
        timer = setTimeout(preview, ts || 1000);
    }

    function run() {
        var data = insert();
        if (data) {
            parent.tinymce.activeEditor.insertContent(data);
        }
        parent.tinymce.activeEditor.windowManager.close();
    }

    function runPreview() {
        if ($("#preview").length) {
            $('#youtubeID').keypress(function () {
                updateTimer();
            }).change(function () {
                updateTimer(100);
            });
        }
    }

    /**
     * Execute namespace youtube
     */
    $(function () {
        // Init templatewith mustach
        var data = {
            youtubeurl: parent.tinymce.util.I18n.translate("Youtube URL"),
            youtubeID: parent.tinymce.util.I18n.translate("Youtube ID"),
            youtubeWidth: parent.tinymce.util.I18n.translate("width"),
            youtubeHeight: parent.tinymce.util.I18n.translate("height"),
            youtubeAutoplay: parent.tinymce.util.I18n.translate("autoplay"),
            youtubeHD: parent.tinymce.util.I18n.translate("HD video"),
            youtubeREL: parent.tinymce.util.I18n.translate("Related video"),
            HTML5: parent.tinymce.util.I18n.translate("html5"),
            Insert: parent.tinymce.util.I18n.translate("Insert")
        };

        //Use jQuery's get method to retrieve the contents of our template file, then render the template.
        $.get("view/forms.html", function (template) {
            $("#template-container").append(Mustache.render(template, data));
            runPreview();
            $("#insert-btn").on("click", run);
        });
    });
}(jQuery));
