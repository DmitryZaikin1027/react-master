import React, { Component } from 'react';


import Home from './screens/Home';

import './styles/style.css';

export default class App extends Component {
	render() {
		return (
			<div style={{ height: "100%" }}>
				<Home />
			</div>

		);
	}
}
