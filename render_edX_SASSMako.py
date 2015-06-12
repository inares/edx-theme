#!/usr/bin/env python

import sys, glob, os, json, fnmatch
from mako.template import Template

MAKO_DIR = 'source/css/edx-sass'


try:
    with open( '/edx/app/edxapp/lms.env.json' ) as env_file:
        settings=json.load(env_file)
except ValueError:
    print( 'Error: Could not parse JSON' )
    sys.exit( 1 )

context        = {}
context['env'] = settings


print( 'Directory to search mako files: \'' + MAKO_DIR + '\'' )

for root, dirnames, filenames in os.walk(MAKO_DIR):
    for filename in fnmatch.filter( filenames, '*.mako' ):
        src  = os.path.join( root, filename )
        dest = src[:-5]
        print( 'File: \'' + src + '\' --> \'' + dest + '\'' )

        mytemplate = Template(
            filename=src,
            module_directory='/edx/app/edxapp/edx-platform/common/djangoapps',
            input_encoding='utf-8',
            output_encoding='utf-8' )

        try:
            with open( dest, 'w' ) as file:
                file.write( mytemplate.render(**context) )
                file.close()
        except ValueError:
            print( 'Error: Could not write file \'' + dest + '\'' )
            sys.exit( 1 )

        #f = open( dest, 'w' )
        #f.write( mytemplate.render(**context) )
        #f.close()
