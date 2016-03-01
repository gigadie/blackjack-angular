# blackjack-angular

To use the app, after download the repository, you should run the following commands:

* install node
* `$ npm install`
* `$ npm install gulp -g`
* `$ npm install http-server -g`

Now you will need to generate a full build of the application, this will execute a full build (including also ExtJS inclusion):

    $ gulp build:dev

After the build has completed, then you'll be able to run the local server:

	$ http-server ./dist/

The result should be something like:

	Starting up http-server, serving ./dist/
	Available on:
	  http://127.0.0.1:8080
	  http://192.168.0.10:8080

Other useful commands:

This will watch your files for changes and continuously rebuild application JS files and CSS:

    $ gulp watch

The other useful tasks are:

    $ gulp test         // for a single unit tests run
    $ gulp tdd          // for a watcher on /js/main.js and all unit tests