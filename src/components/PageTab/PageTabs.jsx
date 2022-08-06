import 'antd/es/tabs/style';
// import _Tabs from 'antd/es/tabs';
import { Tabs } from 'antd';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import React, { useReducer, useContext, useState, useEffect } from 'react';
import isEqual from 'lodash/isEqual';
import { ConsoleSqlOutlined } from '@ant-design/icons';

class TabNode extends React.Component {
    render() {
        const { connectDragSource, connectDropTarget, children } = this.props;

        return connectDragSource(connectDropTarget(children));
    }
}

const cardTarget = {
    drop(props, monitor) {
        const dragKey = monitor.getItem().index;
        const hoverKey = props.index;

        if (dragKey === hoverKey) {
            return;
        }

        props.moveTabNode(dragKey, hoverKey);
        monitor.getItem().index = hoverKey;
    }
};

const cardSource = {
    beginDrag(props) {
        return {
            id: props.id,
            index: props.index
        };
    }
};

const WrapTabNode = DropTarget('DND_NODE', cardTarget, (connect) => ({
    connectDropTarget: connect.dropTarget()
}))(
    DragSource('DND_NODE', cardSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }))(TabNode),
);

class DraggableTabs extends React.Component {
    state = {
        order: []
    };

    moveTabNode = (dragKey, hoverKey) => {
        const newOrder = this.state.order.slice();
        const { children } = this.props;

        React.Children.forEach(children, (c) => {
            if (newOrder.indexOf(c.key) === -1) {
                newOrder.push(c.key);
            }
        });

        const dragIndex = newOrder.indexOf(dragKey);
        const hoverIndex = newOrder.indexOf(hoverKey);

        newOrder.splice(dragIndex, 1);
        newOrder.splice(hoverIndex, 0, dragKey);

        this.setState({
            order: newOrder
        });
    };

    renderTabBar = (props, DefaultTabBar) => (
        <DefaultTabBar {...props}>
            {(node) => (
                <WrapTabNode key={node.key} index={node.key} moveTabNode={this.moveTabNode}>
                    {node}
                </WrapTabNode>
            )}
        </DefaultTabBar>
    );

    render() {
        const { order } = this.state;
        const { children } = this.props;

        const tabs = [];
        React.Children.forEach(children, (c) => {
            tabs.push(c);
        });

        const orderTabs = tabs.slice().sort((a, b) => {
            const orderA = order.indexOf(a.key);
            const orderB = order.indexOf(b.key);

            if (orderA !== -1 && orderB !== -1) {
                return orderA - orderB;
            }
            if (orderA !== -1) {
                return -1;
            }
            if (orderB !== -1) {
                return 1;
            }

            const ia = tabs.indexOf(a);
            const ib = tabs.indexOf(b);

            return ia - ib;
        });

        return (
            <DndProvider backend={HTML5Backend}>
                <Tabs renderTabBar={this.renderTabBar} {...this.props}>
                    {orderTabs}
                </Tabs>
            </DndProvider>
        );
    }
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }

    return obj;
}

function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly)
            symbols = symbols.filter(function (sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        keys.push.apply(keys, symbols);
    }

    return keys;
}

function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};

        if (i % 2) {
            ownKeys(Object(source), true).forEach(function (key) {
                _defineProperty(target, key, source[key]);
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
            ownKeys(Object(source)).forEach(function (key) {
                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
            });
        }
    }

    return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }

    return target;
}

function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};

    var target = _objectWithoutPropertiesLoose(source, excluded);

    var key, i;

    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

        for (i = 0; i < sourceSymbolKeys.length; i++) {
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }

    return target;
}

function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
    if (typeof Symbol !== 'undefined' && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === 'undefined' || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);

            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally {
        try {
            if (!_n && _i['return'] != null) _i['return']();
        } finally {
            if (_d) throw _e;
        }
    }

    return _arr;
}

function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
}

function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === 'string') return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === 'Object' && o.constructor) n = o.constructor.name;
    if (n === 'Map' || n === 'Set') return Array.from(o);
    if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
        return _arrayLikeToArray(o, minLen);
}

function _nonIterableSpread() {
    throw new TypeError(
        'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
    );
}

