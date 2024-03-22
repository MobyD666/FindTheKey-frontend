import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'; // Import the router

import 'iframe-resizer/js/iframeResizer.contentWindow.js';


//import * as Resize from '../node_modules/iframe-resizer/js/iframeResizer.contentWindow.js';
//createApp(App).mount('#app')
createApp(App).use(router).mount('#app');
