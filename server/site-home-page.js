/**
 * Created by michael on 5/13/16.
 */
function SiteHomePage(){
    this.html = '<!DOCTYPE html>' +
        '<html lang="en">' +
        '<head>' +
            '<meta charset="UTF-8">' +
            '<title>Home</title>' +

            '<link href="/css/foundation-flex.css" rel="stylesheet">' +
            '<link rel="stylesheet" href="/css/jquery-ui.min.css" type="text/css" charset="utf-8">' +
            '<link rel="stylesheet" href="/css/jquery-ui.structure.min.css" type="text/css" charset="utf-8">' +
            '<link rel="stylesheet" href="/css/jquery-ui.theme.min.css" type="text/css" charset="utf-8">' +
            '<link href="/css/style.css" rel="stylesheet">' +

            '<script src="https://code.jquery.com/jquery-2.2.0.min.js"></script>' +
            '<script src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js" charset="utf-8"></script>' +
            '<script>' +
                '$(document).ready(function(){' +
                    '$.getJSON("/admin/queues").done(function(queues){' +
                        'if (queues.length > 0){' +
                            'var accordion = $("#queueAccordion");' +
                            'queues.forEach(function(queue, i, arr){' +
                                'var name = queue.name.toLowerCase();' +
                                'var title = $("<h3></h3>", {' +
                                    'id: name + "Title",' +
                                    'text: name.charAt(0).toUpperCase() + name.slice(1)' +
                                '});' +
                                'var content = $("<div></div>", {' +
                                    'id: name + "Content"' +
                                '});' +
                                'content.html(' +
                                    '\'<a class="button" href="/\' + name + \'/student">Student</a>\' +' +
                                    '\'<a class="button" href="/\' + name + \'/teacher">Teacher</a>\'' +
                                ');' +
                                'accordion.append(title, content);' +
                            '});' +

                            '$(accordion).accordion({' +
                                'collapsible: true,' +
                                'active: false,' +
                                'heightStyle: "content",' +
                                'header: "h3"' +
                            '});' +
                        '}' +
                    '});' +
                '});' +
            '</script>' +
        '</head>' +
        '<body>' +
            '<div id="main">' +
                '<div class="row">' +
                    '<div class="large-12 medium-12 small-12 columns text-center">' +
                        '<h1>Welcome to the Queue</h1>' +
                    '</div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="large-6 medium-6 small-12 columns">' +
                        '<p>' +
                            'Welcome to the help request queue. ' +
                            'Please select a queue from the list and choose "Student" if you are a student or ' +
                            '"Teacher" if you are the teacher or the student aide.' +
                        '</p>'+
                    '</div>' +
                    '<div class="large-6 medium-6 small-12 columns">' +
                        '<div id="queueAccordion">' +

                        '</div>' +
                    '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</body>' +
        '</html>';
}
module.exports = SiteHomePage;