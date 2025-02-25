import React, {memo} from "react";
import styles from "./index.module.css";

const Index = memo((props) => {
    const {
        direction,
        wrap,
        justify,
        alignItems,
        itemOrder,
        itemSelf,
        itemGrow,
        onClick,
        className,
        style,
        ...other
    } = props;

    let newStyle = {};
    if (direction) {
        newStyle["flexDirection"] = direction;
        newStyle["WebkitFlexDirection"] = direction;
    }
    if (wrap) {
        newStyle["flexWrap"] = wrap;
        newStyle["WebkitFlexWrap"] = wrap;
    }
    if (justify) {
        newStyle["justifyContent"] = justify;
        newStyle["WebkitJustifyContent"] = justify;
    }
    if (alignItems) {
        newStyle["alignItems"] = alignItems;
        newStyle["WebkitAlignItems"] = alignItems;
    }
    if (itemSelf) {
        newStyle["alignSelf"] = itemSelf;
        newStyle["WebkitAlignSelf"] = itemSelf;
    }
    if (itemOrder) {
        newStyle["order"] = itemOrder;
    }

    if (itemGrow) {
        newStyle["flexGrow"] = itemGrow;
        newStyle["WebkitFlexGrow"] = itemGrow;
    }

    let clazz = styles.flex;
    if (className) {
        clazz = clazz + " " + className;
    }

    return (
        <div
            {...other} className={clazz} style={{...newStyle, ...style}} onClick={onClick}>
            {props.children}
        </div>
    );
});
Index.displayName = 'FlexIndex';

const Flex = (props) => {
    return <Index {...props} />;
};
Flex.displayName = 'Flex';

export default Flex;
