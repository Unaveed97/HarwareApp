/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Login from './Components/Login/Login'
import SignUp from './Components/SignUp/Signup'
import Signup2 from './Components/SignUp/Signup2'

AppRegistry.registerComponent(appName, () => Signup2);
