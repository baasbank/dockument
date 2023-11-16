import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
import path from 'path';
import shell from 'gulp-shell';

// Load the gulp plugins into the `plugins` variable
const plugins = loadPlugins();

// Compile all Babel Javascript into ES5 and place in dist folder
const paths = {
  js: ['./**/*.js', '!dist/**', '!node_modules/**']
};

// Compile all Babel Javascript into ES5 and put it into the dist dir
gulp.task('babel', () =>
  gulp.src(paths.js, { base: '.' })
    .pipe(plugins.babel())
    .pipe(gulp.dest('dist'))
);

// Restart server with on every changes made to file
gulp.task('nodemon', ['babel'], () =>
  plugins.nodemon({
    script: path.join('dist', 'index.js'),
    ignore: ['README.md', 'node_modules/**/*.js', 'dist/**/*.js'],
    ext: 'js',
    tasks: ['babel']
  })
);

gulp.task('default', ['nodemon']);
gulp.task('production', ['babel']);

gulp.task('cleardb', shell.task([
  'cross-env NODE_ENV=test sequelize db:migrate:undo:all',
]));

gulp.task('migrate', ['cleardb'], shell.task([
  'cross-env NODE_ENV=test sequelize db:migrate',
]));

gulp.task('seed', ['migrate'], shell.task([
  'cross-env NODE_ENV=test sequelize db:seed:all',
]));

gulp.task('coverage', ['seed'], shell.task([
  'cross-env NODE_ENV=test nyc mocha ./server/tests/**/*.js --timeout 20000',
]));

gulp.task('test', ['coverage']);
