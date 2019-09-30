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

const prefix = 'tooltip';

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

    private tooltipRef: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();

    private triggerRef: RefObject<HTMLElement> = createRef<HTMLElement>();

    getTransform = (rect: DOMRect) => {
        let [start, end = 'center'] = (this.props.position as string).split(' ');
        let direction = '';
        let offset = '';
        switch (start) {
            case 'bottom':
            case 'top':
                direction = 'X';
                break;
            default:
                direction = '';
        }
        switch (end) {
            case 'center':
                offset = `calc(-50% + ${rect.width / 2}px)`;
                break;
            case 'left':
                offset = '0px';
                break;
            case 'right':
                offset = `calc(-100% + ${rect.width}px)`;
                break;
            default:
                offset = '0';
                break;
        }
        return `translate${direction}(${offset})`;
    }

    getPopupPosition = () => {
        const triggerEle = this.triggerRef.current;
        if (!triggerEle) {
            return {};
        }
        const rect = triggerEle.getBoundingClientRect() as DOMRect;
        const position = this.props.position as PositionType;
        let style: CSSProperties = {};

        // compute position
        let [start, end = 'center'] = position.split(' ');
        style.left = rect.left;
        style.top = rect.top;
        if (start === 'top') {
            switch (end) {
                case 'center':
                    style.transform = `translate(calc(-50% + ${rect.width / 2}px), -100%)`;
                    break;
                case 'left':
                    style.transform = `translate(0, -100%)`;
                    break;
                case 'right':
                    style.transform = `translate(calc(-100% + ${rect.width}px), -100%)`;
                    break;
            }
        }
        else if (start === 'bottom') {
            switch (end) {
                case 'center':
                    style.transform = `translate(calc(-50% + ${rect.width / 2}px), ${rect.height}px)`;
                    break;
                case 'left':
                    style.transform = `translate(0, ${rect.height}px)`;
                    break;
                case 'right':
                    style.transform = `translate(calc(-100% + ${rect.width}px), ${rect.height}px)`;
                    break;
            }
        }
        else if (start === 'left') {
            switch (end) {
                case 'center':
                    style.transform = `translate(-100%, calc(-50% + ${rect.height / 2}px))`;
                    break;
                case 'top':
                    style.transform = `translate(-100%, 0)`;
                    break;
                case 'bottom':
                    style.transform = `translate(-100%, calc(-100% + ${rect.height}px))`;
                    break;
            }
        }
        else if (start === 'right') {
            switch (end) {
                case 'center':
                    style.transform = `translate(${rect.width}px, calc(-50% + ${rect.height / 2}px))`;
                    break;
                case 'top':
                    style.transform = `translate(${rect.width}px, 0)`;
                    break;
                case 'bottom':
                    style.transform = `translate(${rect.width}px, calc(-100% + ${rect.height}px))`;
                    break;
            }
        }
        console.log('--', rect, style);
        // TODO compute width and height
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
                ref={this.tooltipRef}
            >
                aasdfgasgasdaasdfgasgasdaasdfgasgasdaasdfgasgasd
            </div>
        )
    }

    renderTrigger = () => {
        const { children } = this.props;
        if (React.isValidElement(children)) {
            return React.cloneElement(children, {
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