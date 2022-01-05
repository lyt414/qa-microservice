import { check, sleep } from 'k6';
import http from 'k6/http';

// export let options = {
//   vus: 1000,
//   duration: '30s',
// }

// export default function() {
//   let questionId = Math.floor(Math.random() * 1000000) + 2000000;

//   let res = http.get(`http://localhost:5500/answers/${questionId}`);
//   check(res, {
//     "success": (r) => r.status == 200
//   });
//   sleep(1);
// }

export let options = {
  scenarios: {
    getQuestion: {
      executor: 'ramping-vus',
      exec: 'getQuestion',
      startVUs: 0,
      //Stress Testing
      stages: [
        { duration: '2m', target: 100 }, // below normal load
        { duration: '3m', target: 100 },
        { duration: '1m', target: 200 }, // normal load
        { duration: '3m', target: 200 },
        { duration: '1m', target: 300 }, // around the breaking point
        { duration: '3m', target: 400 },
        { duration: '1m', target: 500 }, // beyond the breaking point
        { duration: '3m', target: 400 },
        { duration: '4m', target: 0 }, // scale down. Recovery stage.
      ],
    },
    getAnswer: {
      executor: 'ramping-vus',
      exec: 'getAnswer',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 100 }, // below normal load
        { duration: '3m', target: 100 },
        { duration: '1m', target: 200 }, // normal load
        { duration: '3m', target: 200 },
        { duration: '1m', target: 300 }, // around the breaking point
        { duration: '3m', target: 400 },
        { duration: '1m', target: 500 }, // beyond the breaking point
        { duration: '3m', target: 400 },
        { duration: '4m', target: 0 }, // scale down. Recovery stage.
      ],
    },
  },

  thresholds: {
    http_req_failed: ['rate<=0.05'],
    load_generator_cpu_percent: ['value<=80'],
    load_generate_memory_used_percent: ['value<=80'],
    http_req_duration: ['p(95)<1500'],
  }
};

export function getQuestion() {
  let productId = Math.floor(Math.random() * 100000) + 900000;

  let res = http.get(`http://localhost:5500/questions?product_id=${productId}`);
  check(res, {
    "success": (r) => r.status == 200
  });
  sleep(1);
}


export function getAnswer() {
  let questionId = Math.floor(Math.random() * 1000000) + 2000000;

  let res = http.get(`http://localhost:5500/answers/${questionId}`);
  check(res, {
    "success": (r) => r.status == 200
  });
  sleep(1);
}