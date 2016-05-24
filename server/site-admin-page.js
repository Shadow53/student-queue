/**
 * Created by michael on 5/13/16.
 */
function SiteAdminPage(name) {
    this.html = '<!DOCTYPE html>' +
        '<html lang="en">' +
        '<head>' +
            '<meta charset="UTF-8">' +
            '<title>Site Administration</title>' +
            '<link href="/css/foundation-flex.css" rel="stylesheet">' +
            '<link href="/css/jquery-ui.min.css" rel="stylesheet">' +
            '<link href="/css/style.css" rel="stylesheet">' +

            '<script src="https://code.jquery.com/jquery-2.2.0.min.js"></script>' +
            '<script src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js" type="text/javascript"></script>' +
            '<!--script src="/js/login.js" type="text/javascript"></script-->' +
            '<script src="/js/siteAdmin.js" type="text/javascript"></script>' +
        '</head>' +
        '<body>' +
            '<div id="main">' +
                '<div class="row">' +
                    '<div class="large-10 medium-10 small-8 columns text-center">' +
                        '<h1>Site Administration</h1>' +
                    '</div>' +
                    '<div class="large-2 medium-2 small-4 columns text-center">' +
                        '<form name="logout" method="POST">' +
                            '<button class="button" id="logout">Log Out</button>' +
                        '</form>' +
                    '</div>' +
                '</div>' +
                '<div class="row" id="queueAdmin">' +
                    '<div class="large-3 medium-4 small-12 columns">' +
                        '<ol>' +
                            '<li><a href="#newQueue">Add New Queue</a></li>' +
                            '<li><a href="#existingQueues">View/Modify Existing Queues</a></li>' +
                            '<li><a href="#sitePrefs">Change Site Preferences</a></li>' +
                        '</ol>' +
                    '</div>' +
                    '<div class="large-9 medium-8 small-12 columns">' +
                        '<div id="existingQueues">' +

                        '</div>' +
                        '<div id="newQueue">' +
                            '<form name="new_queue" action="/admin/queues" method="POST">' +
                                '<h2>Creating a new help queue <span id="newQueueError"></span></h2>' +
                                '<label for="newName">New Queue Name</label>' +
                                '<small><em>Alphanumeric only, no spaces.</em></small>' +
                                '<br/>' +
                                '<input type="text" name="newName" id="newName" minlength="3" pattern="\\b\\w+\\b" required/>' +
                                '<br/>' +
                                '<label for="pass1">Queue Admin Password</label>' +
                                '<small><em>At least 8 characters!</em></small>' +
                                '<br/>' +
                                '<input type="password" name="pass1" id="pass1" minlength="8" required/>' +
                                '<br/>' +
                                '<label for="pass2">Confirm Password</label>' +
                                '<br/>' +
                                '<input type="password" name="pass2" id="pass2" minlength="8" required/>' +
                                '<br/>' +
                                '<label for="desc">Queue Description</label>' +
                                '<br/>' +
                                '<textarea name="desc" id="desc"></textarea><br/>' +
                                '<button type="submit" class="button" id="makeNewQueue">Create</button>' +
                            '</form>' +
                        '</div>' +
                        '<div id="sitePrefs">' +
                            '<form name="adminPassChange" action="/admin" method="POST">' +
                                '<div class="row">' +
                                    '<div class="large-12 medium-12 small-12 columns text-center">' +
                                        '<h2>Changing the Site Admin password <span id="adminPassChangeError"></span></h2>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="row">' +
                                    '<div class="large-4 medium-4 small-4 columns text-right align-self-middle">' +
                                        '<label for="oldAdmin">Old Password: </label>' +
                                    '</div>' +
                                    '<div class="large-8 medium-8 small-8 columns text-left align-self-middle">' +
                                        '<input type="password" name="old" id="oldAdmin"/>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="row">' +
                                    '<div class="large-4 medium-4 small-4 columns text-right align-self-middle">' +
                                        '<label for="pass1">New Password: </label>' +
                                    '</div>' +
                                    '<div class="large-4 medium-4 small-4 columns text-left align-self-middle">' +
                                        '<input type="password" name="newpassword" id="pass1Admin"/>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="row">' +
                                    '<div class="large-4 medium-4 small-4 columns text-right align-self-middle">' +
                                        '<label for="pass2">Confirm New Password: </label>' +
                                    '</div>' +
                                    '<div class="large-4 medium-4 small-4 columns text-left align-self-middle">' +
                                        '<input type="password" name="confirmpassword" id="pass2Admin"/>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="row align-center">' +
                                    '<div class="large-4 medium-8 small-12 columns large-text-left medium-text-left small-text-center">' +
                                        '<button type="submit" class="button" id="changeAdminPass">Change Password</button>' +
                                    '</div>' +
                                '</div>' +
                            '</form>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</body>' +
        '</html>';
}

module.exports = SiteAdminPage;