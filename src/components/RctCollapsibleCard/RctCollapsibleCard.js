/**
 * Rct Collapsible Card
 */
import React, { Component, Fragment } from 'react';
import { Collapse, Badge } from 'reactstrap';
import classnames from 'classnames';

// rct section loader
import RctSectionLoader from '../RctSectionLoader/RctSectionLoader';

class RctCollapsibleCard extends Component {

	state = {
		reload: false,
		collapse: true,
		close: false
	}

	onCollapse(e) {
		e.preventDefault();
		this.setState({ collapse: !this.state.collapse });
	}

	onReload(e) {
		e.preventDefault();
		this.setState({ reload: true });
		let self = this;
		setTimeout(() => {
			self.setState({ reload: false });
		}, 500);
	}

	onCloseSection(e) {
		e.preventDefault();
		this.setState({ close: true });
	}

	render() {
		const { close, reload, collapse } = this.state;
		const { children, collapsible, closeable, reloadable, heading, fullBlock, colClasses, customClasses, headingCustomClasses, contentCustomClasses, badge } = this.props;
		return (
			<div className={classnames(colClasses ? colClasses : '', { 'd-block': !collapse })}>
				<div className={classnames(`rct-block ${customClasses ? customClasses : ''}`, { 'd-none': close })}>
					{heading &&
						<div className={`rct-block-title ${headingCustomClasses ? headingCustomClasses : ''}`}>
							<h4>{heading} {badge && <Badge className="p-1 ml-10" color={badge.class}>{badge.name}</Badge>}</h4>
							{(collapsible || reloadable || closeable) &&
								<div className="contextual-link">
									{collapsible && <a href="#" onClick={(e) => this.onCollapse(e)}><i className="ti-minus"></i></a>}
									{reloadable && <a href="#" onClick={(e) => this.onReload(e)}><i className="ti-reload"></i></a>}
									{closeable && <a href="#" onClick={(e) => this.onCloseSection(e)}><i className="ti-close"></i></a>}
								</div>
							}
						</div>
					}
					<Collapse isOpen={collapse}>
						<div className={classnames(contentCustomClasses ? contentCustomClasses : '', { "rct-block-content": !fullBlock, 'rct-full-block': fullBlock })}>
							{children}
						</div>
					</Collapse>
					{reload && <RctSectionLoader />}
				</div>
			</div>
		);
	}
}

export default RctCollapsibleCard;
