import config from 'config';
import { authHeader } from '../helpers';
console.log(config.apiUrl);

export const userService = {
    login,
    logout,
    register,
    getAll,
    getById,
    getWalletData,
    update,
    delete: _delete
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    return fetch(`${config.apiUrl}/login`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // login successful if there's a jwt token in the response
            if (user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
            }

            return user;
        });
}

function logout() {
  const localStorageUser = localStorage.getItem('user');
  if (localStorageUser) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };
    localStorage.removeItem('user');
    return fetch(`${config.apiUrl}/logout`, requestOptions).then(handleResponse);
  }
}

function register(user) {
  console.log(config.apiUrl);
  const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
  };

  return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}

function getAll() {
  const requestOptions = {
      method: 'GET',
      headers: authHeader()
  };

  return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}


function getById(id) {
  const requestOptions = {
      method: 'GET',
      headers: authHeader()
  };

  return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);
}

function getWalletData({ id, from, to }) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };
  let where = '';
  if (from && to) {
    where = `?where[createdAt][gt]=${to}&&where[createdAt][lt]=${from}`
  }

  return fetch(`${config.apiUrl}/users/${id}/wallet${where}`, requestOptions).then(handleResponse);
}

function update(user) {
  const requestOptions = {
      method: 'PUT',
      headers: { ...authHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
  };

  return fetch(`${config.apiUrl}/users/${user.id}`, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  const requestOptions = {
      method: 'DELETE',
      headers: authHeader()
  };

  return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      // if (response.status === 401) {
      //   logout();
      //   location.reload(true);
      // }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}