import "../pages/style_saved-news.css";

import Api from './api/Api';
import Dom from "./dom/Dom";
import Utils from "./utils/Utils";

import{
  spinnerSection,
  resultsButton,
  resultsSection,
  noResultsSection,
  authorizationButtonHeader,
  headerMenu,
  resultsContainer,
  baseUrl,
  key,
  resultsHeaderSaved,
  resultsParagraph,
  } from "./constants/constants.js";

const pageFunctional = () => {
  let foundNews = [];
  let newsCounter = 2;
  const pageSwitch = "second";
  let keyWords =[];
  let uniqueKeyWords = new Set;
  let userInfo = {};

  const api = new Api(baseUrl, key);
  const dom =new Dom(
    headerMenu,
    authorizationButtonHeader,
    resultsContainer,
    spinnerSection,
    resultsSection,
    noResultsSection
  );
  const utils = new Utils();
  //отрисовка шапки сайта
  const headerPaint = () => {
    if (Boolean(localStorage.token)) {
      api.getInfoAboutMe()
        .then((res) => {
          //копируем данные пользователя в переменную
          for (let key in res.data) {
            userInfo[key] = res.data[key];
          }
          const savedNewsButtonForMembers = document.createElement('a');
          const exitButtonForMembers = document.createElement('a');
          dom.headerLoginChange(res.data, savedNewsButtonForMembers, exitButtonForMembers)
        })
        .then(() => {

          headerMenu.firstElementChild.classList.add('header__menu-item_black');
          headerMenu.firstElementChild.nextElementSibling.classList.add('header__menu-item_black');
          headerMenu.lastElementChild.classList.add('header__menu-item_black');
          headerMenu.lastElementChild.classList.add('header__menu-item_exit-black');
          document.querySelector('.header__menu-item-exit-icon').classList.add('header__menu-item-exit-icon_black');

          document.querySelector('.header__menu-item_exit-black').addEventListener('click', () => {
            localStorage.removeItem('token');
            location.href = '../index.html';
          })
        })
        .catch(err => console.log(err))
    } else {
      location.href = '../.';
    }
  }
  //отрисовка сохраненных статей
  const loadingSavedNews = () => {
    //полетел запрос на сервер
    api.getSavedNewsFromServer()
    //вернулся ответ с карточками
      .then(res => {
        //если ничего не пришло, останавливаем промис и прописываем информацию для пользователя
        if (res.data.length == 0) {
          dom.headerParagraphSavedPaint(userInfo, {}, {}, resultsHeaderSaved, {}, resultsParagraph)
          return
        }
        //если карточки пришли считаем кол-во уникальных ключевых слов
        res.data.forEach((item) => {
          uniqueKeyWords.add(item.keyword)
        });
        // считаем кол-во совпадений ключевых слов
        let newObj = {}
        //описываем функцию проверки кол-ва совпадений
        const uniqueKeyWordsWithNumbers = () => {
          uniqueKeyWords.forEach((value) => {
            let number = 0;
            let mainValue = value
            res.data.forEach((item) => {
              if (item.keyword == value) {
                number++
              }
            });
            //проверяем есть ли ключ в объекте, чтобы исключить дублирование и перезапись
            const index = (number) => {
              let i = 0;
              while (typeof newObj[`${number},${i}`] !== "undefined") {
                i++
              }
              return i;
            };
            //вызываем функцию проверки
            const startIndex = index(number);
            //записываем данные в объект с учетом индекса
            number = `${number},${startIndex}`;
            newObj[number] = value;
          })
          return newObj;
        }
        //вызываем функцию проверки кол-ва совпадений
        uniqueKeyWordsWithNumbers();
        // записываем данные в объект для передачи на отрисовку
        for (let key in res.data) {
          foundNews[key] = res.data[key];
        }
        //запускаем отрисовку статей
        dom.printSavedNews(res.data, newsCounter, api.saveDeleteNewsClicker, baseUrl, pageSwitch, utils.dateParse);
        //запускам отрисовку шапки
        dom.headerParagraphSavedPaint(userInfo, foundNews, uniqueKeyWords, resultsHeaderSaved, newObj, resultsParagraph)
      });
  }
  //подгрузка дополнительных карт к просмотру
  resultsButton.addEventListener('click', () => {
    dom.printAddNews(foundNews, newsCounter, keyWords, pageSwitch, resultsButton, utils.dateParse)
    newsCounter = newsCounter + 3;
  });

  headerPaint();
  loadingSavedNews();
  //отрисовка заголовка и ключевых слов


};

pageFunctional();
