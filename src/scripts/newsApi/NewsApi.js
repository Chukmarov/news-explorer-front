export default class newsApi {
  constructor(){
  }
  getNewsFromServer(keyWords){
    //выставляем даты
    const today = new Date();
    const todayDay = `${today.getFullYear()}-${today.getMonth() + 1 }-${today.getDate()}`;
    const oneWeekEarlier = `${today.getFullYear()}-${today.getMonth() + 1 }-${today.getDate() - 7 }`;
    //формируем запрос
    const url = 'https://nomoreparties.co/news/v2/everything?' +
    `q=${keyWords}&` +
    `from=${oneWeekEarlier}&`+
    `to=${todayDay}&`+
    'pageSize=100&'+
    'apiKey=41316fbc25a741c6a3b8e11a7a0513c0';

    const req = new Request(url);
    //отправка запроса
   return fetch(req)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      return res.articles;
    })
  }
}