function _nonIterableRest() {
    throw new TypeError(
        'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
    );
}

function _slicedToArray(arr, i) {
    return (
        _arrayWithHoles(arr) ||
        _iterableToArrayLimit(arr, i) ||
        _unsupportedIterableToArray(arr, i) ||
        _nonIterableRest()
    );
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _toConsumableArray(arr) {
    return (
        _arrayWithoutHoles(arr) ||
        _iterableToArray(arr) ||
        _unsupportedIterableToArray(arr) ||
        _nonIterableSpread()
    );
}

var CONTEXT_ACTIONS;

(function (CONTEXT_ACTIONS) {
    CONTEXT_ACTIONS[(CONTEXT_ACTIONS['UPDATE_TABS'] = 0)] = 'UPDATE_TABS';
})(CONTEXT_ACTIONS || (CONTEXT_ACTIONS = {}));

var initialState = {
    tabs: [],
    dispatch: function dispatch() {}
};

function reducer(state, action) {
    var type = action.type,
        payload = action.payload;

    switch (type) {
        case CONTEXT_ACTIONS.UPDATE_TABS: {
            return _objectSpread2(
                _objectSpread2({}, state),
                {},
                {
                    tabs: payload
                },
            );
        }

        default:
            return state;
    }
}

var context = React.createContext(initialState);
// console.log(context)

function provider(props) {
    var children = props.children;
    // console.log(context)
    var _useReducer = useReducer(reducer, initialState),
        _useReducer2 = _slicedToArray(_useReducer, 2),
        state = _useReducer2[0],
        dispatch = _useReducer2[1];

    state.dispatch = dispatch;
    return React.createElement(
        context.Provider,
        {
            value: state
        },
        ' ',
        children,
        ' ',
    );
}

function isTabActive(tabKey, location) {
    return tabKey === location.pathname;
}
function isLocationChanged(prevLoca, currLoca) {
    var key = prevLoca.key,
        search = prevLoca.search,
        otherPrevloca = _objectWithoutProperties(prevLoca, ['key', 'search']);

    var currKey = currLoca.key,
        currSearch = currLoca.search,
        otherCurrloca = _objectWithoutProperties(currLoca, ['key', 'search']);

    if (otherPrevloca.query) {
        for (var _key in otherPrevloca.query) {
            otherPrevloca.query[_key] = otherPrevloca.query[_key].toString();
        }
    }

    if (otherCurrloca.query) {
        for (var _key2 in otherCurrloca.query) {
            otherCurrloca.query[_key2] = otherCurrloca.query[_key2].toString();
        }
    }

    return !isEqual(otherPrevloca, otherCurrloca);
}

function styleInject(css, ref) {
    if (ref === void 0) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') {
        return;
    }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
        if (head.firstChild) {
            head.insertBefore(style, head.firstChild);
        } else {
            head.appendChild(style);
        }
    } else {
        head.appendChild(style);
    }

    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
}

var css =
    '.ant-layout-content .ant-page-tabs {\n  margin-top: -24px;\n}\n.ant-layout-content .ant-page-tabs .ant-page-tab-list {\n  overflow: visible;\n}\n.ant-layout-content .ant-page-tabs .ant-page-tab-list > .ant-tabs-nav {\n  margin-bottom: 24px;\n}\n.ant-layout-content .ant-page-tabs .ant-page-tab-list > .ant-tabs-nav > .ant-tabs-nav-wrap {\n  margin-left: -24px;\n  margin-right: -24px;\n  background-color: #fff;\n}\n.ant-pro-basicLayout-content-disable-margin .ant-page-tabs {\n  margin-top: 0;\n}\n.ant-pro-basicLayout-content-disable-margin .ant-page-tabs .ant-page-tab-list > .ant-tabs-nav {\n  margin-bottom: unset;\n}\n.ant-pro-basicLayout-content-disable-margin .ant-page-tabs .ant-page-tab-list > .ant-tabs-nav > .ant-tabs-nav-wrap {\n  margin-left: 0;\n  margin-right: 0;\n}\n.ant-page-tabs .ant-tabs-nav {\n  background-color: #fff;\n}\n.index_contextMenu__GaY68 {\n  position: fixed;\n  display: none;\n  background-color: rgba(255, 255, 255, 0.98);\n  border: 1px solid #ccc;\n  list-style: none;\n  padding: 4px 0;\n  border-radius: 4px;\n  box-shadow: 0px 2px 6px 2px #ddd;\n}\n.index_contextMenu__GaY68 li {\n  padding: 8px 12px;\n  border-bottom: 1px solid #f0f2f5;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  transition: all 0.1s;\n}\n.index_contextMenu__GaY68 li:last-child {\n  border-bottom: none;\n}\n.index_contextMenu__GaY68 li:hover {\n  cursor: pointer;\n  background-color: #0170fe;\n  color: #fff;\n}\n.index_contextMenu__GaY68 li:active {\n  background-color: rgba(255, 255, 255, 0.6);\n  color: #000;\n}\n.index_show__HGFYh {\n  display: block;\n}\n.index_tabLabel__3YS8K {\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n}\n';
