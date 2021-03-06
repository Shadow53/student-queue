/**
 * Created by michael on 5/9/16.
 */
var capitalize = require("./library.js").capitalize;
function StudentPage(name) {
    if (this instanceof StudentPage) {
        name = name.toLowerCase();
        this.html = '<!DOCTYPE html>' +
            '<html>' +
            '<head>' +
                '<meta charset="utf-8" />' +
                '<meta http-equiv="x-ua-compatible" content="ie=edge">' +
                '<meta name="viewport" content="width=device-width, initial-scale=1.0" />' +

                '<title>Students | ' + capitalize(name) + ' Queue</title>' +

                '<link rel="stylesheet" href="/css/foundation-flex.css" type="text/css" charset="utf-8">' +
                '<link rel="stylesheet" href="/css/style.css" type="text/css" charset="utf-8">' +

                '<script src="https://cdn.socket.io/socket.io-1.4.5.js"></script>' +
                '<script src="https://code.jquery.com/jquery-2.2.0.min.js"></script>' +
                '<script>' +
                    'var socket = io("/' + name + '");' +
                '</script>' +
                '<script src="/js/request.js" charset="utf-8"></script>' +
            '</head>' +
            '<body>' +
                '<div id="main">' +
                    '<div class="row">' +
                        '<div class="large-12 medium-12 small-12 columns text-center">' +
                            '<h1>Request Help</h1>' +
                        '</div>' +
                    '</div>' +
                    '<div class="row" id="needHelp">' +
                        '<div class="large-6 medium-6 small-12 columns">' +
                            '<div class="row">' +
                                '<div class="large-12 medium-12 small-12 columns">' +
                                    '<label for="studentId">' +
                                        '<h3>Student ID#:</h3>' +
                                    '</label>' +
                                    '<small>This is the six-digit number</small><br/>' +
                                    '<input type="text" id="studentId" placeholder="Example: 654321">' +
                                '</div>' +
                                '<div class="large-12 medium-12 small-12 columns">' +
                                    '<label for="studentName">' +
                                        '<h3>Student Name:</h3>' +
                                    '</label>' +
                                    '<small>Please enter your full, real name. Anything that the teacher cannot recognize will be ignored.</small><br/>' +
                                    '<input type="text" id="studentName" placeholder="Example: Joe Smith">' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="large-6 medium-6 small-12 columns">' +
                            '<label>' +
                                '<h3>Issue:</h3>' +
                            '</label>' +
                            '<textarea type="text" id="problemText" placeholder="Example: ArrayIndexOutOfBoundsException on reverse method"></textarea>' +
                        '</div>' +
                    '</div>' +
                    '<div class="row">' +
                        '<div class="large-4 medium-4 small-12 columns">' +
                            '<br>' +
                            '<button class="expanded button" id="submitHelpRequest">Submit</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</body>' +
            '</html>';
    }
    else return new StudentPage(name);
}

module.exports = StudentPage;