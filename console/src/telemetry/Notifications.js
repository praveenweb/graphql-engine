import React from 'react';
import Notifications from 'react-notification-system-redux';
import { setNotificationShownInDB } from './Actions';

const onRemove = () => {
  return dispatch => {
    dispatch(setNotificationShownInDB());
  };
};

const showTelemetryNotification = () => {
  return dispatch => {
    dispatch(
      Notifications.show({
        position: 'tr',
        autoDismiss: 10,
        level: 'info',
        title: 'Telemetry',
        children: (
          <div>
            Help us improve Hasura! The console collects anonymized usage stats
            which allows us to keep improving Hasura at warp speed.
            <a
              href="https://hasura.io/docs/1.0/graphql/manual/guides/telemetry.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              {' '}
              Click here
            </a>{' '}
            to read more or to opt-out.
          </div>
        ),
        onRemove: () => dispatch(onRemove()),
      })
    );
  };
};

export { showTelemetryNotification };
