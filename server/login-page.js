/**
 * Created by michael on 5/13/16.
 */
function LoginPage(baseUrl, type) {
    type = type.toLowerCase();
    baseUrl += (baseUrl.charAt(baseUrl.length - 1) === "/" ? "" : "/");
    this.html = '<!DOCTYPE html>' +
        '<html lang="en">' +
        '<head>' +
            '<meta charset="utf-8" />' +
            '<meta http-equiv="x-ua-compatible" content="ie=edge">' +
            '<meta name="viewport" content="width=device-width, initial-scale=1.0" />' +
            '<title>Login</title>' +
            '<link rel="stylesheet" href="/css/foundation-flex.css" type="text/css"/>' +
            '<link rel="stylesheet" href="/css/style.css" type="text/css"/>' +
        '</head>' +
        '<body>' +
            '<div id="main">' +
                '<div class="row">' +
                    '<div class="large-12 columns">' +
                        '<h1 class="title">Please Enter Your Password</h1>' +
                    '</div>' +
                '</div>' +
                '<div class="row">' +
                    '<form name="loginDiv" method="POST" action="' + baseUrl + 'login">' +
                        '<label>Please enter the ' + type + ' password: <input type="password" name="password" id="pwInput"></label>' +
                        '<br/><span id="loginStatus" class="status"></span>' +
                        '<br/><button type="submit" class="button" id="loginButton">Log In</button>' +
                    '</form>' +
                '</div>' +
            '</div>' +
        '</body>' +
        '</html>';
}
module.exports = LoginPage;