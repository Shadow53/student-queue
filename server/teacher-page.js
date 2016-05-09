/**
 * Created by michael on 5/9/16.
 */
var capitalize = require("./library.js").capitalize;
function TeacherPage(roomName) {
    roomName = roomName.toLowerCase();
    this.html = '<!doctype html>' +
        '<html>' +
        '<head>' +
            '<meta charset="utf-8" />' +
            '<meta http-equiv="x-ua-compatible" content="ie=edge">' +
            '<meta name="viewport" content="width=device-width, initial-scale=1.0" />' +

            '<title>Teachers | ' + capitalize(name) + ' Queue</title>' +

            '<link rel="stylesheet" href="/css/foundation-flex.css" type="text/css" charset="utf-8">' +
            '<link rel="stylesheet" href="/css/jquery-ui.min.css" type="text/css" charset="utf-8">' +
            '<link rel="stylesheet" href="/css/jquery-ui.structure.min.css" type="text/css" charset="utf-8">' +
            '<link rel="stylesheet" href="/css/jquery-ui.theme.min.css" type="text/css" charset="utf-8">' +
            '<link rel="stylesheet" href="/css/style.css" type="text/css" charset="utf-8">' +

            '<script src="https://cdn.socket.io/socket.io-1.4.5.js"></script>' +
            '<script src="https://code.jquery.com/jquery-2.2.1.min.js"></script>' +
            '<script src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js" charset="utf-8"></script>' +
            '<script src="/js/canNotify.js" charset="utf-8"></script>' +
            '<script>' +
                'var socket = io("/' + roomName +'");' +
            '</script>' +
            '<script src="/js/queue.js" charset="utf-8"></script>' +
        '</head>' +
        '<body>' +
            '<div id="main">' +
                '<div class="row">' +
                    '<div class="large-12 medium-12 small-12 columns text-center">' +
                        '<div class="row">' +
                            '<div class="large-10 medium-10 small-8 columns">' +
                                '<h1>' + capitalize(roomName) + '\'s Student Queue</h1>' +
                            '</div>' +
                            '<div class="large-2 medium-2 small-4 columns">' +
                                '<form name="logout" method="POST">' +
                                    '<button class="button" id="logout">Log Out</button>' +
                                '</form>' +
                            '</div>' +
                        '</div>' +
                        '<div class="row">' +
                            '<div class="large-12 medium-12 small-12 columns text-center">' +
                                '<button class="button" id="studentClear">Clear</button>' +
                            '</div>' +
                        '</div>' +
                        '<div class="row" id="studentQueue">' +

                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</body>' +
        '</html>'
}

module.exports = TeacherPage;