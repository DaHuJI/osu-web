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

import * as React from 'react';

interface PropsInterface {
  modifiers: [];
  user: User;
}

interface StateInterface {
  avatarLoaded: boolean;
  backgroundLoaded: boolean;
}

export class UserCard extends React.PureComponent<PropsInterface, StateInterface> {
  static defaultProps = {
    modifiers: [],
  };

  constructor(props: PropsInterface) {
    super(props);

    this.state = {
      avatarLoaded: false,
      backgroundLoaded: false,
    };
  }

  onAvatarLoad = () => {
    this.setState({ avatarLoaded: true });
  }

  onBackgroundLoad = () => {
    this.setState({ backgroundLoaded: true });
  }

  render() {
    const { user } = this.props;
    const details = this.isUserLoaded ?
      <div className='usercard__icons'>
        <div className='usercard__icon'>
          <a href={laroute.route('rankings', { mode: 'osu', type: 'performance', country: user.country_code })}>
            <FlagCountry country={ user.country }/>
          </a>
        </div>

        {
          user.is_supporter ?
          <div className='usercard__icon'>
            <a className='usercard__link-wrapper' href={laroute.route('support-the-game')}>
              <SupporterIcon smaller={true} />
            </a>
          </div> : null
        }

        <div className='usercard__icon'>
          <FriendButton userId={user.id} />
        </div>

        {
          currentUser != null ? // TODO: need to get blocks
          <div className='usercard__icon'>
            <a className='user-action-button user-action-button--message'
              href={laroute.route('messages.users.show', { user: user.id })}
              title={osu.trans('users.card.send_message')}
            >
              <i className='fas fa-envelope'></i>
            </a>
          </div> : null
        }
      </div> : null;

    let usercardCss = 'usercard';
    for (const modifier of this.props.modifiers) {
      usercardCss += ` usercard--${modifier}`;
    }

    return (
      <div className={usercardCss}>
        { this.renderBackground() }

        <div className='usercard__card'>
          <div className='usercard__card-content'>
            { this.renderAvatar() }

            <div className='usercard__metadata'>
              <div className='usercard__username'>{ user.username }</div>
              { details }
            </div>
          </div>
          <div className={`usercard__status-bar usercard__status-bar--${this.isUserLoaded && user.is_online ? 'online' : 'offline'}`}>
            <span className='far fa-fw fa-circle usercard__status-icon'></span>
            <span className='usercard__status-message' title='last visit'>
              {this.isUserLoaded && user.is_online ? osu.trans('users.status.online') : osu.trans('users.status.offline')}
            </span>
          </div>
        </div>
      </div>
    );
  }

  renderAvatar() {
    const { user } = this.props;
    let avatarSpaceCssClass = 'usercard__avatar-space';
    if (!this.state.avatarLoaded) {
      avatarSpaceCssClass += ' usercard__avatar-space--loading';
    }

    return (
      <div className={avatarSpaceCssClass}>
        <div className='usercard__avatar usercard__avatar--loader'>
          <div className='la-ball-clip-rotate'></div>
        </div>
        {
          this.isUserLoaded ? <img className='usercard__avatar usercard__avatar--main'
                                   onError={this.onAvatarLoad} // remove spinner if error
                                   onLoad={this.onAvatarLoad}
                                   src={user.avatar_url}
                              />
                            : null
        }
      </div>
    );
  }

  renderBackground() {
    const { user } = this.props;
    let background: React.ReactNode;
    let backgroundLink: React.ReactNode;

    if (user.cover && user.cover.url) {
      let backgroundCssClass = 'usercard__background';
      if (!this.state.backgroundLoaded) {
        backgroundCssClass += ' usercard__background--loading';
      }

      background =
        <React.Fragment>
          <img className={backgroundCssClass} onLoad={this.onBackgroundLoad} src={user.cover.url} />
          <div className='usercard__background-overlay'></div>
        </React.Fragment>;
    } else {
      background = <div className='usercard__background-overlay usercard__background-overlay--guest'></div>;
    }

    if (this.isUserLoaded) {
      backgroundLink =
        <a href={laroute.route('users.show', { user: user.id })}
           className='usercard__background-container'>
          {background}
        </a>;
    } else {
      backgroundLink = background;
    }

    return backgroundLink;
  }

  private get isUserLoaded() {
    return this.props.user.id > 0;
  }
}
