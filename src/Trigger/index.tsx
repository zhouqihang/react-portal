/**
 * @file index.tsx
 * @author zhouqihang
 * @email qihang_zhou@qq.com
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
    visible?: boolean;
    defaultVisible?: boolean;
    onChange?: (visible: boolean) => void;
    // TODO
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

    static getDerivedStateFromProps = (nextProps: Readonly<ITriggerProps>, prevState: ITriggerProps) => {
        if ('visible' in nextProps) {
            return {
                visible: nextProps.visible
            }
        }
        return null;
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

        let v: boolean = !this.state.visible;
        if ('boolean' === typeof visible) {
            v = visible;
        }
        this.togglePopupVisible(v);

        this.props.onChange && this.props.onChange(v)
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
            childrenProps.onFocus = this.registerTriggerEvent('onFocus', true);
            childrenProps.onBlur = this.registerTriggerEvent('onBlur', false);
        }
        else if ('hover' === trigger) {
            childrenProps.onMouseEnter = this.registerTriggerEvent('onMouseEnter', true);
            childrenProps.onMouseLeave = this.registerTriggerEvent('onMouseLeave', false);
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