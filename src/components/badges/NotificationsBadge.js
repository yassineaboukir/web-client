import React, {useState} from 'react'
import {IconBell} from '../ui/Icons'
import Configuration from "../../Configuration";

export default function NotificationsBadge() {
    const [notifications, setNotifications] = useState([])

    const [showWindow, setShowWindow] = useState(false)
    const handleShowWindow = () => {
        setShowWindow(!showWindow)
        setTimeout(() => {
            setShowWindow(false)
        }, 60000)
    }

    try {
        const webSocketServer = new WebSocket(Configuration.wsEndpoint);

        webSocketServer.onopen = function (ev) {
            console.info("[open] Connection established");
            webSocketServer.send("jwt.token");
        };

        webSocketServer.onmessage = function (ev) {
            const data = JSON.parse(ev.data);
            setNotifications([...notifications, data]);
        }
        webSocketServer.onerror = function (err) {
            console.error(`[error] ${err.message}`);
        };

        webSocketServer.onclose = function (ev) {
            if (ev.wasClean) {
                console.error(`[close] Connection closed cleanly, code=${ev.code} reason=${ev.reason}`);
            } else {
                // e.g. server process killed or network down
                // ev.code is usually 1006 in this case
                console.error('[close] Connection died');
            }
        };
        // if(ws.readyState == WebSocket.CLOSED) this.connect();

        //webSocketServer.close();
    } catch (err) {
        console.error(err);
    }
    const styles = {
        button: {
            position: 'relative',
        }
    }

    return (<button style={styles.button} onClick={handleShowWindow} aria-label="Notifications">
            <IconBell styling={{margin: 0}}/>
            {notifications.length > 0 &&
            <div className='w-3 h-3 -m-1 bg-red-500 rounded-full absolute top-0 right-0 animate-pulse'></div>}
            {showWindow && <NotificationsWindow notifications={notifications}/>}
        </button>
    )
}

const NotificationsWindow = ({notifications}) => {
    const styles = {
        notificationWindow: {
            position: 'absolute',
            padding: 'var(--paddingBox)',
            borderRadius: 'var(--borderRadius)',
            backgroundColor: 'var(--black)',
            color: 'var(--text-color)',
            top: '40px',
            left: '-70px',
            right: 0,
            margin: 'auto',
            width: '180px',
            zIndex: 10,
            fontSize: 'var(--fontSizeXsmall'
        },

    }

    return <div style={styles.notificationWindow}>
        {notifications.length > 0 ?
            <ul>
                {notifications.map((notification, index) =>
                    <li key={index} className='flex justify-between items-center my-1'>
                        {notification.title}
                        <span className='text-red-500  rounded-full font-bold text-sm'>{notification.detail}</span>
                    </li>
                )}
            </ul>
            : <span>No notifications</span>}
    </div>
}
