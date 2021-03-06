/**
 * Created by michael on 5/13/16.
 */
var capitalize = require("./library.js").capitalize;
function queueAdminPage(name) {
    name = name.toLowerCase();
    this.html = '<!DOCTYPE html>' +
        '<html>' +
        '<head>' +
            '<meta charset="utf-8" />' +
            '<meta http-equiv="x-ua-compatible" content="ie=edge">' +
            '<meta name="viewport" content="width=device-width, initial-scale=1.0" />' +

            '<title>Changing Password | ' + capitalize(name) + ' Queue</title>' +

            '<link rel="stylesheet" href="/css/foundation-flex.css" type="text/css" charset="utf-8">' +
            '<link rel="stylesheet" href="/css/style.css" type="text/css" charset="utf-8">' +

            '<script src="https://code.jquery.com/jquery-2.2.0.min.js"></script>' +
            '<script src="/js/changePass.js"></script>' +
        '</head>' +
        '<body>' +
            '<div id="main">' +
                '<form name="login">' +
                    '<div class="row">' +
                        '<div class="large-12 medium-12 small-12 columns text-center">' +
                            '<h1>Changing the teacher password <span id="error"></span></h1>' +
                        '</div>' +
                    '</div>' +
                    '<div class="row">' +
                        '<div class="large-4 medium-4 small-4 columns text-right align-self-middle">' +
                            '<label for="old">Old Password: </label>' +
                        '</div>' +
                        '<div class="large-8 medium-8 small-8 columns text-left align-self-middle">' +
                            '<input type="password" name="old" id="old"/>' +
                        '</div>' +
                    '</div>' +
                    '<div class="row">' +
                        '<div class="large-4 medium-4 small-4 columns text-right align-self-middle">' +
                            '<label for="pass1">New Password: </label>' +
                        '</div>' +
                        '<div class="large-4 medium-4 small-4 columns text-left align-self-middle">' +
                            '<input type="password" name="pass1" id="pass1"/>' +
                        '</div>' +
                    '</div>' +
                    '<div class="row">' +
                        '<div class="large-4 medium-4 small-4 columns text-right align-self-middle">' +
                            '<label for="pass2">Confirm New Password: </label>' +
                        '</div>' +
                        '<div class="large-4 medium-4 small-4 columns text-left align-self-middle">' +
                            '<input type="password" name="pass2" id="pass2"/>' +
                        '</div>' +
                    '</div>' +
                    '<div class="row align-center">' +
                        '<div class="large-4 medium-8 small-12 columns large-text-left medium-text-left small-text-center">' +
                            '<button type="button" class="button" id="changePass">Change Password</button>' +
                        '</div>' +
                    '</div>' +
                '</form>' +
            '</div>' +
        '</body>' +
        '</html>';
}

module.exports = queueAdminPage;