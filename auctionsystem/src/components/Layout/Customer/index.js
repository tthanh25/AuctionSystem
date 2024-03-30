import Header from "./Header";
import styles from "./Customer.module.scss"
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

function CustomerLayout({children}) {
    return (
        <div className={cx('wrapper')}>
            <Header/>
                <div className= {cx('container')}>
                    <div className={cx('content')}>
                        {children}
                    </div>
                </div>
        </div>
    )
}

export default CustomerLayout;