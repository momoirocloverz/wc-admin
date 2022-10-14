export function checkIdenity() {
  let checkDataGuy = sessionStorage.getItem('loginGuy') && JSON.parse(sessionStorage.getItem('loginGuy'));
  if (checkDataGuy) {
    return {
      town_id: checkDataGuy.town_id,
      village_id: checkDataGuy.village_id,
    };
  }
}
