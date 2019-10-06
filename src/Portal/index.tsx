/**
 * @file index.tsx
 * @author zhouqihang
 * @email qihang_zhou@qq.com
 * @time 2019-09-29 14:44:35
 * @description Portal，用于将（弹出层）组件挂载到DOM中，同时保持上下文一致性
 */
import { createPortal } from 'react-dom'
import React, { Component, CSSProperties } from 'react';
import classnames from 'classnames';

const prefix = 'portal';
interface IPortalProps {
    className?: string;
    style?: CSSProperties;
    rootElement?: Element;
}
class Portal extends Component<IPortalProps> {
    static defaultProps = {
        rootElement: window.document.body,
    }

    render() {
        return createPortal(this.props.children, this.props.rootElement as Element);
    }
}

export default Portal;