#!/usr/bin/python
# -*- coding: utf-8 -*-
#
# --- BEGIN_HEADER ---
#
# sssadmin - SSS sandbox generator and monitor for individual users
# Copyright (C) 2003-2009  The MiG Project lead by Brian Vinter
#
# This file is part of MiG.
#
# MiG is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# MiG is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
#
# -- END_HEADER ---
#

"""This script allows users to administrate their sandboxes"""

from shared.init import initialize_main_variables
from shared.functional import validate_input, REJECT_UNSET
from shared.gridstat import GridStat
from shared.sandbox import load_sandbox_db, save_sandbox_db
import shared.returnvalues as returnvalues


def signature():
    """Signature of the main function"""

    defaults = {
        'username': REJECT_UNSET,
        'password': REJECT_UNSET,
        'newuser': ['off'],
        'expert': ['false'],
        }
    return ['html_form', defaults]


def print_hd_selection():
    """Returns html section where a user chooses disc space"""

    html = \
        """<tr><td>How much disc space can 
    you allow the sandbox to use?</td>
    <td><select name='hd_size'>
    <option value='100'>100 MB</option>
    <option value='1000'>1 GB</option>
    <option value='2000'>2 GB</option>
    </select>
    </td></tr>"""
    return html


def print_net_selection():
    """Returns html section where a user chooses max download and upload speed"""

    html = \
        """<tr><td>What is the max download/upload bandwidth in kB/s
    you will allow the sandbox to use?</td>
    <td><select name='net_bw'>
    <option value='0'>No limit</option>
    <option value='2048'>2048/1024</option>
    <option value='1024'>1024/512</option>
    <option value='512'>512/256</option>
    <option value='256' selected>256/128</option>
    <option value='128'>128/64</option>
    </select>
    </td></tr>"""
    return html


def print_mem_selection():
    """Prints html section where a user amount of physical memory"""

    html = \
        """<tr><td>How much physical memory
          does your PC have?</td>
    <td><select name='memory'>
    <option value='256'>256 MB</option>
    <option value='512' selected>512 MB</option>
    <option value='1024'>1 GB</option>
    <option value='2048'>2 GB</option>
    <option value='4096'>4 GB</option>
    </select></td></tr>"""
    return html


def print_os_selection():
    """Prints html section where a user chooses which OS he uses"""

    html = \
        """<tr><td align='' colspan=''>Which operating system 
          are you using?</td>
    <td><select name='operating_system'>
    <option value='win'>Windows XP/Vista</option>
    <option value='linux'>Linux</option>
    </select></td></tr>"""
    return html


def print_windows_solution_selection():
    """Prints html section where a user chooses whether he wants
    the screensaver or the windows service model"""

    html = \
        """<tr><td>If Windows, do you want 
          the screensaver <break> or the service model? If unsure, choose screensaver</td>
    <td><select name='win_solution'>
    <option value='screensaver'>Screensaver</option>
    <option value='service'>Windows Service</option>
    </select></td></tr>"""
    return html


def print_expert_settings(display):
    """Prints html section where a user chooses whether he wants
    the advanced settings like image format and vgrid"""

    if display:
        html = \
            """<tr><td align='' colspan=''>Which kind of disk image would you like?</td>
    <td><select name='image_format'>
    <option value='qcow'>qcow</option>
    <option value='raw'>raw</option>
    </select></td></tr>
    <tr><td align='' colspan=''>Which VGrid do you want the sandbox to work for?</td>
    <td><select name='vgrid'>
    <option value='Generic'>Generic</option>
    </select></td></tr>
"""
    else:
        html = \
            """
             <input type=hidden name='image_format' value='qcow'>
             <input type='hidden' name='vgrid' value='Generic'>
"""

    return html


def count_jobs(resource_name):
    """Counts number of jobs executed by given resource"""

    # grid_stat.update()

    value = grid_stat.get_value(grid_stat.RESOURCE_TOTAL, resource_name, 'FINISHED')
    return value

def sum_walltime(resource_name):
    """Sum total walltime used by jobs executed by given resource"""

    # grid_stat.update()

    value = grid_stat.get_value(grid_stat.RESOURCE_TOTAL, resource_name, 'USED_WALLTIME')
    return value


