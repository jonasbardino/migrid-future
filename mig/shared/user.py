#!/usr/bin/python
# -*- coding: utf-8 -*-
#
# --- BEGIN_HEADER ---
#
# user - helper functions for user related tasks
# Copyright (C) 2003-2020  The MiG Project lead by Brian Vinter
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

"""User related functions - especially for People interface"""
from __future__ import print_function
from __future__ import absolute_import

import base64
import dircache
import hashlib
import os
from urllib import urlencode

from mig.shared.base import client_dir_id, client_id_dir
from mig.shared.defaults import litmus_id
from mig.shared.settings import load_settings, load_profile


def anon_user_id(user_id):
    """Generates an anonymous but (practically) unique user ID for user with
    provided unique user_id. The anonymous ID is just a md5 hash of the
    user_id to keep ID relatively short.
    """
    anon_id = hashlib.md5(user_id).hexdigest()
    return anon_id


def list_users(configuration):
    """Return a list of all users by listing the user homes in user_home.
    Uses dircache for efficiency when used more than once per session.
    """
    users = []
    children = dircache.listdir(configuration.user_home)
    for name in children:
        path = os.path.join(configuration.user_home, name)

        # skip all files and dot dirs - they are _not_ users

        if os.path.islink(path) or not os.path.isdir(path):
            continue
        if name.startswith('.'):
            continue
        # We assume user IDs on the form /A=bla/B=bla/... here
        if not '=' in name:
            continue
        if name in [configuration.empty_job_name, litmus_id]:
            continue
        users.append(client_dir_id(name))
    return users


def anon_to_real_user_map(configuration):
    """Return a mapping from anonymous user names to real names"""
    anon_map = {}
    for name in list_users(configuration):
        anon_map[anon_user_id(name)] = name
    return anon_map


def real_to_anon_user_map(configuration):
    """Return a mapping from real user names to anonymous names"""
    user_map = {}
    for name in list_users(configuration):
        user_map[name] = anon_user_id(name)
    return user_map


def get_user_conf(user_id, configuration, include_meta=False):
    """Return user profile and settings"""
    conf = {}
    profile = load_profile(user_id, configuration, include_meta)
    if profile:
        conf.update(profile)
    settings = load_settings(user_id, configuration, include_meta)
    if settings:
        conf.update(settings)
    return conf


def user_gravatar_url(configuration, email, size, anon_img="/images/anonymous.png"):
    """Helper to provide URL to user porfile picture"""
    configuration.logger.info("build gravatar for %s" % email)
    anon_png_url = '%s/%s' % (configuration.migserver_http_url, anon_img)
    gravatar_query = {'s': size, 'd': anon_png_url}
    gravatar_url = 'https://www.gravatar.com/avatar/'
    gravatar_url += hashlib.md5(email.strip().lower()).hexdigest()
    gravatar_url += '?%s' % urlencode(gravatar_query)
    return gravatar_url


def inline_image(configuration, path):
    """Create inline image base64 string from file in path"""
    mime_type = os.path.splitext(path)[1].strip('.')
    data = 'data:image/%s;base64,' % mime_type
    try:
        img_fd = open(path)
        img_data = img_fd.read()
        img_fd.close()
    except Exception as exc:
        configuration.logger.error("viewuser: no such image: %s" % path)
        img_data = ''
    data += base64.b64encode(img_data)
    return data


if __name__ == "__main__":
    print("= Unit Testing =")
    from mig.shared.conf import get_configuration_object
    conf = get_configuration_object()
    print("== List Users =")
    all_users = list_users(conf)
    print("All users:\n%s" % '\n'.join(all_users))
    real_map = real_to_anon_user_map(conf)
    print("Real to anon user map:\n%s" % '\n'.join(["%s -> %s" % pair for pair
                                                    in real_map.items()]))
