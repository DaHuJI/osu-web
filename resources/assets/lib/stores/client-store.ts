/**
 *    Copyright (c) ppy Pty Ltd <contact@ppy.sh>.
 *
 *    This file is part of osu!web. osu!web is distributed with the hope of
 *    attracting more community contributions to the core ecosystem of osu!.
 *
 *    osu!web is free software: you can redistribute it and/or modify
 *    it under the terms of the Affero GNU General Public License version 3
 *    as published by the Free Software Foundation.
 *
 *    osu!web is distributed WITHOUT ANY WARRANTY; without even the implied
 *    warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *    See the GNU Affero General Public License for more details.
 *
 *    You should have received a copy of the GNU Affero General Public License
 *    along with osu!web.  If not, see <http://www.gnu.org/licenses/>.
 */

import DispatcherAction from 'actions/dispatcher-action';
import { UserLoginAction, UserLogoutAction } from 'actions/user-login-actions';
import { action, observable } from 'mobx';
import { Client } from 'passport/client';
import Store from 'stores/store';

export default class ClientStore extends Store {
  @observable clients = new Map<number, Client>();

  @action
  async fetchAll() {
    const json = osu.parseJson('json-authorized-clients');
    for (const item of json) {
      let client = this.clients.get(item.id);
      if (client == null) {
        client = new Client(item);
        this.clients.set(client.id, client);
      }
    }
  }

  handleDispatchAction(dispatchedAction: DispatcherAction) {
    if (dispatchedAction instanceof UserLoginAction
      || dispatchedAction instanceof UserLogoutAction) {
      this.flushStore();
    }
  }

  @action
  private flushStore() {
    this.clients.clear();
  }
}
