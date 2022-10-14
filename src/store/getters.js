const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  option:state=>state.option.option,
  activeMenu:state=>state.user.menuActive,
}
export default getters
