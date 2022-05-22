import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import './Navigator.scss';

class MenuGroup extends Component {

    render() {
        const { name, children, id } = this.props;
        return (
            // render title menu //
            <>
                <li className="active">
                    <a data-toggle="tab" href="#Home">
                        <i className="notika-icon notika-house" /> <FormattedMessage id={name} />
                    </a>

                </li>
                <li><a data-toggle="tab" href="#mailbox"><i class="notika-icon notika-mail"></i> Email</a>
                </li>


            </>


            // <li className="nav-item">
            //     <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target={'#' + id} aria-expanded="true"
            //         aria-controls="collapseTableUser">
            //         <i className="fas fa-fw fa-table"></i>
            //         <FormattedMessage id={name} />
            //     </a>
            //     <div id={id} className="collapse" aria-labelledby="headingTable" data-parent="#accordionSidebar">
            //         <div className="bg-white py-2 collapse-inner rounded">
            //             <h6 className="collapse-header">Tables</h6>
            //             {children}
            //         </div>
            //     </div>

            // </li>
        );
    }
}

class Menu extends Component {

    render() {
        const { name, active, link, children, onClick, hasSubMenu, onLinkClick } = this.props;
        return (
            // Render menu con // 
            <li className={"collapse-item menu" + (hasSubMenu ? " has-sub-menu" : "") + ("") + (active ? " active" : "")}>
                {hasSubMenu ? (
                    <Fragment>
                        <span
                            data-toggle="collapse"
                            className={"menu-link collapsed"}
                            onClick={onClick}
                            aria-expanded={"false"}
                        >
                            {/* <FormattedMessage id={name} /> */}
                            <div className="icon-right">
                                <i className={"far fa-angle-right"} />
                            </div>
                        </span>
                        <div>
                            <ul className="sub-menu-list list-unstyled">
                                {children}
                            </ul>
                        </div>
                    </Fragment>
                ) : (
                    <Link to={link} className="menu-link" onClick={onLinkClick}>
                        {/* <FormattedMessage id={name} /> */}
                    </Link>
                )}
            </li>
        );
    }
}

// Menu đa cấp //
class SubMenu extends Component {

    getItemClass = path => {
        return this.props.location.pathname === path ? "active" : "";
    };

    render() {
        const { name, link, onLinkClick } = this.props;
        return (
            <li className={"sub-menu " + this.getItemClass(link)}>
                <Link to={link} className="sub-menu-link" onClick={onLinkClick}>
                    {/* <FormattedMessage id={name} /> */}
                </Link>
            </li>
        );
    }
}

const MenuGroupWithRouter = withRouter(MenuGroup);
const MenuWithRouter = withRouter(Menu);
const SubMenuWithRouter = withRouter(SubMenu);

const withRouterInnerRef = (WrappedComponent) => {

    class InnerComponentWithRef extends React.Component {
        render() {
            const { forwardRef, ...rest } = this.props;
            return <WrappedComponent {...rest} ref={forwardRef} />;
        }
    }

    const ComponentWithRef = withRouter(InnerComponentWithRef, { withRef: true });

    return React.forwardRef((props, ref) => {
        return <ComponentWithRef {...props} forwardRef={ref} />;
    });
};

class Navigator extends Component {
    state = {
        expandedMenu: {}
    };

    toggle = (groupIndex, menuIndex) => {
        const expandedMenu = {};
        const needExpand = !(this.state.expandedMenu[groupIndex + '_' + menuIndex] === true);
        if (needExpand) {
            expandedMenu[groupIndex + '_' + menuIndex] = true;
        }

        this.setState({
            expandedMenu: expandedMenu
        });
    };

    isMenuHasSubMenuActive = (location, subMenus, link) => {
        if (subMenus) {
            if (subMenus.length === 0) {
                return false;
            }

            const currentPath = location.pathname;
            for (let i = 0; i < subMenus.length; i++) {
                const subMenu = subMenus[i];
                if (subMenu.link === currentPath) {
                    return true;
                }
            }
        }

        if (link) {
            return this.props.location.pathname === link;
        }

        return false;
    };

