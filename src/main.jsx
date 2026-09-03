import 'flatpickr/dist/themes/light.css';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import 'simplebar-react/dist/simplebar.min.css';
import '../src/assets/scss/app.scss';
import App from './App';
// import './server';
import store from './store';


ReactDOM.createRoot(document.getElementById('root')).render(
	<>
		<Provider store={store}>
			<App />
		</Provider>
	</>
);
