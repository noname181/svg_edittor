import React from 'react';
import './Notification.scss';


const Notification = ({ notification, setNotification }) => {

  if (!notification.message) {
    return null
  }

  // type
  const type = notification.type || 'info'

  // timer
  if (notification.seconds) {
    setTimeout(() => {
      setNotification({ message: null, type: null, seconds: null })
    }, notification.seconds * 1000)
  }


  return (
    <div className={'notification ' + type}>
      {notification.message}
    </div>
  )

}


export default Notification