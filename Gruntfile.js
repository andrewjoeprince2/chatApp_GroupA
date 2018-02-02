module.exports = function(grunt) {
  // 1. all config stuff goes here
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'), // reads the packages etc inside that file
    //  uglify: {
    //    build: {
    //      src: 'public/js/main.js',
    //      dest: 'public/js/main.min.js'
  //      }
  //    },

      watch: {
//        scripts: {
//          files: ['public/js/main.js'],
//          tasks: ['uglify'],
//          options: {
//            spawn: false
//          }
//        },

        sass: {
          files: ['sass/main.scss'],
          tasks: ['sass']
        }
      },

      sass: {
        dist: {
          options: {
            style: 'compressed'
          },
          files: {
            'public/css/main.css':'sass/main.scss'
          }
        }
      }
  });

  //grunt.loadNpmTasks('grunt-contrib-uglify-es');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('default', ['sass']); //uglify
  grunt.registerTask('watchFiles', ['watch']);
};
