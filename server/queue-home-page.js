/**
 * Created by michael on 5/13/16.
 */
var capitalize = require("./library.js").capitalize;
function queueHomePage(name) {
    name = name.toLowerCase();
    this.html = '<!DOCTYPE html>' +
        '<html lang="en">' +
            '<head>' +
                '<meta charset="utf-8" />' +
                '<meta http-equiv="x-ua-compatible" content="ie=edge">' +
                '<meta name="viewport" content="width=device-width, initial-scale=1.0" />' +
                '<title>Welcome!</title>' +
                '<link rel="stylesheet" href="/css/foundation-flex.css" type="text/css"/>' +
                '<link rel="stylesheet" href="/css/style.css" type="text/css"/>' +
            '</head>' +
            '<body>' +
                '<div id="main">' +
                    '<div class="row">' +
                        '<div class="large-12 columns">' +
                            '<h1 class="title">Who Are You?</h1>' +
                        '</div>' +
                    '</div>' +
                    '<div class="row">' +
                        '<a class="large-6 medium-6 small-12 columns button whoami" id="student" href="/' + name+  '/student">' +
                            'I AM A STUDENT' +
                        '</a>' +
                        '<a class="large-6 medium-6 small-12 columns button whoami" id="teacher" href="/' + name + '/teacher">' +
                            'I AM A TEACHER/AIDE' +
                        '</a>' +
                    '</div>' +
                '</div>' +
                /*'<script>' +
                'var student = document.getElementById("student");' +
                'var teacher = document.getElementById("teacher");' +
                'var href = window.location.href;' +
                'href += (href.lastIndexOf("/") === href.length - 1 ? "" : "/");' +
                'student.setAttribute("href", href + "student");' +
                'teacher.setAttribute("href", href + "teacher");' +
            '</script>' +*/
            '</body>' +
        '</html>';
}

module.exports = queueHomePage;