/**
 * @file index.tsx
 * @author 周启航
 * @email zhouqh@jointwisdom.cn
 * @time 2019-09-29 13:52:06
 * @description Trigger,弹出层组件最外层调用
 */
import React, { Component, CSSProperties, ReactHTMLElement, ReactElement, RefObject } from 'react';
import classnames from 'classnames';
import Popup from '../Popup';

const prefix = 'trigger';
const TRIGGERS_ARR = ['click', 'focus', 'hover'];
export type TriggerType = 'click' | 'focus' | 'hover';


interface ITriggerProps {
    className?: string;
    style?: CSSProperties;
    trigger?: TriggerType;
    popupContent?: React.ReactNode;
    defaultVisible?: boolean;
    getPopupPosition: () => CSSProperties;
}
interface ITriggerStates {
    visible: boolean;
}


class Trigger extends Component<ITriggerProps, ITriggerStates> {
    static defaultProps: Partial<ITriggerProps> = {
        trigger: 'hover',
        defaultVisible: false
    }

    constructor(props: ITriggerProps) {
        super(props);
        this.state = {
            visible: this.props.defaultVisible as boolean,
        }
    }

    togglePopupVisible = (visible: boolean) => {
        this.setState({ visible })
    }

    onClick = (e: ReactHTMLElement<any>) => {
        const { children } = this.props;

        // trigger element has regist click event,
        if (children && (children as ReactElement).props.onClick) {
            (children as ReactElement).props.onClick(e);
        }

        // TODO handle popup visible
        this.togglePopupVisible(!this.state.visible);
    }

    /**
     * render popup content
     */
    renderPopupContent = () => {
        const { visible } = this.state;
        if (!visible) {
            return null;
        }
        const { popupContent, getPopupPosition } = this.props;
        const popupPosition = getPopupPosition();
        return (
            <Popup
                key="popup"
                style={popupPosition}
            >
                {popupContent}
            </Popup>
        )
    }

    render() {
        // TODO 监测点击关闭的时候，判断事件触发链中是否包含popUp内容，如果不包括，则可以直接退出
        const { className, style, children } = this.props;

        // get trigger element
        let trigger = null;
        if (React.isValidElement(children)) {
            trigger = React.cloneElement(children, {
                key: 'trigger',
                // TODO 为元素挂载触发方法
                onClick: this.onClick
            });
        }
        
        // get popup content
        let popupContent = this.renderPopupContent();

        return [trigger, popupContent];
    }
}

export default Trigger;