def show_info(user, passwd, expert):
    """Shows info for given user"""

    # Resource Monitor Section

    html = \
        """<H1>Sandbox Administration and Monitor</H1>
    <table class=monitor>
    <tr class=title><td align='center' colspan='3'>
    Your SSS sandbox resources and their individual job statistics
    </td>
    </tr>
    <tr>
    <td align='center'>
    Resource
    </td>
    <td align='center'>
    Jobs
    </td>
    <td align='center'>
    Walltime
    </td>
    </tr>
    
    """

    for resource in userdb[user][RESOURCES]:

        # now find number of jobs successfully executed by resource

        jobs = count_jobs(resource)
        walltime = sum_walltime(resource)
        html += \
            """<tr>
<td align='center'>%s</td>
<td align='center'>%s</td>
<td align='center'>%s</td>
</tr>"""\
             % (resource, jobs, walltime)
    if len(userdb[user][RESOURCES]) == 0:
        html += \
            """<tr><td align='center'>You haven't downloaded any
              sandbox resources yet</td></tr>"""
    html += """
    </table>
    <br>"""

    # Download sandbox section

    html += \
        """<form action='ssscreateimg.py?MiG-SSS.zip' 
          method='POST'>
    <table class=sandboxcreateimg>
    <tr class=title><td align='center' colspan='2'>
    Download new sandbox
    </td></tr>"""

    html += print_hd_selection()
    html += print_mem_selection()
    html += print_net_selection()
    html += print_os_selection()
    html += print_windows_solution_selection()
    html += print_expert_settings(expert)

    html += \
        """<tr><td>
    <input type='hidden' name='username' value='%s'>
"""\
         % user
    html += """</td></tr>
        """
    html += \
        """<tr><td>Press 'Submit' to download - please note that it 
          may<br> take up to 2 minutes to generate your sandbox</td>
          <td align='center'><input type='SUBMIT' value='Submit'>
          </form>
          </td></tr>

    </table>
    <br>
    <table class=sandboxadmin>
    <tr><td align='center'>
    Advanced users may want to fine tune the sandbox to download by switching to expert mode:
    <form action='sssadmin.py' method='POST'>
    <input type='hidden' name='username' value='%s'>
    <input type='hidden' name='password' value='%s'>
    <input type='hidden' name='expert' value='%s'>
    <input type='submit' value='Toggle expert mode'>
    </form>
    </td></tr>    
    <tr><td align='center'>
    <br>
    </td></tr>    
    <tr><td align='center'>
    If you run into any problems, please contact the MiG administrators (%s)
    </td></tr>
    </table> 
    """\
         % (user, passwd, not expert, admin_email.replace('<', '&lt;'
            ).replace('>', '&gt;'))
    return html


def main(client_id, user_arguments_dict):
    """Main function used by front end"""

    (configuration, logger, output_objects, _) = \
        initialize_main_variables(op_header=False,
                                  op_menu=client_id)

    defaults = signature()[1]
    (validate_status, accepted) = validate_input(user_arguments_dict,
            defaults, output_objects, allow_rejects=False)
    if not validate_status:
        output_objects.append({'object_type': 'link', 'destination'
                              : '/cgi-sid/ssslogin.py', 'text'
                              : 'Retry login'})
        return (accepted, returnvalues.CLIENT_ERROR)
    username = accepted['username'][-1].strip()
    password = accepted['password'][-1].strip()
    newuser = accepted['newuser'][-1].strip()
    expert_string = accepted['expert'][-1].strip()
    expert = False
    if 'true' == expert_string.lower():
        expert = True

    PW = 0
    global RESOURCES
    RESOURCES = 1

    global userdb

    # Load the user DB

    try:
        userdb = load_sandbox_db(configuration)
    except IOError:

        # First time - create empty dict

        userdb = {}
    except Exception, exc:
        output_objects.append({'object_type': 'error_text', 'text'
                              : 'Could not read sandbox database! %s'
                               % exc})
        return (output_objects, returnvalues.SYSTEM_ERROR)

    global admin_email
    admin_email = configuration.admin_email
    global grid_stat
    grid_stat = GridStat(configuration, logger)

    # If it's a new user, check that the username is free

    if newuser == 'on':
        if userdb.has_key(username):
            output_objects.append({'object_type': 'error_text', 'text'
                                  : 'Username is already taken - please go back and choose another one...'
                                  })
            output_objects.append({'object_type': 'link', 'destination'
                                  : '/cgi-sid/ssslogin.py', 'text'
                                  : 'Retry login'})
            return (output_objects, returnvalues.CLIENT_ERROR)
        elif len(username) < 3:

            # print "<a href='ssslogin.py'>Back</a>"

            output_objects.append({'object_type': 'error_text', 'text'
                                  : 'Please choose a username with 3 or more characters.'
                                  })
            output_objects.append({'object_type': 'link', 'destination'
                                  : '/cgi-sid/ssslogin.py', 'text'
                                  : 'Retry login'})
            return (output_objects, returnvalues.CLIENT_ERROR)
        else:

            # print "<a href='ssslogin.py'>Back</a>"
            # Create new user with empty resource list

            try:
                newuser = {username: (password, [])}
                userdb.update(newuser)
                save_sandbox_db(userdb, configuration)
            except Exception, exc:
                output_objects.append({'object_type': 'error_text',
                        'text'
                        : 'Could not save you in the user database! %s'
                         % exc})
                return (output_objects, returnvalues.SYSTEM_ERROR)
            output_objects.append({'object_type': 'html_form', 'text'
                                  : show_info(username, password,
                                  expert)})
    else:

    # Otherwise, check that username and password are correct

        if not userdb.has_key(username):
            output_objects.append({'object_type': 'error_text', 'text'
                                  : 'Wrong username - please go back and try again...'
                                  })
            output_objects.append({'object_type': 'link', 'destination'
                                  : '/cgi-sid/ssslogin.py', 'text'
                                  : 'Retry login'})
            return (output_objects, returnvalues.CLIENT_ERROR)
        elif userdb[username][PW] != password:

            # print "<a href='ssslogin.py'>Back</a>"....

            output_objects.append({'object_type': 'error_text', 'text'
                                  : 'Wrong password - please go back and try again...'
                                  })
            output_objects.append({'object_type': 'link', 'destination'
                                  : '/cgi-sid/ssslogin.py', 'text'
                                  : 'Retry login'})
            return (output_objects, returnvalues.CLIENT_ERROR)
        else:

            # print "<a href='ssslogin.py'>Back</a>"....

            output_objects.append({'object_type': 'html_form', 'text'
                                  : show_info(username, password,
                                  expert)})
    output_objects.append({'object_type': 'text', 'text': ''})
    return (output_objects, returnvalues.OK)


