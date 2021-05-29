import axios from 'axios';
export default axios.create({
    baseURL: 'https://react-quiz-73949-default-rtdb.firebaseio.com'
})