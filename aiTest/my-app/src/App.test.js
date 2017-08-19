import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});


it('has state', function(){
	const app = new App();
	expect(app.state).toEqual({
		files: []
	})
})