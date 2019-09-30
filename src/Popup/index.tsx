/**
 * @file index.tsx
 * @author 周启航
 * @email zhouqh@jointwisdom.cn
 * @time 2019-09-29 15:34:10
 * @description Popup，用于渲染弹出层
 */
import React, { Component, CSSProperties } from 'react';
import classnames from 'classnames';
import Portal from '../Portal';
import './index.css'

const prefix = 'popup';
interface IPopupProps {
    className?: string;
    style?: CSSProperties;
    mask?: boolean;
    maskCloseable?: boolean;
}
class Popup extends Component<IPopupProps> {
    render() {
        const { className, style, children, mask } = this.props;
        return (
            <Portal>
                <div
                    className={classnames(
                        prefix,
                        className
                    )}
                >
                    {mask && <div className={prefix + '-mask'} />}
                    <div style={style} className={prefix + '-container'}>{children}</div>
                </div>
            </Portal>
        )
    }
}

export default Popup;