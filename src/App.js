import './App.css';
import React, { Component } from 'react';
import { BrowserRouter, 
	Route, 
	Switch,
} from 'react-router-dom';

import Main from './Main/Main';

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<div>
					{/* Routes */}
					<div>
						<Switch>							
							<Route exact path="/main" render={() => <Main name="LaBiblioteca" />} />
							<Route component={Main} />
						</Switch>
					</div>
				</div>
			</BrowserRouter>
		);
	}
}
export default App;