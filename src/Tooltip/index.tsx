/**
 * @file index.tsx
 * @author 周启航
 * @email zhouqh@jointwisdom.cn
 * @time 2019-09-29 16:48:11
 * @description Tooltip
 */
import React, { Component, CSSProperties, RefObject, createRef } from 'react';
import Trigger from '../Trigger';
import classnames from 'classnames';
import './index.css'
import { findDOMNode } from 'react-dom';
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
}
class Tooltip extends Component<ITooltipProps> {
    static defaultProps: Partial<ITooltipProps> = {
        position: 'top',
    }

    private triggerRef: RefObject<HTMLElement> = createRef<HTMLElement>();

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
        const { className, style } = this.props;
        return (
            <div
                className={classnames(
                    prefix,
                    className
                )}
                style={style}
            >
                <div className={prefix + '-content'}>
                    this is a react tooltip component, this is a react tooltip component
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
        const { children } = this.props;
        return (
            <Trigger trigger="hover" popupContent={this.renderTooltip()} getPopupPosition={this.getPopupPosition} >
                {this.renderTrigger()}
            </Trigger>
        )
    }
}

export default Tooltip;