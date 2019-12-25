import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';

/** message utils
 *
 *  message.success('message')
 *  message.info('message')
 *  message.warn('message')
 *  message.error('message')
 */

interface MessageConfig {
    icon?: ReactNode;
    content: ReactNode;
}

const Notifications: React.FC = () => {
    return <div></div>;
};

class Message {
    private called = false;

    public newInstance() {
        if (this.called) {
            return false;
        }

        const div = document.createElement('div');
        this.called = true;

        // create container
        document.appendChild(div);
        // render components
        ReactDOM.render(<Notifications />, div);
    }
}

const message = new Message();

// function success(content: ReactNode) {
//     const message = new Message();
//     messge.newInstance();
//     message.show({
//         icon: 'success',
//         content: content,
//         duration: 3000,
//         placement: 'LeftTop',
//     });
// }
