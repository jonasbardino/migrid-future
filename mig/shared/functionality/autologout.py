#!/usr/bin/python
# -*- coding: utf-8 -*-

#
# --- BEGIN_HEADER ---
#
# autologout - auto-force-expire local login session
# Copyright (C) 2003-2018  The MiG Project lead by Brian Vinter
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

"""Automatic logout to force login session expiry"""

import os

import shared.returnvalues as returnvalues
from shared.defaults import csrf_field
from shared.functional import validate_input_and_cert
from shared.handlers import safe_handler, get_csrf_limit
from shared.httpsclient import extract_client_openid
from shared.init import initialize_main_variables
from shared.pwhash import make_csrf_token
from shared.useradm import expire_oid_sessions, find_oid_sessions
from shared.url import base32urldecode, csrf_operation


def signature():
    """Signature of the main function"""

    defaults = {'redirect_to': ['']}
    return ['text', defaults]


def main(client_id, user_arguments_dict, environ=None):
    """Main function used by front end"""

    if environ is None:
        environ = os.environ
    (configuration, logger, output_objects, op_name) = \
        initialize_main_variables(client_id, op_header=False,
                                  op_menu=False)
    defaults = signature()[1]
    (validate_status, accepted) = validate_input_and_cert(
        user_arguments_dict,
        defaults,
        output_objects,
        client_id,
        configuration,
        allow_rejects=False,
        )
    if not validate_status:
        return (accepted, returnvalues.CLIENT_ERROR)

    logger.debug('Accepted arguments: %s' % accepted)

    status = returnvalues.OK
    redirect_to = ''.join(accepted['redirect_to'])
    output_objects.append({'object_type': 'header',
                          'text': 'Auto logout'})
    (oid_db, identity) = extract_client_openid(configuration, environ,
            lookup_dn=False)
    logger.info('%s from %s with identity %s' % (op_name, client_id,
                identity))
    if client_id and client_id == identity:
        output_objects.append({'object_type': 'warning',
                              'text': \
            """You're accessing %s with a user certificate and should never
            end up at this auto logout page.
            Please refer to your browser and system documentation for details."""
                            % configuration.short_title})
        return (output_objects, status)

    output_objects.append({'object_type': 'html_form',
                           'text': '''<p class="spinner iconleftpad">
Auto log out first to avoid sign up problems ...
</p>'''})

    # OpenID requires logout on provider and in local mod-auth-openid database.
    # IMPORTANT: some browsers like Firefox may inadvertently renew the local
    # OpenID session while loading the resources for this page (in parallel).

    logger.info('expiring active sessions for %s in %s' % (identity,
                oid_db))
    (success, _) = expire_oid_sessions(configuration, oid_db, identity)
    logger.info('verifying no active sessions left for %s' % identity)
    (found, remaining) = find_oid_sessions(configuration, oid_db,
            identity)
    if success and found and not remaining:
        if redirect_to:
            try:
                (redircet_url, redirect_query_dict) = \
                    base32urldecode(configuration, redirect_to)
            except ValueError, exc:
                status = returnvalues.CLIENT_ERROR
                logger.error('base32urldecode failed: %s' % exc)
            if status == returnvalues.OK:

                # Validate redirect_query_dict query

                csrf_op = csrf_operation(configuration, redircet_url,
                        redirect_query_dict)
                if not safe_handler(
                    configuration,
                    'get',
                    csrf_op,
                    client_id,
                    get_csrf_limit(configuration),
                    redirect_query_dict,
                    ):
                    output_objects.append({'object_type': 'error_text',
                            'text': '''Only accepting
                            CSRF-filtered GET requests to prevent unintended redirects'''
                            })
                    status = returnvalues.CLIENT_ERROR
            if status == returnvalues.OK:

                # Generate HTML and submit redirect form

                csrf_limit = get_csrf_limit(configuration, environ)
                csrf_token = make_csrf_token(configuration, 'post',
                        op_name, client_id, csrf_limit)
                html = \
                    '''
                <form id='return_to_form' method='post' action='%s'>''' \
                    % redircet_url
                html += \
                    '''
                    <input type='hidden' name='%s' value='%s'>''' \
                    % (csrf_field, csrf_token)
                for key in redirect_query_dict.keys():
                    for value in redirect_query_dict[key]:
                        html += \
                            '''
                        <input type='hidden' name='%s' value='%s'>''' \
                            % (key, value)
                html += \
                    '''
                </form>
                <script type='text/javascript'>
                    document.getElementById('return_to_form').submit();
                </script>'''
                output_objects.append({'object_type': 'html_form',
                        'text': html})
        else:
            logger.error('redirect_to _NOT_ found')
    else:
        logger.error('remaining active sessions for %s: %s'
                     % (identity, remaining))
        status = returnvalues.CLIENT_ERROR

    if status == returnvalues.CLIENT_ERROR:
        output_objects.append({'object_type': 'error_text',
                              'text': 'Could not automatically log you out of %s!'
                               % configuration.short_title})

    return (output_objects, status)
