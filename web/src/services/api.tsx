import React from 'react';
import axios from 'axios';

const Api = axios.create({
    baseURL: 'http://192.168.0.4:3333'
});

export default Api;