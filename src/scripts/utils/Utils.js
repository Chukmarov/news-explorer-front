export default class Utils {
  constructor(){
  }
  dateParse(date){
    const day = new Date(date);
    let monthToday = day.getMonth();
    const monthObj ={
      0:"января",
      1:"февраля",
      2:"марта",
      3:"апреля",
      4:"мая",
      5:"июня",
      6:"июля",
      7:"августа",
      8:"сентября",
      9:"октября",
      10:"ноября",
      11:"декабря",
    }
    const monthTodayInWOrd = monthObj[monthToday];
    const parseDay = `${day.getDate()} ${monthTodayInWOrd}, ${day.getFullYear()}`;
    return parseDay;
  }
}