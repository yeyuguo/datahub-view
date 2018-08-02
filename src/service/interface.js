import request from '../common/request';

const { uniqId: projectUniqId } = window.context || {};

export async function getInterfaceList () {
  return request(`/api/interface?projectUniqId=${projectUniqId}`, 'GET');
};

export async function getOneInterface ({ uniqId }) {
  return request(`/api/interface/${uniqId}`, 'GET');
};

export async function createInterface ({ pathname, description, method = 'GET' }) {
  return request('/api/interface', 'POST', {
    projectUniqId,
    pathname,
    description,
    method,
  });
};

export async function updateInterface ({ uniqId, ...payload }) {
  const fileds = [
    'pathname', 'description', 'method',
    'currentScene', 'proxyConfig', 'contextConfig',
  ];
  const postData = {};
  for (const field of fileds) {
    if (payload[field]) postData[field] = payload[field];
  }
  return request(`/api/interface/${uniqId}`, 'PUT', postData);
};

export async function deleteInterface ({ uniqId }) {
  return request(`/api/interface/${uniqId}`, 'DELETE');
};