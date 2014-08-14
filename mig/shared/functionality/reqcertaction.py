#!/usr/bin/python
# -*- coding: utf-8 -*-
#
# --- BEGIN_HEADER ---
#
# reqcertaction - handle certificate requests and send email to admins
# Copyright (C) 2003-2014  The MiG Project lead by Brian Vinter
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

"""Request certificate action back end"""

import os
import time
import tempfile
import base64
import re

import shared.returnvalues as returnvalues
from shared.base import client_id_dir
from shared.defaults import cert_valid_days
from shared.functional import validate_input, REJECT_UNSET
from shared.handlers import correct_handler
from shared.init import initialize_main_variables, find_entry
from shared.notification import send_email
from shared.serial import dumps
from shared.useradm import fill_distinguished_name


def signature():
    """Signature of the main function"""

    defaults = {
        'cert_name': REJECT_UNSET,
        'org': REJECT_UNSET,
        'email': REJECT_UNSET,
        'country': REJECT_UNSET,
        'state': [''],
        'password': REJECT_UNSET,
        'verifypassword': REJECT_UNSET,
        'comment': [''],
        }
    return ['text', defaults]

def forced_org_email_match(org, email, configuration):
    """Check that email and organization follow the required policy"""

    logger = configuration.logger
    # Policy regexps: prioritized order with most general last
    force_org_email = [('DIKU', ['^[a-zA-Z0-9_.+-]+@diku.dk$',
                                 '^[a-zA-Z0-9_.+-]+@di.ku.dk$']),
                       ('NBI', ['^[a-zA-Z0-9_.+-]+@nbi.ku.dk$',
                               '^[a-zA-Z0-9_.+-]+@nbi.dk$',
                               '^[a-zA-Z0-9_.+-]+@fys.ku.dk$']),
                       ('IMF', ['^[a-zA-Z0-9_.+-]+@math.ku.dk$']),
                       ('DTU', ['^[a-zA-Z0-9_.+-]+@dtu.dk$']),
                       # Keep this KU catch-all last and do not generalize it!
                       ('KU', ['^[a-zA-Z0-9_.+-]+@alumni.ku.dk$']),
                       ]
    force_org_email_dict = dict(force_org_email)
    is_forced_email = False
    is_forced_org = False
    if org.upper() in force_org_email_dict.keys():
        is_forced_org = True
        # Consistent casing
        org = org.upper()
    email_hit = '__BOGUS__'
    for (forced_org, forced_email_list) in force_org_email:
        for forced_email in forced_email_list:
            if re.match(forced_email, email):
                is_forced_email = True
                email_hit = forced_email
                logger.debug('email match on %s vs %s' % (email, forced_email))
                break
            
        # Use first hit to avoid catch-all overriding specific hits
        if is_forced_email or is_forced_org and org == forced_org:
            break
    if is_forced_org != is_forced_email or \
           not email_hit in force_org_email_dict.get(org, ['__BOGUS__']):
        logger.error('Illegal email and organization combination: %s' % \
                     ([email, org, is_forced_org, is_forced_email, \
                       email_hit, force_org_email_dict.get(org,
                                                           ['__BOGUS__'])]))
        return False
    else:
        return True


