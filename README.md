# student-queue
Application for teachers so students can add themselves to a "help" queue

More specifically, this is a webserver with a [Node.js](https://nodejs.org) backend that uses [express.js](https://expressjs.com) and [socket.io](https://socket.io) to provide students with forms to submit requests for help that the teacher or an aide can help with. The requests appear on a password-protected teacher page in real time, preventing the need for refreshing. Requests are added to all instances of the teacher page and fulfilled requests are removed from all instances as well. This server supports having multiple help queues, for instance one for each room to be used in.

This program is in functional beta, with more features to be added before I will consider this a full "stable" release.

# How to use

Use in your own server is easy, simply create an `app.js` file with the following content:

```javascript
var Queue = require("student-queue");

var queue = new Queue({
    host: "127.0.0.1",      // The host of the database. Use 127.0.0.1 or localhost for the same machine
    database: "mydb",       // The (by default) MySQL database to use for the program
    user: "myuser",         // The database user with access to the above database
    password: "P@SSW0RD",   // The database user's password
    port: 3000              // The port for the server to be accessed on. 3000 is default
});

queue.start();
```

The program currently expects to be run from the root of a domain or subdomain. So `www.domain.com` and `helpqueue.domain.com` are valid, but `www.domain.com/queue/` is not. Keep that in mind when setting it up. There are no promises for this to change in the future.

Site administration can be found at `/admin`, as in `https://helpqueue.domain.com/admin` The default password is `password` **You must change this yourself before putting it into production**.

Queue names must contain only alphanumeric characters: A-Z and 0-9. If there is a queue called `library`, its homepage can be found at `/library`, the student page at `/library/student`, and the teacher page at `/library/teacher`.

Planned features can be found in the [Issues](https://github.com/Shadow53/student-queue/issues) tab on the [GitHub page](https://github.com/Shadow53/student-queue) by filtering for the "enhancement" label