var styles = {
    contextMenu: 'index_contextMenu__GaY68',
    show: 'index_show__HGFYh',
    tabLabel: 'index_tabLabel__3YS8K'
};
styleInject(css);

var ContextMenu = function ContextMenu(props) {
    var tab = props.tab,
        position = props.position,
        history = props.history,
        handleTabClose = props.handleTabClose,
        menuLabels = props.menuLabels;
    var store = useContext(context);
    var tabs = store.tabs,
        dispatch = store.dispatch;
    var updateTabs = function updateTabs(newTabs) {
        dispatch({
            type: CONTEXT_ACTIONS.UPDATE_TABS,
            payload: newTabs
        });
    };

    var closeTab = function closeTab() {
        if (!tab) return;
        handleTabClose(tab.location.pathname, 'remove');
    };

    var closeRightTabs = function closeRightTabs() {
        if (!tab) return;
        var index = tabs.indexOf(tab);
        if (index < 0) return;
        history.push(tab.location);
        updateTabs(tabs.slice(0, index + 1));
    };

    var closeLeftTabs = function closeLeftTabs() {
        if (!tab) return;
        var index = tabs.indexOf(tab);

        console.log(tabs);
        console.log(index);
        // return;
        if (index < 0) return;
        history.push(tab.location);
        updateTabs(tabs.slice(index, tabs.length));
    };

    var closeAllTabs = function closeAllTabs() {
        history.push('/');
        updateTabs([]);
    };

    return React.createElement(
        'ul',
        {
            className: ''.concat(styles.contextMenu, ' ').concat(tab && styles.show),
            style: {
                left: position === null || position === void 0 ? void 0 : position.x,
                top: position === null || position === void 0 ? void 0 : position.y
            }
        },
        React.createElement(
            'li',
            {
                onClick: closeTab
            },
            (menuLabels === null || menuLabels === void 0 ? void 0 : menuLabels.closeTab) ||
                '关闭当前',
        ),
        React.createElement(
            'li',
            {
                onClick: closeRightTabs
            },
            (menuLabels === null || menuLabels === void 0 ? void 0 : menuLabels.closeRightTabs) ||
                '关闭右侧',
        ),
        React.createElement(
            'li',
            {
                onClick: closeLeftTabs
            },
            (menuLabels === null || menuLabels === void 0 ? void 0 : menuLabels.closeLeftTabs) ||
                '关闭左侧',
        ),
        React.createElement(
            'li',
            {
                onClick: closeAllTabs
            },
            (menuLabels === null || menuLabels === void 0 ? void 0 : menuLabels.closeAllTabs) ||
                '关闭所有',
        ),
    );
};

var TabPane = Tabs.TabPane;
/**
 * TabBar component placed on top of a page
 */