def main(client_id, user_arguments_dict):
    """Main function used by front end"""

    (configuration, logger, output_objects, op_name) = \
        initialize_main_variables(client_id, op_header=False, op_menu=False)
    defaults = signature()[1]
    (validate_status, accepted) = validate_input(user_arguments_dict,
            defaults, output_objects, allow_rejects=False)
    if not validate_status:
        return (accepted, returnvalues.CLIENT_ERROR)

    if not correct_handler('POST'):
        output_objects.append(
            {'object_type': 'error_text', 'text'
             : 'Only accepting POST requests to prevent unintended updates'})
        return (output_objects, returnvalues.CLIENT_ERROR)

    title_entry = find_entry(output_objects, 'title')
    title_entry['text'] = '%s certificate request' % configuration.short_title
    title_entry['skipmenu'] = True
    output_objects.append({'object_type': 'header', 'text'
                          : '%s certificate request' % \
                            configuration.short_title 
                           })

    admin_email = configuration.admin_email
    smtp_server = configuration.smtp_server
    user_pending = os.path.abspath(configuration.user_pending)

    # force name to capitalized form (henrik karlsen -> Henrik Karlsen)

    cert_name = accepted['cert_name'][-1].strip().title()
    country = accepted['country'][-1].strip().upper()
    state = accepted['state'][-1].strip().title()
    org = accepted['org'][-1].strip()

    # lower case email address

    email = accepted['email'][-1].strip().lower()
    password = accepted['password'][-1]
    verifypassword = accepted['verifypassword'][-1]

    # keep comment to a single line

    comment = accepted['comment'][-1].replace('\n', '   ')

    # single quotes break command line format - remove

    comment = comment.replace("'", ' ')

    if password != verifypassword:
        output_objects.append({'object_type': 'error_text', 'text'
                              : 'Password and verify password are not identical!'
                              })
        return (output_objects, returnvalues.CLIENT_ERROR)

    # TODO: move this check to conf?

    if not forced_org_email_match(org, email, configuration):
        output_objects.append({'object_type': 'error_text', 'text'
                              : '''Illegal email and organization combination:
Please read and follow the instructions in red on the request page!
If you are a student with only a @*.ku.dk address please just use KU as
organization. As long as you state that you want the certificate for course
purposes in the comment field, you will be given access to the necessary
resources anyway.
'''})
        return (output_objects, returnvalues.CLIENT_ERROR)

    if cert_name.upper().find('DO NOT SEND') != -1:
        output_objects.append({'object_type': 'text', 'text'
                          : "Test request ignored!"})
        return (output_objects, returnvalues.OK)

    user_dict = {
        'full_name': cert_name,
        'organization': org,
        'state': state,
        'country': country,
        'email': email,
        'comment': comment,
        'password': base64.b64encode(password),
        'expire': int(time.time() + cert_valid_days * 24 * 60 * 60),
        'openid_names': [],
        }
    fill_distinguished_name(user_dict)
    user_id = user_dict['distinguished_name']
    add_names = []
    if configuration.user_openid_provider:
        add_names.append(client_id_dir(user_id))
        if configuration.user_openid_alias:
            add_names.append(user_dict[configuration.user_openid_alias])
        user_dict['openid_names'] += add_names
    req_path = None
    try:
        (os_fd, req_path) = tempfile.mkstemp(dir=user_pending)
        os.write(os_fd, dumps(user_dict))
        os.close(os_fd)
    except Exception, err:
        logger.error('Failed to write certificate request to %s: %s'
                      % (req_path, err))
        output_objects.append({'object_type': 'error_text', 'text'
                              : 'Request could not be sent to grid administrators. Please contact them manually on %s if this error persists.'
                               % admin_email})
        return (output_objects, returnvalues.SYSTEM_ERROR)

    logger.info('Wrote certificate request to %s' % req_path)
    tmp_id = req_path.replace(user_pending, '')
    user_dict['tmp_id'] = tmp_id

    mig_user = os.environ.get('USER', 'mig')
    command_cert_create = \
        """
on CA host (apu01.esci.nbi.dk):
sudo su - mig-ca
rsync %s@%s:mig/server/MiG-users.db ~/
./ca-scripts/createusercert.py -a '%s' -d ~/MiG-users.db -s '%s' -u '%s'"""\
         % (mig_user, configuration.server_fqdn,
            configuration.admin_email, configuration.server_fqdn,
            user_id)
    command_user_create = \
        """
As '%s' on %s:
cd ~/mig/server
./createuser.py -u '%s'"""\
         % (mig_user, configuration.server_fqdn, req_path)
    command_user_delete = \
        """
As '%s' user on %s:
cd ~/mig/server
./deleteuser.py -i '%s'"""\
         % (mig_user, configuration.server_fqdn, user_id)
    command_cert_revoke = \
        """
on CA host (apu01.esci.nbi.dk):
sudo su - mig-ca
./ca-scripts/revokeusercert.py -a '%s' -d ~/MiG-users.db -u '%s'"""\
         % (configuration.admin_email, user_id)

    user_dict['command_user_create'] = command_user_create
    user_dict['command_user_delete'] = command_user_delete
    user_dict['command_cert_create'] = command_cert_create
    user_dict['command_cert_revoke'] = command_cert_revoke
    user_dict['site'] = configuration.short_title
    user_dict['https_cert_url'] = configuration.migserver_https_cert_url
    email_header = '%s certificate request for %s' % \
                   (configuration.short_title, cert_name)
    email_msg = \
        """
Received a certificate request with certificate data
 * Full Name: %(full_name)s
 * Organization: %(organization)s
 * State: %(state)s
 * Country: %(country)s
 * Email: %(email)s
 * Comment: %(comment)s
 * Expire: %(expire)s

Command to create user on %(site)s server:
%(command_user_create)s

Command to create certificate:
%(command_cert_create)s

Finally add the user
%(distinguished_name)s
to any relevant VGrids on:
%(https_cert_url)s/cgi-bin/vgridadmin.py


--- If user must be denied access or deleted at some point ---

Remove the user from any relevant VGrids on:
%(https_cert_url)s/cgi-bin/vgridadmin.py

Command to revoke user certificate:
%(command_cert_revoke)s
You need to copy the resulting signed certificate revocation list (crl.pem)
to the web server(s) for the revocation to take effect.

Command to delete user again on %(site)s server:
%(command_user_delete)s

---

"""\
         % user_dict

    logger.info('Sending email: to: %s, header: %s, msg: %s, smtp_server: %s'
                 % (admin_email, email_header, email_msg, smtp_server))
    if not send_email(admin_email, email_header, email_msg, logger,
                      configuration):
        output_objects.append({'object_type': 'error_text', 'text'
                              : 'An error occured trying to send the email requesting the grid administrators to create a new certificate. Please email them (%s) manually and include the session ID: %s'
                               % (admin_email, tmp_id)})
        return (output_objects, returnvalues.SYSTEM_ERROR)

    output_objects.append(
        {'object_type': 'text', 'text'
         : """Request sent to grid administrators: Your certificate request
will be verified and handled as soon as possible, so please be patient. Once
handled an email will be sent to the account you have specified ('%s') with
further information. In case of inquiries about this request, please email
the grid administrators (%s) and include the session ID: %s"""
         % (email, configuration.admin_email, tmp_id)})
    return (output_objects, returnvalues.OK)