    checkActiveMenu = () => {
        const { menus, location } = this.props;
        outerLoop:
        for (let i = 0; i < menus.length; i++) {
            const group = menus[i];
            if (group.menus && group.menus.length > 0) {
                for (let j = 0; j < group.menus.length; j++) {
                    const menu = group.menus[j];
                    if (menu.subMenus && menu.subMenus.length > 0) {
                        if (this.isMenuHasSubMenuActive(location, menu.subMenus, null)) {
                            const key = i + '_' + j;
                            this.setState({
                                expandedMenu: {
                                    [key]: true
                                }
                            });
                            break outerLoop;
                        }
                    }
                }
            }
        }
    };

    componentDidMount() {
        this.checkActiveMenu();
    };

    // componentWillReceiveProps(nextProps, prevState) {
    //     const { location, setAccountMenuPath, setSettingMenuPath } = this.props;
    //     const { location: nextLocation } = nextProps;
    //     if (location !== nextLocation) {
    //         let pathname = nextLocation && nextLocation.pathname;
    //         if ((pathname.startsWith('/account/') || pathname.startsWith('/fds/account/'))) {
    //             setAccountMenuPath(pathname);
    //         }
    //         if (pathname.startsWith('/settings/')) {
    //             setSettingMenuPath(pathname);
    //         };
    //     };
    // };

    componentDidUpdate(prevProps, prevState) {
        const { location } = this.props;
        const { location: prevLocation } = prevProps;
        if (location !== prevLocation) {
            this.checkActiveMenu();
        };
    };

    render() {
        // Render động menu //
        const { menus, location, onLinkClick } = this.props;
        return (
            <Fragment>
                <ul className="nav nav-tabs notika-menu-wrap menu-it-icon-pro">
                    {
                        menus.map((group, groupIndex) => {
                            return (
                                <Fragment key={groupIndex}>
                                    <MenuGroupWithRouter name={group.name} id={group.id}>
                                        {group.menus ? (
                                            group.menus.map((menu, menuIndex) => {
                                                const isMenuHasSubMenuActive = this.isMenuHasSubMenuActive(location, menu.subMenus, menu.link);
                                                const isSubMenuOpen = this.state.expandedMenu[groupIndex + '_' + menuIndex] === true;
                                                return (
                                                    <MenuWithRouter
                                                        key={menuIndex}
                                                        active={isMenuHasSubMenuActive}
                                                        name={menu.name}
                                                        link={menu.link}
                                                        hasSubMenu={menu.subMenus}
                                                        isOpen={isSubMenuOpen}
                                                        onClick={() => this.toggle(groupIndex, menuIndex)}
                                                        onLinkClick={onLinkClick}
                                                    >
                                                        {menu.subMenus && menu.subMenus.map((subMenu, subMenuIndex) => (
                                                            <SubMenuWithRouter
                                                                key={subMenuIndex}
                                                                name={subMenu.name}
                                                                link={subMenu.link}
                                                                onClick={this.closeOtherExpand}
                                                                onLinkClick={onLinkClick}
                                                            />
                                                        ))}
                                                    </MenuWithRouter>
                                                );
                                            })
                                        ) : null}
                                    </MenuGroupWithRouter>
                                </Fragment>
                            );
                        })
                    }
                </ul>
                <div className="tab-content custom-menu-content">
                    <div id="Home" className="tab-pane in active notika-tab-menu-bg animated flipInX">
                        <ul className="notika-main-menu-dropdown">
                            <li><a href="index.html">Dashboard One</a>
                            </li>
                            <li><a href="index-2.html">Dashboard Two</a>
                            </li>
                            <li><a href="index-3.html">Dashboard Three</a>
                            </li>
                            <li><a href="index-4.html">Dashboard Four</a>
                            </li>
                            <li><a href="analytics.html">Analytics</a>
                            </li>
                            <li><a href="widgets.html">Widgets</a>
                            </li>
                        </ul>
                    </div>
                    <div id="mailbox" class="tab-pane notika-tab-menu-bg animated flipInX">
                        <ul class="notika-main-menu-dropdown">
                            <li><a href="inbox.html">Inbox</a>
                            </li>
                            <li><a href="view-email.html">View Email</a>
                            </li>
                            <li><a href="compose-email.html">Compose Email</a>
                            </li>
                        </ul>
                    </div>
                </div>

            </Fragment>
        );
    }
}

// const mapStateToProps = state => {
//     return {
//     };
// };

// const mapDispatchToProps = dispatch => {
//     return {
//     }
// }

export default withRouterInnerRef((Navigator));
