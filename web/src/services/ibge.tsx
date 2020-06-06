import React from 'react';
import axios from 'axios';

const Ibge = axios.create({
    baseURL: 'https://servicodados.ibge.gov.br/api/v1'
})

export default Ibge;