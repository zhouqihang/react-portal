/**
 * @file index.tsx
 * @author zhouqihang
 * @email qihang_zhou@qq.com
 * @time 2019-09-29 13:52:06
 * @description Trigger,弹出层组件最外层调用
 */
import React, { Component, ReactHTMLElement, ReactElement, RefObject, createRef } from 'react';
import Popup, { GetPositionType } from '../Popup';
import { findDOMNode } from 'react-dom';

const prefix = 'trigger';
const TRIGGERS_ARR = ['click', 'focus', 'hover'];
export type TriggerType = 'click' | 'focus' | 'hover';


interface ITriggerProps {
    trigger?: TriggerType;
    popupContent?: React.ReactNode;
    getPopupPosition: GetPositionType;
    visible?: boolean;
    defaultVisible?: boolean;
    onChange?: (visible: boolean) => void;
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

    /**
     * this timer is used for mouse event.
     */
    private timer: number | null = null;

    private popupRef: RefObject<any> = createRef();

    constructor(props: ITriggerProps) {
        super(props);
        this.state = {
            visible: this.props.defaultVisible as boolean,
        }
    }

    /**
     * clearTimeout, remove document event listener
     */
    componentWillUnmount() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        document.removeEventListener('click', this.handleDocumentClick);
    }

    /**
     * when click the screen
     * if click the trigger or popup, do nothing here
     * 
     */
    handleDocumentClick = (e: MouseEvent) => {
        if (this.props.trigger !== 'click') {
            return;
        }
        let node = e.target;
        let contains = false;
        const popupNode = findDOMNode(this.popupRef.current);
        const triggerNode = findDOMNode(this);
        while (node && (node as HTMLElement).parentNode) {
            if (node === popupNode || node === triggerNode) {
                contains = true;
                break;
            }
            node = (node as HTMLElement).parentNode;
        }
        if (!contains) {
            this.togglePopupVisible(false);
            this.props.onChange && this.props.onChange(false)
        }
    }

    togglePopupVisible = (visible: boolean) => {
        this.setState({ visible }, () => {
            // when trigger is click and visible is true, add the click event for document
            // this will hidden popup when click the screen(not the popup self)
            // when visible is false, remove the click event for document
            if ('click' !== this.props.trigger) {
                return;
            }
            if (true === visible) {
                document.addEventListener('click', this.handleDocumentClick)
            }
            else {
                document.removeEventListener('click', this.handleDocumentClick);
            }
        })
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
        if (this.timer) {
            clearTimeout(this.timer);
        }

        const { children } = this.props;

        if (children && (children as ReactElement).props[eventName]) {
            (children as ReactElement).props[eventName](e);
        }

        let v: boolean = !this.state.visible;
        if ('boolean' === typeof visible) {
            v = visible;
        }

        // timer will be clear when is already existed.
        // when the visible state is the same, nothing todo
        // else toggle the visible state
        // this worked when mouse is moved between tooltip trigger and tooltip popup
        if (this.state.visible === v) {
            return;
        }
        this.timer = window.setTimeout(() => {
            this.togglePopupVisible(v);
            this.props.onChange && this.props.onChange(v)
        }, 0);
    }

    /**
     * render popup content
     */
    renderPopupContent = () => {
        const { visible } = this.state;
        if (!visible) {
            return null;
        }
        const { popupContent, getPopupPosition, trigger } = this.props;
        let props: Record<string, any> = { ref: this.popupRef };
        if ('hover' === trigger) {
            props.onMouseEnter = this.registerTriggerEvent('onMouseEnter', true);
            props.onMouseLeave = this.registerTriggerEvent('onMouseLeave', false);
        }

        let element = null;
        if (React.isValidElement(popupContent)) {
            element = React.cloneElement<any>(popupContent, props)
        }
        return (
            <Popup
                key="popup"
                getPosition={getPopupPosition}
                ref="a"
            >
                {element}
            </Popup>
        )
    }

    render() {
        // TODO 监测点击关闭的时候，判断事件触发链中是否包含popUp内容，如果不包括，则可以直接退出
        const { children, trigger } = this.props;

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