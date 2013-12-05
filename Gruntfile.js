module.exports = function ( grunt ) {

    "use strict";

    //Call Node.js API
//    var os = require('os');
//    var fs = require('fs');
//    var url = require('url');
//    var mkdirp = require('mkdirp');
    var filePoster = require('file-poster');


    var DAY = '<%= grunt.template.today("yyyymmdd") %>',
        TIMESTAMP_DATE = '<%= grunt.template.today("yyyymmddhhMM") %>',
        TIMESTAMP_PREFIX = '@',
        TIMESTAMP = TIMESTAMP_PREFIX + TIMESTAMP_DATE;

    /**
     * {ids: [
                {id: 'file0', success: 1},
                {id: 'file1', success: 0},
                ...
            ]};
     */
    var successFileIds = {ids: []};

    try {
        var copyConfig = readOptJSON('_resource/gruntConf/.copyfiles'),
            renameConfig = readOptJSON('_resource/gruntConf/.renamefiles'),
            deleteConfig = readOptJSON('_resource/gruntConf/.deletefiles'),
            uploadConfig = readOptJSON('_resource/gruntConf/.uploadfiles'),
            jsminConfig = readOptJSON('_resource/gruntConf/.jsminfiles'),
            cssminConfig = readOptJSON('_resource/gruntConf/.cssminfiles'),
            zipConfig = readOptJSON('_resource/gruntConf/.zipfiles')
    }
    catch ( e ) {
        console.log(e);
    }
//    console.log(JSON.stringify(uploadConfig));

//    console.log('ok');
//    console.log('archive:' + decodeURIComponent(zipConfig.options.archive));
//    zipConfig.options.archive = decodeURIComponent(zipConfig.options.archive);
//    return ;

    if ( renameConfig.files && renameConfig.files.length > 0 ) {
        for ( var ri = 0, len = renameConfig.files.length; ri < len; ri++ ) {
            (function () {
                var item = renameConfig.files[ri];
                if ( !grunt.file.isFile(item.src[0]) ) {
                    return;
                }

                item.rename = function () {
                    var fname = getFileNameWithoutType(item.src[0]);
                    var ftype = getFileType(item.src[0]);
                    //                console.log(item.dest + "\\" + fname + renameConfig.suffix + '.' + ftype);
                    return item.dest + "\\" + fname + renameConfig.suffix + '.' + ftype;
                };
            })();
        }
    }

    // 配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            options: {
                forceOverwrite: true,
                force: true
            },
            pack: {
                files: copyConfig.files
            },
            rename: {
                files: renameConfig.files
            },
            upload: {
                files: uploadConfig.files
            }
        },
        clean: {
            options: {
                force: true
            },
            deletePackage: {
                src: deleteConfig.src
            }
        },
        uglify: {
            min: {
                files: jsminConfig.files
            }
        },
        cssmin: {
            min: {
                files: cssminConfig.files
            }
        }
        ,

//        connect: {
//            server: {
//                options: {
//                    port: 9999,
//                    keepalive: true,
//                    base: ''
//                }
//            }
//        },


        // why not work???
//        imagemin: {                          // Task
//            options: {                       // Target options
//                optimizationLevel: 7
//            },
//            files: {                         // Dictionary of files
//                'src/grunt-logo-min.png': 'src/grunt-log.png'
//            }
//        },

        compress: {
            zipPackage: zipConfig
        }
//,
//        replace: {
//            example: {
//                src: ['testDir/replace/*.*'],             // source files array (supports minimatch)
//                dest: 'build/',             // destination directory or file
////                overwrite: true,
//                replacements: [
//                    {
//                        from: '这是一个大大的测试',                   // string replacement
//                        to: ''
//                    },
//                    {
//                        from: /(f|F)(o{2,100})/g,      // regex replacement ('Fooo' to 'Mooo')
//                        to: 'M$2'
//                    },
//                    {
//                        from: 'Foo',
//                        to: function ( matchedWord ) {   // callback replacement
//                            return matchedWord + ' Bar';
//                        }
//                    }
//                ]
//            }
//        }
    });

    // 加载模块
//    grunt.loadNpmTasks('grunt-contrib');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');


//    grunt.loadNpmTasks('grunt-contrib-connect');
//    grunt.loadNpmTasks('grunt-contrib-imagemin');

//    grunt.loadNpmTasks('grunt-shell');
//    grunt.loadNpmTasks('grunt-text-replace');

//    grunt.registerTask('writeFile', function ( filepath, contents ) {
////          console.log(filepath + "\r\n" + contents);
//        try {
//            grunt.file.write(decodeURIComponent(filepath), decodeURIComponent(contents));
//        } catch ( e ) {
//            console.log('error:' + e);
//        }
////        grunt.file.write((filepath), (contents));
//
//    });

//    grunt.registerTask('envInfo', function () {
//        try {
//            for ( var item in os ) {
//                if ( os.hasOwnProperty(item) && typeof os[item] == 'function' ) {
//                    console.log(item + ":" + os[item]());
//                }
//            }
//        } catch ( e ) {
//            console.log(e)
//        }
//    });


    //grunt.registerTask('default', '一些描述', ['jasmine', 'shell', 'clean', 'cssmin', 'uglify', 'yuidoc', 'copy']);


    function getFileNameWithoutType( path ) {
        return path.replace(/^.*\\(.*)\.\w*$/, '$1');
    }

    function getFileType( path ) {
        return path.replace(/^.*\\.*\.(\w*)$/, '$1');
    }

    function readOptJSON( filepath ) {
        var data = {};
        try {
            data = JSON.parse(decodeURIComponent(grunt.file.read(filepath)));
        } catch ( e ) {
            console.log('无法解析Opt文件:' + e);
        }
        return data;
    }

}
;