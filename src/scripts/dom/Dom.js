export default class Dom {
  constructor(
    headerMenu,
    authorizationButtonHeader,
    resultsContainer,
    spinnerSection,
    resultsSection,
    noResultsSection
  )
  {
    this.headerMenu = headerMenu;
    this.authorizationButtonHeader = authorizationButtonHeader;
    this.resultsContainer = resultsContainer;
    this.spinnerSection = spinnerSection;
    this.resultsSection = resultsSection;
    this.noResultsSection = noResultsSection;
  }

  resultsSectionSwith(){
    this.resultsSection.classList.toggle('results_main-on');
    this.resultsSection.classList.toggle('results_main-off');
  }

  noResultsSectionSwith(){
    this.noResultsSection.classList.toggle('no-results-section_on');
    this.noResultsSection.classList.toggle('no-results-section_off');
  }

  cleanResultsContainer(){
    this.resultsContainer.innerHTML='';
  }

  spinnerSwitch(){
    this.spinnerSection.classList.toggle('spinner-section_on');
    this.spinnerSection.classList.toggle('spinner-section_off');
  }

  headerLoginChange(obj, savedNewsButton, exitButton){
    this.headerMenu.classList.add('header__menu_saved');
    this.headerMenu.classList.remove('header__menu_index');

    this.headerMenu.innerHTML='';
    this.headerMenu.innerHTML = `
      <a href="index.html" class="header__menu-item header__menu-item_main">Главная</a>
      <a href="savedNews.html" class="header__menu-item ">Сохраненные статьи</a>
      <a href="#" class="header__menu-item"><div class = "header__menu-item-exit-text">${obj.name}</div><div class = "header__menu-item-exit-icon " ></div></a>
    `
  }

  headerLogoutChange(){
    this.headerMenu.classList.remove('header__menu_saved');
    this.headerMenu.classList.add('header__menu_index');

    this.headerMenu.innerHTML='';
    this.headerMenu.innerHTML = `
    <a href="index.html" class="header__menu-item header__menu-item_white header__menu-item_main">Главная</a>
    <a href="#" class="header__menu-item header__menu-item_white header__menu-item_registration">Авторизироваться</a>
    `
  }

  createNews(item, resultsContainerItem, keyWords, pageSwitch, dateParse){

    if(pageSwitch == "main"){
     const dateToPrint = dateParse(item.publishedAt);
      return resultsContainerItem.innerHTML=`
      <div data-link="${item.url}" data-title="${item.title}" data-author="${item.author}" data-keyword="${keyWords}" data-text="${item.description}" data-date="${item.publishedAt}" data-source="${item.source.name}" data-image="${item.urlToImage}" class ="results-container__image-container results-container__image-container_first">
        <img src ="${item.urlToImage}" alt = "" class = results-container__image>
        <input class = "results-container__checkbox"  type="checkbox" id="${item.url}">
        <label class="results-container__checkbox-label" for="${item.url}" >
         <span class = "results-container__checkbox-icon results-container__checkbox-icon_saved"></span>
        </label>
          <span class="results-container__span results-container__span_message">Войдите чтобы сохранять статьи</span>
      </div>
      <div class ="results-container__data-container">
        <time class = "results-container__time" datetime="${item.publishedAt}">${dateToPrint}</time>
        <h3 class ="results-container__header">${item.title}</h3>
        <p class ="results-container__paragraph">${item.description}</p>
        <a class ="results-container__href" href="${item.url}">${item.source.name}</a>
      </div>
      `
    }

    if(pageSwitch == "second"){
      const dateToPrint = dateParse(item.date);
      return resultsContainerItem.innerHTML=`
      <div data-link="${item.link}" data-title="${item.title}" data-author="${item.source}" data-keyword="${item.keyword}" data-text="${item.text}" data-date="${item.date}" data-source="${item.source.name}" data-_id="${item._id}" data-image="${item.image}" class ="results-container__image-container results-container__image-container_first">
        <img src ="${item.image}" alt = "" class = results-container__image>
        <input class = "results-container__checkbox"  type="checkbox" checked id="${item.link}">
        <label class="results-container__checkbox-label" for="${item.link}" >
        <span class = "results-container__checkbox-icon results-container__checkbox-icon_trash"></span>
        </label>
        <span class="results-container__span results-container__span_delete-news">Убрать из сохраненных</span>
      </div>
      <div class ="results-container__data-container">
        <time class = "results-container__time" datetime="${item.date}">${dateToPrint}</time>
        <h3 class ="results-container__header">${item.title}</h3>
        <p class ="results-container__paragraph">${item.text}</p>
        <a class ="results-container__href" href="${item.link}">${item.source}</a>
      </div>
      `
    }


  }

  printNews(newsArray, newsCounter, saveDeleteNewsClicker, keyWords, baseUrl, pageSwitch, dateParse){

    for ( let i = 0; i <= newsCounter; i++){
      if(i > newsArray.length){
        break;
      }
      const resultsContainerItem = document.createElement('div');
      resultsContainerItem.classList.add('results-container__item');
      this.createNews(newsArray[i], resultsContainerItem, keyWords,pageSwitch, dateParse);
      this.resultsContainer.appendChild(resultsContainerItem);
      const lastElementOfResults = this.resultsContainer.lastElementChild.querySelector('.results-container__checkbox-label');
      lastElementOfResults.addEventListener('click', (event)=> {
        saveDeleteNewsClicker(event, lastElementOfResults.parentElement, baseUrl);
      });
    }
  }

  printSavedNews(newsArray, newsCounter, saveDeleteNewsClicker, baseUrl, pageSwitch,dateParse){
    for ( let i = 0; i <= newsCounter; i++){
      if(i >= newsArray.length){
        break;
      }
      const resultsContainerItem = document.createElement('div');
      resultsContainerItem.classList.add('results-container__item');

      this.createNews(newsArray[i], resultsContainerItem, newsArray[i].keyword, pageSwitch, dateParse);
      this.resultsContainer.appendChild(resultsContainerItem);
      const lastElementOfResults = this.resultsContainer.lastElementChild.querySelector('.results-container__checkbox-label');
      lastElementOfResults.addEventListener('click', (event)=> {
        saveDeleteNewsClicker(event, lastElementOfResults.parentElement, baseUrl);
      });
    }
  }

  printAddNews(newsArray, newsCounter, keyWords, pageSwitch, addButton, dateParse){
    let newsCounterPlusThree = newsCounter + 3;
    newsCounter++;
    for ( newsCounter; newsCounter <= newsCounterPlusThree; newsCounter++){
      if( newsCounter >= newsArray.length ){
        addButton.classList.add('button_results-display-none');
        break;
      }
      const resultsContainerItem = document.createElement('div');
      resultsContainerItem.classList.add('results-container__item');
      this.createNews(newsArray[newsCounter], resultsContainerItem, keyWords, pageSwitch, dateParse);
      this.resultsContainer.appendChild(resultsContainerItem);
    }
  }

  headerParagraphSavedPaint(userName, savedNews, keyword, resultsHeaderSaved, nubmerOfRepeat,resultsParagraph){
    // отрисовка параграфа сохранненных статей, в зависимости от кол-ва ключевых слов
    if(Object.keys(nubmerOfRepeat).length >= 3){
      const firstWord = nubmerOfRepeat[Object.keys(nubmerOfRepeat)[Object.keys(nubmerOfRepeat).length - 1]];
      const secondWord = nubmerOfRepeat[Object.keys(nubmerOfRepeat)[Object.keys(nubmerOfRepeat).length - 2]];
      const nubmerOfRepeatLength = Object.keys(nubmerOfRepeat).length - 2;
      resultsHeaderSaved.innerHTML = `${userName.name}, у вас ${savedNews.length} <br> сохраненных статей`;
      resultsParagraph.innerHTML = `По ключевым словам : ${firstWord}, ${secondWord} и <b>${nubmerOfRepeatLength}-м другим</b>`
    }
    if(Object.keys(nubmerOfRepeat).length == 2){
      const firstWord = nubmerOfRepeat[Object.keys(nubmerOfRepeat)[Object.keys(nubmerOfRepeat).length - 1]];
      const secondWord = nubmerOfRepeat[Object.keys(nubmerOfRepeat)[Object.keys(nubmerOfRepeat).length - 2]];
      resultsHeaderSaved.innerHTML = `${userName.name}, у вас ${savedNews.length}-е <br> сохраненных статьи`;
      resultsParagraph.innerHTML = `По ключевым словам : ${firstWord} и ${secondWord}`
    }
    if(Object.keys(nubmerOfRepeat).length == 1){
      const firstWord = nubmerOfRepeat[Object.keys(nubmerOfRepeat)[Object.keys(nubmerOfRepeat).length - 1]];
      resultsHeaderSaved.innerHTML = `${userName.name}, у вас ${savedNews.length} <br> сохраненная статья`;
      resultsParagraph.innerHTML = `По ключевому слову : ${firstWord}`
    }
    if(Object.keys(nubmerOfRepeat).length == 0){
      resultsHeaderSaved.innerHTML = `${userName.name}, у вас нет <br> сохраненных статей`;
       resultsParagraph.innerHTML = ``
    }


  }

}