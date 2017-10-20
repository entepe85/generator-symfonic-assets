'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var useFramework;

module.exports = yeoman.Base.extend({
  constructor: function () {
    this._ = _;
    this.mkdirp = mkdirp;
    yeoman.Base.apply(this, arguments);
  },

  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the incredible ' + chalk.red('Symfony Assets') + ' generator!'
    ));

    var prompts = [{
      name: 'projectName',
      message: 'What is you project\'s name?'
    },
      {
        type: 'list',
        name: 'whatFramework',
        message: 'Would you like to use a framework?',
        choices: [
          {
            name: 'UI Kit (recommended)',
            value: 'uikit'
          },
          {
            name: 'Bootstrap',
            value: 'bootstrap'
          },
          {
            name: 'Bourbon/Neat',
            value: 'bourbon'
          },
          {
            name: 'None',
            value: 'none'
          }
        ]
      },
      {
        when: function (answers) {
          return answers && answers.whatFramework &&
          (answers.whatFramework.indexOf('none') !== -1 || answers.whatFramework.indexOf('bourbon') !== -1);
        },
        type: 'confirm',
        name: 'useJQuery',
        message: 'Do you need jQuery?',
        default: false
      },
      {
        type: 'confirm',
        name: 'es6',
        value: 'useES6',
        message: 'Do you need Babel for EcmaScript2015? (recommended)',
        default: true
      },
      {
        when: function (answers) {
          return answers && answers.es6;
        },
        type: 'confirm',
        name: 'webpack',
        value: 'useWebpack',
        message: 'Use Webpack for JS compilation? (recommended)',
        default: true
      },
      {
        type: 'confirm',
        name: 'postCSS',
        value: 'usePostCSS',
        message: 'Do you want to use PostCSS (w/ calc, zindex, short, pxtorem, cssnano)?',
        default: true
      },
      {
        type: 'confirm',
        name: 'browserSync',
        value: 'useBrowserSync',
        message: 'Do you want to use BrowserSync for live reloading? (recommended)',
        default: true
      },
      {
        type: 'confirm',
        name: 'imageMin',
        value: 'useImagemin',
        message: 'Do you want to use gulp-imagemin for image optimizations?',
        default: true
      },
      {
        type: 'confirm',
        name: 'FontAwesome',
        value: 'useFontAwesome',
        message: 'Do you want to include Font Awesome?',
        default: false
      }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.projectName = props.projectName;
      this.browserSync = props.browserSync;
      this.useImagemin = props.imageMin;
      this.useFontAwesome = props.FontAwesome;
      this.useES6 = props.es6;
      if (props.es6) {
        this.useWebpack = props.webpack;
      } else {
        this.useWebpack = false;
      }
      this.useJQuery = props.useJQuery;
      this.usePostCSS = props.postCSS;
      useFramework = props.whatFramework;

      this.useUIKit = false;
      this.useBootstrap = false;
      this.useBourbon = false;

      function wantsFramework(fw) {
        return useFramework && useFramework.indexOf(fw) !== -1;
      }

      this.useUIKit = wantsFramework('uikit');
      this.useBootstrap = wantsFramework('bootstrap');
      this.useBourbon = wantsFramework('bourbon');

      done();
    }.bind(this));
  },

  writing: {

    packageJSON: function () {
      this.template('_package.json', 'package.json');
    },

    app: function () {
      var context = {
        useES6:         this.useES6,
        useWebpack:     this.useWebpack,
        useUIKit:       this.useUIKit,
        useBootstrap:   this.useBootstrap,
        useBourbon:     this.useBourbon,
        useJQuery:      this.useJQuery,
        usePostCSS:     this.usePostCSS,
        browserSync:    this.browserSync,
        useImagemin:    this.useImagemin,
        projectName:    this.projectName
      };
      this.template('_bower.json', 'bower.json', context);
    },

    projectfiles: function () {
      var context = {
        siteName:       this.projectName,
        useES6:         this.useES6,
        useWebpack:     this.useWebpack,
        useUIKit:       this.useUIKit,
        useBootstrap:   this.useBootstrap,
        useBourbon:     this.useBourbon,
        useJQuery:      this.useJQuery,
        usePostCSS:     this.usePostCSS,
        projectName:    this.projectName,
        browserSync:    this.browserSync,
        useImagemin:    this.useImagemin,
        useFontAwesome: this.useFontAwesome
      };

      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
      this.fs.copy(
        this.templatePath('eslintrc.json'),
        this.destinationPath('.eslintrc.json')
      );
      this.fs.copy(
        this.templatePath('bowerrc'),
        this.destinationPath('.bowerrc')
      );
      this.fs.copy(
        this.templatePath('sass-lint.yml'),
        this.destinationPath('.sass-lint.yml')
      );
      this.fs.copy(
        this.templatePath('_ruleset.xml'),
        this.destinationPath('ruleset.xml')
      );

      this.template('_gulpfile.js', 'gulpfile.js', context);



      this.mkdirp('web-src');

      this.mkdirp('web-src/images');

      if (this.useES6) {
        this.directory(
          this.templatePath('_src/_es6'),
          this.destinationPath('web-src/es6')
        );

        this.directory(
          this.templatePath('_src/_es6/_modules'),
          this.destinationPath('web-src/es6/modules')
        );
      }

      if (this.useWebpack) {
        this.template('_webpack.config.js', 'webpack.config.js', context);
      }

      this.mkdirp('web-src/scss');

      this.template('_src/_scss/_app.scss', 'web-src/scss/app.scss', context);
      this.template('_src/_scss/_settings/_variables.scss', 'web-src/scss/_settings/_variables.scss', context);
      this.template('_src/_scss/_settings/_mixins.scss', 'web-src/scss/_settings/_mixins.scss', context);

      this.directory(
        this.templatePath('_src/_scss/_base'),
        this.destinationPath('web-src/scss/_base')
      );

      this.directory(
        this.templatePath('_src/_scss/_components'),
        this.destinationPath('web-src/scss/_components')
      );

      this.directory(
        this.templatePath('_src/_js'),
        this.destinationPath('web-src/js')
      );

      this.mkdirp('web-src/js/libs');
      this.mkdirp('web-src/js/dist');

      this.directory(
        this.templatePath('_src/_css'),
        this.destinationPath('web-src/css')
      );

    }

  },

  install: function () {

    this.installDependencies({
      skipInstall: this.options['skip-install']
    });


    this.on('end', function () {
      this.log(yosay(
        'Yeah! You\'re all set and done!' +
        ' Now simply run ' + chalk.green.italic('gulp js:libs') + ' first, then ' + chalk.green.italic('gulp') + ' and start coding!'
      ));
    });

  }
});
