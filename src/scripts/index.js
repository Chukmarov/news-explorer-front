import "../pages/style.css";

import FormValidator from './validation/FormValidator';
import Api from './api/Api';
import Popup from "./popup/Popup";
import Dom from "./dom/Dom";
import NewsApi from "./newsApi/NewsApi";
import Utils from "./utils/Utils";

import{
headerCheckbox,
header,
inputLead,
spinnerSection,
resultsButton,
resultsSection,
noResultsSection,
authorizationButtonHeader,
authorizationButtonMobileMenu,
popupEnter,
popupEnterCloseButton,
popupEnterOpenBottomButton,
popupLogup,
popupLogupOpenButton,
popupLogupCloseButton,
popupButtonRegistration,
popupSuccess,
popupSuccessCloseButton,
popupEnterOpenBottomSuccess,
popupSpanName,
enterForm,
logupForm,
leadForm,
spanArr,
popupButtonEnter,
headerMenu,
resultsContainer,
baseUrl,
key,
} from "./constants/constants.js";

const pageFunctional = () => {

  let foundNews = [];
  let newsCounter = 2;
  const pageSwitch = "main";
  let keyWords = "";

  const enterFormValidator = new FormValidator(enterForm);
  const logupFormValidator = new FormValidator(logupForm);
  const api = new Api(baseUrl, key);
  const popup = new Popup(popupEnter, popupLogup, popupSuccess, popupSpanName);
  const dom =new Dom(
    headerMenu,
    authorizationButtonHeader,
    resultsContainer,
    spinnerSection,
    resultsSection,
    noResultsSection
  );
  const newsApi = new NewsApi();
  const utils = new Utils();
  //Закрытие popup окна об успешной регистрации через крестик
  popupSuccessCloseButton.addEventListener('click', (event) => {
    popup.close(event);
  });
  //Переключение popup окна об успешной регистрации на popup о входе на сайт
  popupEnterOpenBottomSuccess.addEventListener('click', (event) => {
    popup.close(event);
  });
  //переключение с идентификации на авторизацию
  popupEnterOpenBottomButton.addEventListener('click', (event)=>{
    popup.open(event);
  });

  //переключение с авторизации на идентификацию
  popupLogupOpenButton.addEventListener('click', (event)=>{
    popup.open(event);
  });

  //Слушатели на закрытие форм
  popupLogupCloseButton.addEventListener('click', (event) => {
    popup.close(event);
    logupFormValidator.validationMessageHide(spanArr);
    logupForm.reset();
    popupButtonRegistration.setAttribute('disabled','disabled');
  });
  popupEnterCloseButton.addEventListener('click', (event) => {
    popup.close(event);
    enterFormValidator.validationMessageHide(spanArr);
    enterForm.reset();
    popupButtonEnter.setAttribute('disabled','disabled');
  });

  //Слушатель на checkox главной формы
  headerCheckbox.addEventListener('click', () => {
    header.classList.toggle('header__black');
  });

  //слушатель на чекбокс мобильной формы
  authorizationButtonMobileMenu.addEventListener('click', (event)=>{
    popup.open(event);
    headerCheckbox.checked = false;
    header.classList.toggle('header__black');
  });

  authorizationButtonHeader.addEventListener('click', (event)=>{
    popup.open(event);
  });

  //слушатель на отправку формы регистрации на сервер
  logupForm.addEventListener('submit', (event) => {

    const obj = {
      userInfoName: document.getElementById('popup__input_type-name-logup-id').value,
      userInfoEmail: document.getElementById('popup__input_type_email-logup-id').value,
      userInfoPassword: document.getElementById('popup__input_type-password-logup-id').value
    };

    popupButtonRegistration.textContent = "Загрузка...";

    api.pushUserInfoToServer(obj)
      .then(() => {
        popup.successRegistration();
      })
      .then(()=>{
        logupForm.reset();
        popupButtonRegistration.setAttribute('disabled','disabled');
        popupSpanName.textContent = " ";
      })
      .catch((err) => {
        if(err.status == 409){
          popupSpanName.textContent = "Такой пользователь уже есть"
        }
      })
      .finally(()=>{
        popupButtonRegistration.textContent = "Зарегистрироваться";
      });

    event.preventDefault();
  });

  //процесс авторизации и перерисовка шапки формы
  enterForm.addEventListener('submit',(event)=>{

    const obj = {
      userInfoEmail: document.getElementById('popup__input_type_email-enter-id').value,
      userInfoPassword: document.getElementById('popup__input_type-password-enter-id').value
    };

    popupButtonEnter.textContent = "Загрузка...";

    api.enterToSite(obj)
    .then((res) => {
      api.getInfoAboutMe()
      .then((res)=>{
        const savedNewsButtonForMembers = document.createElement('a');
        const exitButtonForMembers = document.createElement('a');

        dom.headerLoginChange(res.data, savedNewsButtonForMembers, exitButtonForMembers);
      })
      .then(()=>{
        headerMenu.firstElementChild.classList.add('header__menu-item_white');
        headerMenu.firstElementChild.nextElementSibling.classList.add('header__menu-item_white');
        headerMenu.lastElementChild.classList.add('header__menu-item_white');
        headerMenu.lastElementChild.classList.add('header__menu-item_exit-white');
        document.querySelector('.header__menu-item-exit-icon').classList.add('header__menu-item-exit-icon_white');

        document.querySelector('.header__menu-item_exit-white').addEventListener('click',()=>{
          dom.headerLogoutChange();
          localStorage.removeItem('token');
          const newAuthorizationButtonHeader = document.querySelector('.header__menu-item_registration');
          newAuthorizationButtonHeader.addEventListener('click', (event)=>{
            popup.open(event);
          });
        })
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(()=>{
      });
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(()=>{
      popupButtonEnter.textContent = "Войти";
    });



    enterForm.reset();
    popupButtonEnter.setAttribute('disabled','disabled');
    popup.successEntering();

    event.preventDefault();
  });

  //процесс поиска карточек на ApiNews и отрисовка их в DOM
  leadForm.addEventListener('submit', (event) => {
    event.preventDefault();
    dom.cleanResultsContainer();
    //проверяем ввел ли пользователь ключевые слова
    keyWords =  document.getElementById('input_lead').value;
    if (keyWords === undefined || keyWords === null|| keyWords ===""){
      inputLead.removeAttribute('placeholder');
      inputLead.setAttribute('placeholder', 'Нужно ввести ключевое слово');
      return
    }
    //закрываем секцию прошлых поисков
    if(resultsSection.classList.contains('results_main-on')){
      dom.resultsSectionSwith();
    }
    //закрываем секцию ненайденных результатов
    if(noResultsSection.classList.contains('no-results-section_on')){
      dom.noResultsSectionSwith();
    }
    //запускаем процесс поиска новостей
    dom.spinnerSwitch();
    newsApi.getNewsFromServer(keyWords)
    .then((cardsArray) =>{
      // ниже мы обнуляем счетчик для новых поисков
      newsCounter = 2;
      // ниже записываем полученный массив в переменную, чтоб позже мы могли ее использовать
      foundNews = cardsArray;
      //

      if(cardsArray.length == 0){
        dom.spinnerSwitch();
        dom.noResultsSectionSwith()
        throw new Error ('К сожалению по вашему запросу ничего не нашлось');
      }
      dom.printNews(cardsArray, newsCounter, api.saveDeleteNewsClicker, keyWords, baseUrl, pageSwitch, utils.dateParse);
    })
    .then(()=>{
      dom.spinnerSwitch();
      dom.resultsSectionSwith();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(()=>{
    });

  });

  //подгрузка дополнительных карт к просмотру
  resultsButton.addEventListener('click',() =>{
    dom.printAddNews(foundNews, newsCounter, keyWords, pageSwitch, resultsButton, utils.dateParse, api.saveDeleteNewsClicker, baseUrl)
    newsCounter = newsCounter + 3;
  })
  //отрисовка хедера страницы
 const headerPaint = () => {
    if(Boolean(localStorage.token)){
      api.getInfoAboutMe()
      .then((res)=>{
        const savedNewsButtonForMembers = document.createElement('a');
        const exitButtonForMembers = document.createElement('a');
        dom.headerLoginChange(res.data, savedNewsButtonForMembers, exitButtonForMembers)
      })
      .then(()=>{

        headerMenu.firstElementChild.classList.add('header__menu-item_white');
        headerMenu.firstElementChild.nextElementSibling.classList.add('header__menu-item_white');
        headerMenu.lastElementChild.classList.add('header__menu-item_white');
        headerMenu.lastElementChild.classList.add('header__menu-item_exit-white');
        document.querySelector('.header__menu-item-exit-icon').classList.add('header__menu-item-exit-icon_white');

        document.querySelector('.header__menu-item_exit-white').addEventListener('click',()=>{
          dom.headerLogoutChange();
          localStorage.removeItem('token');
          const newAuthorizationButtonHeader = document.querySelector('.header__menu-item_registration');
          newAuthorizationButtonHeader.addEventListener('click', (event)=>{
            popup.open(event);
          });
        })
      })
      .catch(err => console.log(err))
    }
  }

  headerPaint();
  //вешаем слушатели на кнопку и поля форм
  enterFormValidator.setEventListeners();
  logupFormValidator.setEventListeners();

};

pageFunctional();