var TabBar = function TabBar(props) {
    // console.log(props)
    var _useState = useState(),
        _useState2 = _slicedToArray(_useState, 2),
        targetTab = _useState2[0],
        setTargetTab = _useState2[1];

    var _useState3 = useState(),
        _useState4 = _slicedToArray(_useState3, 2),
        position = _useState4[0],
        setPosition = _useState4[1];

    var store = useContext(context);
    var tabs = store.tabs,
        dispatch = store.dispatch;
    // console.log(tabs, '222222222222');
    var location = props.location,
        defaultChildren = props.defaultChildren,
        history = props.history,
        contextMenuLabels = props.contextMenuLabels;
    var isLocationInTab = tabs.some(function (tab) {
        return tab.location.pathname === location.pathname;
    });

    var handleTabChange = function handleTabChange(key) {
        var tab = tabs.find(function (t) {
            return t.location.pathname === key;
        });

        if (tab) {
            history.push(tab.location);
            window.scrollTo(0, 0);
        }
    };
    /**
     * Handle tab remove
     * @param tabKey Key of tab to be removed
     * @param action Name of action
     */

    var handleEdit = function handleEdit(tabKey, action) {
        if (action === 'remove') {
            var tabIndex = tabs.findIndex(function (tab) {
                return tab.location.pathname === tabKey;
            });
            if (tabIndex < 0) return;
            var nextActiveTab;

            if (isTabActive(tabKey, location)) {
                nextActiveTab = tabs[tabIndex + 1] ||
                    tabs[tabIndex - 1] || {
                    location: '/'
                };
            }

            if (nextActiveTab) {
                history.push(nextActiveTab.location);
            }

            var newTabs = _toConsumableArray(tabs);

            newTabs.splice(tabIndex, 1);
            dispatch({
                type: CONTEXT_ACTIONS.UPDATE_TABS,
                payload: newTabs
            });
        }
    };
    /**
     * Show context menu when right click tab menus
     */

    var handleContextMenu = function handleContextMenu(e, tab) {
        e.preventDefault();
        setTargetTab(tab);
        setPosition({
            x: e.clientX,
            y: e.clientY
        });
    };

    var attachEvents = function attachEvents() {
        function cleanTargetTab() {
            setTargetTab(undefined);
        }

        document.addEventListener('click', cleanTargetTab);
        return function () {
            document.removeEventListener('click', cleanTargetTab);
        };
    };

    useEffect(attachEvents, []);
    return (
        <div className="ant-page-tabs">
            <Tabs
                className="ant-page-tab-list"
                hideAdd
                type="editable-card"
                onChange={handleTabChange}
                onEdit={handleEdit}
                activeKey={location.pathname}
            >

                {tabs.map((tab, index) => (
                    <TabPane
                        tab={
                            <span
                                className={styles.tabLabel}
                                onContextMenu={(e) => handleContextMenu(e, tab)}
                            >
                                {tab.route.tabLocalName || tab.route.name}
                            </span>
                        }
                        closable={tabs.length > 1}
                        key={tab.location && tab.location.pathname}
                    >
                        {tab.children}
                    </TabPane>
                ))}

            </Tabs>
            {!isLocationInTab && defaultChildren}
            <ContextMenu tab={targetTab} position={position} history={history} handleTabClose={handleEdit} menuLabels={contextMenuLabels}/>
        </div>
    );
};

var TabLayout = function TabLayout(props) {
    var children = props.children,
        location = props.location,
        history = props.history,
        contextMenuLabels = props.contextMenuLabels;
    // console.log(props);
    return React.createElement(
        provider,
        null,
        <TabBar
            history={history}
            location={location}
            defaultChildren={children}
            contextMenuLabels={contextMenuLabels}
        />,
    );
};

var RouteWatcher = function RouteWatcher(props) {
    // console.log(props, '111111111111111111');
    var store = useContext(context);
    var tabs = store.tabs,
        dispatch = store.dispatch;
    var children = props.children,
        route = props.route,
        location = props.location;

    var updateTabs = function updateTabs() {
        var newTabs = _toConsumableArray(tabs);
        // console.log(newTabs)
        var exists = newTabs.find(function (t) {
            return t.route.path === route.path;
        });
        var tab = {
            route: route,
            location: location,
            children: children
        };
        // newTabs.push(tab)
        // console.log(exists)
        if (!exists) {
            newTabs.push(tab);
        } else {
            // if tab of same route alreay exists and location change, replace the old with the new one
            if (isLocationChanged(exists.location, location)) {
                newTabs.splice(newTabs.indexOf(exists), 1, tab);
            }
        }

        dispatch({
            type: CONTEXT_ACTIONS.UPDATE_TABS,
            payload: newTabs
        });
    };

    useEffect(updateTabs, []);
    return React.createElement(React.Fragment, null);
};

export { RouteWatcher, TabLayout };
