export default class Popup{
  constructor(popupEnter, popupLogup, popupSuccess,popupSpanName){

    this.popupEnter=popupEnter;
    this.popupLogup=popupLogup;
    this.popupSuccess=popupSuccess;
    this.popupSpanName=popupSpanName;

  }

  open(event){

    if(event.target.classList.contains('header__menu-item_registration') || event.target.classList.contains('mobile-menu__link_registration')){
      this.popupLogup.classList.toggle('popup_switch-off');
      this.popupLogup.classList.toggle('popup_switch-on');
    }

    if (event.target.classList.contains('popup__anchor_enter')||event.target.classList.contains('popup__anchor_registration')){
      this.popupLogup.classList.toggle('popup_switch-off');
      this.popupLogup.classList.toggle('popup_switch-on');
      this.popupEnter.classList.toggle('popup_switch-off');
      this.popupEnter.classList.toggle('popup_switch-on');
    }

  }

  successRegistration(){
    this.popupLogup.classList.toggle('popup_switch-off');
    this.popupLogup.classList.toggle('popup_switch-on');
    this.popupSuccess.classList.toggle('popup_switch-off');
    this.popupSuccess.classList.toggle('popup_switch-on');
  }

  successEntering(){
    this.popupEnter.classList.toggle('popup_switch-off');
    this.popupEnter.classList.toggle('popup_switch-on');
  }

  close(event){
    if(event.target.classList.contains('popup__close_logup')){
      this.popupLogup.classList.toggle('popup_switch-off');
      this.popupLogup.classList.toggle('popup_switch-on');
      this.popupSpanName.textContent = " ";
    }

    if(event.target.classList.contains('popup__close_enter')){
      this.popupEnter.classList.toggle('popup_switch-off');
      this.popupEnter.classList.toggle('popup_switch-on');
    }

    if(event.target.classList.contains('popup__close_success')){
      this.popupSuccess.classList.toggle('popup_switch-off');
      this.popupSuccess.classList.toggle('popup_switch-on');
    }

    if(event.target.classList.contains('popup__anchor_success')){
      this.popupSuccess.classList.toggle('popup_switch-off');
      this.popupSuccess.classList.toggle('popup_switch-on');
      this.popupEnter.classList.toggle('popup_switch-off');
      this.popupEnter.classList.toggle('popup_switch-on');
    }

  }
}
