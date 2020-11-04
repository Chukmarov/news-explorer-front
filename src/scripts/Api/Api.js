export default class Api {
  constructor(baseUrl, key){
    this.baseUrl = baseUrl;
    // this.key = key;
  }

  apiErrorReturn(res){
    if (!res.ok) {
      console.log(`Ошибка ${res.status}`)
      return Promise.reject(res);
    }
    return res;
  }

  pushUserInfoToServer(obj) {
    return fetch(`${this.baseUrl}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: `${obj.userInfoName}`,
        email: `${obj.userInfoEmail}`,
        password: `${obj.userInfoPassword}`
      })
    })
    .then((res) => {
      if (!res.ok) {
        return Promise.reject(`Ошибка: ${res.status}`);
      }
      return res.json();
    })
  }

  enterToSite(obj){
    return fetch(`${this.baseUrl}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        email: `${obj.userInfoEmail}`,
        password: `${obj.userInfoPassword}`
      })
    })
    .then((res) =>{
      if (!res.ok) {
        return Promise.reject(`Ошибка: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
        // сохраняем токен
        localStorage.setItem('token', data.token);
    })
  }

  getInfoAboutMe(){
    return fetch(`${this.baseUrl}/users/me`, {
      method: 'GET',
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      credentials: 'include',
    })
    .then((res) =>{
      if (!res.ok) {
        return Promise.reject(`Ошибка: ${res.status}`);
      }
      return res.json();
    })
  }

  saveDeleteNewsClicker(event, el, baseUrl){
    if (!event.target.parentElement.previousElementSibling.checked){
      fetch(`${baseUrl}/articles`, {
        method: 'POST',
        headers: {
         'Authorization': `Bearer ${localStorage.getItem('token')}`,
         'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          keyword:`${el.dataset.keyword}`,
          title:`${el.dataset.title}`,
          text:`${el.dataset.text}`,
          date:`${el.dataset.date}`,
          source:`${el.dataset.source}`,
          link:`${el.dataset.link}`,
          image:`${el.dataset.image}`
        })
      })
      .then((res) =>{
        if (!res.ok) {
          return Promise.reject(`Ошибка: ${res.status}`);
        }
        return res.json();
      })
      .then((res) =>{
        event.target.parentElement.parentElement.setAttribute('data-_id', `${res.data._id}`);
      })
      .catch((err) =>{
        console.log(err);
        event.target.previousElementSibling.checked=false;
      })
    }else{

      fetch(`${baseUrl}/articles/${event.target.parentElement.parentElement.dataset._id}`, {
        method: 'DELETE',
        headers: {
         'Authorization': `Bearer ${localStorage.getItem('token')}`,
         'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
        })
      })
      .then((res) =>{
        if (!res.ok) {
          return Promise.reject(`Ошибка: ${res.status}`);
        }
        return res.json();
      })
      .then((res) =>{
        event.target.parentElement.parentElement.removeAttribute('data-_id');
        event.target.parentElement.parentElement.parentElement.remove();
      })
      .catch((err) =>{
        console.log(err);
        // if (!event.target.parentElement.previousElementSibling.checked){
        // event.target.previousElementSibling.checked=true;
        // }else{
        // event.target.previousElementSibling.checked=false;
        // }
      })
    }
  }

  getSavedNewsFromServer(){
    return fetch(`${this.baseUrl}/articles`, {
      method: 'GET',
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      credentials: 'include',
    })
    .then((res) =>{
      if (!res.ok) {
        return Promise.reject(`Ошибка: ${res.status}`);
      }
      return res.json();
    })
  }

}