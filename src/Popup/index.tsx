/**
 * @file index.tsx
 * @author zhouqihang
 * @email qihang_zhou@qq.com
 * @time 2019-09-29 15:34:10
 * @description Popup，用于渲染弹出层
 */
import React, { Component, CSSProperties, RefObject, createRef } from 'react';
import classnames from 'classnames';
import Portal from '../Portal';
import './index.css'

const prefix = 'popup';
export type GetPositionType = (containerEle: HTMLDivElement | null) => CSSProperties;
interface IPopupProps {
    maskClassName?: string;
    maskStyle?: CSSProperties;
    mask?: boolean;
    getPosition?: GetPositionType;
     // TODO
    maskCloseable?: boolean;
}
class Popup extends Component<IPopupProps> {
    private containerEle: RefObject<HTMLDivElement> = createRef();

    readonly state = {
        computedStyle: {}
    }

    componentDidMount() {
        const { getPosition } = this.props;
        const position = getPosition ? getPosition(this.containerEle.current) : {};
        this.setState({ computedStyle: position });
    }

    render() {
        const { maskClassName, maskStyle, children, mask } = this.props;
        const { computedStyle } = this.state;
        return (
            <Portal>
                <div
                    className={prefix}
                >
                    {mask && <div className={classnames(prefix + '-mask', maskClassName)} style={maskStyle} />}
                    <div style={Object.assign({}, computedStyle)} className={prefix + '-container'} ref={this.containerEle}>{children}</div>
                </div>
            </Portal>
        )
    }
}

export default Popup;