/**
 * @file index.tsx
 * @author 周启航
 * @email zhouqh@jointwisdom.cn
 * @time 2019-09-29 13:52:06
 * @description Trigger,弹出层组件最外层调用
 */
import React, { Component, CSSProperties, ReactHTMLElement, ReactElement, RefObject } from 'react';
import classnames from 'classnames';
import Popup, { GetPositionType } from '../Popup';

const prefix = 'trigger';
const TRIGGERS_ARR = ['click', 'focus', 'hover'];
export type TriggerType = 'click' | 'focus' | 'hover';


interface ITriggerProps {
    className?: string;
    style?: CSSProperties;
    trigger?: TriggerType;
    popupContent?: React.ReactNode;
    getPopupPosition: GetPositionType;
    // TODO
    visible?: boolean;
    defaultVisible?: boolean;
    popupClassName?: string;
    popupStyle?: CSSProperties;
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

    /**
     * register event for children element
     * if they already has an event
     * the func will be called
     * 
     * @param eventName register event name eg: onClick, onFocus...
     * @param visible popup visible, if undefined, it will be opposite
     * @return {function} react event function
     */
    registerTriggerEvent = (eventName: string, visible?: boolean) => (e: ReactHTMLElement<any>) => {
        const { children } = this.props;

        if (children && (children as ReactElement).props[eventName]) {
            (children as ReactElement).props[eventName](e);
        }

        if ('boolean' === typeof visible) {
            this.togglePopupVisible(visible);
        }
        else {
            this.togglePopupVisible(!this.state.visible);
        }
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
        // const popupPosition = getPopupPosition();
        return (
            <Popup
                key="popup"
                getPosition={getPopupPosition}
            >
                {popupContent}
            </Popup>
        )
    }

    render() {
        // TODO 监测点击关闭的时候，判断事件触发链中是否包含popUp内容，如果不包括，则可以直接退出
        const { className, style, children, trigger } = this.props;

        // get trigger element
        let triggerEle = null;
        const childrenProps: any = {
            key: 'trigger'
        };
        if ('click' === trigger) {
            childrenProps.onClick = this.registerTriggerEvent('onClick');
        }
        else if ('focus' === trigger) {
            childrenProps.onFocus = this.registerTriggerEvent('onFocus');
            childrenProps.onBlur = this.registerTriggerEvent('onBlur');
            // TODO onBlur
        }
        else if ('hover' === trigger) {
            childrenProps.onMouseEnter = this.registerTriggerEvent('onMouseEnter');
            childrenProps.onMouseLeave = this.registerTriggerEvent('onMouseLeave');
        }

        if (React.isValidElement(children)) {
            triggerEle = React.cloneElement<any>(children, childrenProps);
        }
        
        // get popup content
        let popupContent = this.renderPopupContent();

        return [triggerEle, popupContent];
    }
}

export default Trigger;