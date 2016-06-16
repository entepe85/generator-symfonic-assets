# generator-symfonic-assets [![NPM version][npm-image]][npm-url]
> Generator for setting up asset generation for Symfony PHP projects.

## Installation

First install [node.js](https://nodejs.org/), [Gulp](http://gulpjs.com/) and [Bower](http://bower.io/) if you haven't already.
Then install [Yeoman](http://yeoman.io) and generator-symfonic-assets using [npm](https://www.npmjs.com/).

```bash
npm install -g yo
npm install -g generator-symfonic-assets
```

Then change into a fresh Symfony PHP project folder:

```bash
yo symfonic-assets
```

## ATTENTION

This generator is made for the sole purpose of generating front end assets for Symfony PHP framework projects, so it's mandatory to have a fresh Symfony project ready

After installing all dependencies please run `gulp jslibs` first to concatenate and compress all the JS libraries. Feel free to run this command again any time you add a new library (either through Bower or manually).

## Getting To Know Yeoman

 * Yeoman has a heart of gold.
 * Yeoman is a person with feelings and opinions, but is very easy to work with.
 * Yeoman can be too opinionated at times but is easily convinced not to be.
 * Feel free to [learn more about Yeoman](http://yeoman.io/).

## License

MIT © [Nils Butenschön](http://www.bdrops.de)


[npm-image]: https://badge.fury.io/js/generator-symfonic-assets.svg
[npm-url]: https://npmjs.org/package/generator-symfonic-assets
[travis-image]: https://travis-ci.org//generator-symfonic-assets.svg?branch=master
[travis-url]: https://travis-ci.org//generator-symfonic-assets
[daviddm-image]: https://david-dm.org//generator-symfonic-assets.svg?theme=shields.io
[daviddm-url]: https://david-dm.org//generator-symfonic-assets
