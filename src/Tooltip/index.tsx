/**
 * @file index.tsx
 * @author zhouqihang
 * @email qihang_zhou@qq.com
 * @time 2019-09-29 16:48:11
 * @description Tooltip
 */
import React, { Component, CSSProperties, RefObject, createRef, ReactNode } from 'react';
import Trigger, { TriggerType } from '../Trigger';
import classnames from 'classnames';
import './index.css'
import { GetPositionType } from '../Popup';

/**
 * component classname prefix
 */
const prefix = 'tooltip';
/**
 * mini tooltip width
 */
const MIN_TOOLTIP_WIDTH = 35;

const POSITIONS = ['top', 'top left', 'top right', 'right', 'right top', 'right bottom', 'bottom', 'bottom left', 'bottom right', 'left', 'left top', 'left bottom'];
type PositionType = 'top' | 'top left' | 'top right' | 'right' | 'right top' | 'right bottom' | 'bottom' | 'bottom left' | 'bottom right' | 'left' | 'left top' | 'left bottom';
interface ITooltipProps {
    className?: string;
    style?: CSSProperties;
    position?: PositionType;
    trigger?: TriggerType;
    content?: ReactNode;
    visible?: boolean;
    defaultVisible?: boolean;
    onChange?: (visible: boolean) => void;
    // TODO
    tooltipClassName?: string;
    tooltipStyle?: CSSProperties;
}
interface ITooltipState {
    visible: boolean;
}
class Tooltip extends Component<ITooltipProps, ITooltipState> {
    static defaultProps: Partial<ITooltipProps> = {
        position: 'top',
        trigger: 'hover',
        defaultVisible: false,
    }

    static getDerivedStateFromProps = (nextProps: Readonly<ITooltipProps>) => {
        if ('visible' in nextProps) {
            return {
                visible: nextProps.visible
            }
        }
        return null;
    }

    private triggerRef: RefObject<HTMLElement> = createRef<HTMLElement>();

    constructor(props: ITooltipProps) {
        super(props);
        this.state = {
            visible: this.props.defaultVisible as boolean,
        }
    }

    handleTriggerVisible = (visible: boolean) => {
        if ('visible' in this.props) {
            if (!this.props.onChange) {
                console.warn('Tooltip: onChange must be given when passed visible prop')
            }
            else {
                this.props.onChange(visible);
            }
        }
        else {
            this.setState({ visible })
        }
    }

    getPopupPosition: GetPositionType = (containerEle) => {
        if (containerEle === null) {
            return {};
        }

        const triggerEle = this.triggerRef.current;
        if (!triggerEle) {
            return {};
        }

        const rect = triggerEle.getBoundingClientRect() as DOMRect;
        const bodyRect = document.body.getBoundingClientRect() as DOMRect;
        const position = this.props.position as PositionType;
        let style: CSSProperties = {};

        // compute position
        const CONTAINER_W = containerEle.offsetWidth;
        const CONTAINER_H = containerEle.offsetHeight;
        const BODY_X = bodyRect.x;
        const BODY_Y = bodyRect.y;
        const BODY_W = document.body.offsetWidth;
        const BODY_H = document.body.offsetHeight;
        const TRIGGER_X = rect.x;
        const TRIGGER_Y = rect.y;
        const TRIGGER_W = rect.width;
        const TRIGGER_H = rect.height;
        let [start, end = 'center'] = position.split(' ');

        if ('left' === start && TRIGGER_X < CONTAINER_W) {
            start = 'right';
        }
        else if ('right' === start && BODY_W - TRIGGER_X - TRIGGER_W < MIN_TOOLTIP_WIDTH) {
            start = 'left';
        }
        else if ('top' === start && CONTAINER_H > TRIGGER_Y + Math.abs(BODY_Y)) {
            start = 'bottom';
        }
        else if ('bottom' === start && BODY_H - TRIGGER_Y - Math.abs(BODY_Y) - TRIGGER_H < CONTAINER_H) {
            start = 'top';
        }

        // top and bottom has diff 'top'
        if ('top' === start || 'bottom' === start) {
            style.top = 'top' === start ? TRIGGER_Y - CONTAINER_H : TRIGGER_Y + TRIGGER_H;
            switch (end) {
                case 'center':
                    style.left = TRIGGER_X - (CONTAINER_W - TRIGGER_W) / 2;
                break;
                case 'left':
                    style.left = TRIGGER_X;
                break;
                case 'right':
                    style.left = TRIGGER_X - CONTAINER_W + TRIGGER_W;
                break;
            }
        }
        // left and bottom has diff 'left'
        else if ('left' === start || 'right' === start) {
            style.left = 'left' === start ? TRIGGER_X - CONTAINER_W : TRIGGER_X + TRIGGER_W;
            switch (end) {
                case 'center':
                    style.top = TRIGGER_Y - (CONTAINER_H - TRIGGER_H) / 2;
                break;
                case 'top':
                    style.top = TRIGGER_Y;
                break;
                case 'bottom':
                    style.top = TRIGGER_Y - CONTAINER_H + TRIGGER_H;
                break;
            }
        }
        // compute offset with body
        if (style.left) {
            style.left = (style.left as number) - BODY_X;
        }
        if (style.top) {
            style.top = (style.top as number) - BODY_Y;
        }

        return style;
    }

    renderTooltip = () => {
        const { className, style, content } = this.props;
        return (
            <div
                className={classnames(
                    prefix,
                    className
                )}
                style={style}
            >
                <div className={prefix + '-content'}>
                    {content}
                </div>
            </div>
        )
    }

    renderTrigger = () => {
        const { children } = this.props;
        if (React.isValidElement(children)) {
            return React.cloneElement<any>(children, {
                ref: this.triggerRef
            })
        }
        return null;
    }

    render() {
        const { trigger } = this.props;
        const { visible } = this.state;
        return (
            <Trigger
                visible={visible}
                trigger={trigger}
                popupContent={this.renderTooltip()}
                getPopupPosition={this.getPopupPosition}
                onChange={this.handleTriggerVisible}
            >
                {this.renderTrigger()}
            </Trigger>
        )
    }
}

export default Tooltip;