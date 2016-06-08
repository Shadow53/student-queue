/**
 * Created by michael on 4/29/16.
 */

function ErrorPage(code, message, redirect){
    if (this instanceof ErrorPage){
        if (isNaN(code))
            throw new Exception("Invalid HTTP Status Code");

        if (message === undefined) message = getErrorString(code);

        Object.defineProperty(this, "code", {
            enumerable: true,
            value: code
        });
        Object.defineProperty(this, "message", {
            enumerable: true,
            value: message
        });
        Object.defineProperty(this, "body", {
            enumerable: true,
            writable: true,
            value: "<h1>Error: " + this.code + "</h1><p>" + this.message + "</p>" +
                (redirect ? "<p>Click your browser's back button or wait to be redirected.</p>" : "")
        });

        Object.defineProperty(this, "html", {
            enumerable: true,
            value:
                "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                    '<meta charset="UTF-8">' +
                    '<link href="/css/foundation-flex.css" rel="stylesheet">' +
                    '<link href="/css/jquery-ui.min.css" rel="stylesheet">' +
                    '<link href="/css/style.css" rel="stylesheet">' +
                    '<script src="https://code.jquery.com/jquery-2.2.0.min.js"></script>' +
                    '<script src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js" type="text/javascript"></script>' +
                    "<title>Error: " + getErrorString(code) + "</title>" +
                    // Add redirect only if told to
                    (redirect ? "<script> setTimeout(function(){history.back();}, 3000); </script>" : "") +
                "</head>" +
                "<body>" +
                    '<div id="main">' +
                        this.body +
                    "</div>" +
                "</body>" +
                "</html>"
        });
    }
    else return new ErrorPage(code, message);
}

function getErrorString(code){
    switch (code) {
        case 400:
            return "Bad Request";
        case 401:
            return "Unauthorized";
        case 402:
            return "Payment Required";
        case 403:
            return "Forbidden";
        case 404:
            return "Resource Not Found";
        case 405:
            return "Method Not Allowed";
        case 410:
            return "Resource Gone";
        case 500:
            return "Internal Server Error.";
        case 501:
            return "Not Implemented";
        default:
            return "An Error Occurred";
    }
}

module.exports = ErrorPage;