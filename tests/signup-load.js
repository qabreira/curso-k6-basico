import http from 'k6/http'
import { sleep, check } from 'k6'

import uuid from './libs/uuid.js'

export const options = {
  stages: [
    { duration: '1m', target: 100 }, // Estágio de 1 minuto para colocar 100 usuários simultâneos
    { duration: '2m', target: 500 }, // Este estágio mantém os 100 usuários por 2 minutos
    { duration: '1m', target: 0 }, // Neste último estágio os usuário terão 1 minuto para sair
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% das requisições devem ter um tempo de resposta menor que 2s
    http_req_failed: ['rate<0.01'] // 1% das requisições podem ocorrer erro
  }
}

export default function () {
  const url = 'http://localhost:3333/signup'


  const payload = JSON.stringify({ email: `${uuid.v4().substring(24)}@qabreira.com.br`, password: 'pwd123' })

  const headers = {
    'headers': {
      'Content-type': 'application/json'
    }
  }

  const res = http.post(url, payload, headers)

  // console.log(res.body)

  check(res, {
    'status should be 201': (r) => r.status === 201
  })

  sleep(1);
}