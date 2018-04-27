import React from 'react';
import { bar } from './bar.css';

const test = async () => {
  return 41;
};

test().then(x => console.log('async stuff', x));

export default () => <div className={bar}>bar</div>;
